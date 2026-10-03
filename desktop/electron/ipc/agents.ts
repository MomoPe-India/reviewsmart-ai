import { IpcMain } from 'electron'
import { prisma } from '../prisma'
import * as bcrypt from 'bcryptjs'

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin.trim(), 10)
}

export function registerAgentHandlers(ipcMain: IpcMain): void {

  // GET ALL AGENTS with deal stats
  ipcMain.handle('agents:getAll', async () => {
    try {
      const agents = await prisma.user.findMany({
        where: { role: 'MARKETING_AGENT' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true,
          userIdTag: true, agentCode: true, commissionRate: true,
          isActive: true, createdAt: true,
        }
      })

      const agentStats = await Promise.all(agents.map(async (agt: any) => {
        const payments = await prisma.upiPayment.findMany({
          where: {
            OR: [
              { agentId: agt.id },
              ...(agt.agentCode ? [{ agentCode: agt.agentCode }] : []),
              ...(agt.userIdTag ? [{ agentCode: agt.userIdTag }] : []),
            ]
          },
          select: { amount: true, status: true, commission: true }
        })

        const approved = payments.filter(p => p.status === 'APPROVED')
        const pending = payments.filter(p => p.status === 'PENDING')
        return {
          ...agt,
          dealsClosed: approved.length,
          totalRevenue: approved.reduce((s, p) => s + (p.amount || 0), 0),
          totalCommission: approved.reduce((s, p) => s + (p.commission || 0), 0),
          pendingDeals: pending.length,
        }
      }))

      return { success: true, agents: agentStats }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // CREATE AGENT
  ipcMain.handle('agents:create', async (_, data: any) => {
    try {
      const { name, phone, agentCode, pin, commissionRate } = data
      if (!name || !agentCode || !pin) return { success: false, error: 'Name, Agent Code, and PIN are required.' }

      const cleanCode = String(agentCode).trim().toUpperCase()
      const cleanPin = String(pin).replace(/[^0-9]/g, '').slice(0, 4)
      const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, '').slice(-10) : null
      if (cleanPin.length !== 4) return { success: false, error: 'PIN must be exactly 4 digits.' }

      let parsedCommission = 0.30
      if (commissionRate) {
        const num = Number(commissionRate)
        if (!isNaN(num) && num > 0) parsedCommission = num > 1 ? Math.round(num) / 100 : num
      }

      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { agentCode: cleanCode },
            { userIdTag: cleanCode },
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ]
        }
      })
      if (existing) return { success: false, error: `Agent code ${cleanCode} or phone is already registered.` }

      const hashedPin = await hashPin(cleanPin)
      const newAgent = await prisma.user.create({
        data: {
          name: name.trim(),
          email: `${cleanCode.toLowerCase()}@agent.reviewsmart.local`,
          phone: cleanPhone,
          userIdTag: cleanCode,
          agentCode: cleanCode,
          commissionRate: parsedCommission,
          pinCode: hashedPin,
          password: hashedPin,
          role: 'MARKETING_AGENT',
          isActive: true,
        },
        select: { id: true, name: true, agentCode: true, commissionRate: true, phone: true, userIdTag: true, createdAt: true, isActive: true }
      })

      return { success: true, agent: newAgent, pin: cleanPin }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // UPDATE AGENT
  ipcMain.handle('agents:update', async (_, data: any) => {
    try {
      const { agentId, name, phone, agentCode, commissionRate, pin } = data
      if (!agentId) return { success: false, error: 'agentId is required.' }

      const agent = await prisma.user.findUnique({ where: { id: agentId } })
      if (!agent) return { success: false, error: 'Agent not found.' }

      const cleanCode = agentCode ? String(agentCode).trim().toUpperCase() : agent.agentCode
      const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, '').slice(-10) : agent.phone

      const updateData: Record<string, unknown> = {
        name: name ? String(name).trim() : agent.name,
        phone: cleanPhone,
        agentCode: cleanCode,
        userIdTag: cleanCode,
        email: `${(cleanCode || 'agent').toLowerCase()}@agent.reviewsmart.local`,
      }

      if (commissionRate !== undefined && commissionRate !== '') {
        const num = Number(commissionRate)
        if (!isNaN(num) && num > 0) updateData.commissionRate = num > 1 ? Math.round(num) / 100 : num
      }

      if (pin && /^\d{4}$/.test(String(pin))) {
        const hashed = await hashPin(String(pin))
        updateData.pinCode = hashed
        updateData.password = hashed
      }

      const updated = await prisma.user.update({
        where: { id: agentId },
        data: updateData,
        select: { id: true, name: true, agentCode: true, commissionRate: true, phone: true, userIdTag: true, isActive: true, createdAt: true }
      })

      // Sync agent code on historical payments
      if (cleanCode && cleanCode !== agent.agentCode) {
        await prisma.upiPayment.updateMany({ where: { agentId }, data: { agentCode: cleanCode } })
      }

      return { success: true, agent: updated }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // DELETE AGENT
  ipcMain.handle('agents:delete', async (_, id: string) => {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.upiPayment.updateMany({ where: { agentId: id }, data: { agentId: null } })
        await tx.user.updateMany({ where: { referredBy: id }, data: { referredBy: null } })
        const bizs = await tx.business.findMany({ where: { userId: id }, select: { id: true } })
        if (bizs.length > 0) {
          const ids = bizs.map(b => b.id)
          await tx.reviewAnalytics.deleteMany({ where: { businessId: { in: ids } } })
          await tx.privateFeedback.deleteMany({ where: { businessId: { in: ids } } })
          await tx.business.deleteMany({ where: { userId: id } })
        }
        await tx.userSubscription.deleteMany({ where: { userId: id } })
        await tx.upiPayment.deleteMany({ where: { userId: id } })
        await tx.user.delete({ where: { id } })
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // TOGGLE ACTIVE
  ipcMain.handle('agents:toggleActive', async (_, id: string) => {
    try {
      const agent = await prisma.user.findUnique({ where: { id }, select: { isActive: true, name: true } })
      if (!agent) return { success: false, error: 'Agent not found.' }
      const updated = await prisma.user.update({ where: { id }, data: { isActive: !agent.isActive } })
      return { success: true, isActive: updated.isActive, message: `${agent.name} is now ${updated.isActive ? 'ACTIVE' : 'SUSPENDED'}.` }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // RESET PIN
  ipcMain.handle('agents:resetPin', async (_, id: string, customPin?: string) => {
    try {
      const newPin = customPin && /^\d{4}$/.test(customPin) ? customPin : generatePin()
      const hashed = await hashPin(newPin)
      const agent = await prisma.user.findUnique({ where: { id }, select: { name: true, phone: true } })
      await prisma.user.update({ where: { id }, data: { pinCode: hashed, password: hashed } })
      return { success: true, pin: newPin, agentName: agent?.name, agentPhone: agent?.phone }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })
}
