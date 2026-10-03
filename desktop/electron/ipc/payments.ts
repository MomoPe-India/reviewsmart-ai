import { IpcMain } from 'electron'
import { prisma } from '../prisma'

export function registerPaymentHandlers(ipcMain: IpcMain): void {

  // GET ALL PAYMENTS
  ipcMain.handle('payments:getAll', async () => {
    try {
      const payments = await prisma.upiPayment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true, email: true, phone: true,
              businesses: { select: { name: true, slug: true, isPaid: true } }
            }
          }
        }
      })
      return { success: true, payments }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // APPROVE PAYMENT
  ipcMain.handle('payments:approve', async (_, paymentId: string) => {
    try {
      const payment = await prisma.upiPayment.findUnique({ where: { id: paymentId } })
      if (!payment) return { success: false, error: 'Payment not found.' }

      const settings = await prisma.platformSetting.findUnique({ where: { id: 'default' } })
      let effectiveCommissionRate = settings?.commissionRate ?? 0.30

      let resolvedAgentId = payment.agentId
      const isAgentDeal = Boolean(payment.agentId || payment.agentCode)

      if (payment.agentId) {
        const agentUser = await prisma.user.findUnique({ where: { id: payment.agentId }, select: { commissionRate: true } })
        if (agentUser?.commissionRate != null) effectiveCommissionRate = agentUser.commissionRate
      } else if (payment.agentCode) {
        const agentUser = await prisma.user.findFirst({
          where: { OR: [{ agentCode: payment.agentCode }, { userIdTag: payment.agentCode }] },
          select: { id: true, commissionRate: true }
        })
        if (agentUser) {
          resolvedAgentId = agentUser.id
          if (agentUser.commissionRate != null) effectiveCommissionRate = agentUser.commissionRate
        }
      }

      const commission = isAgentDeal ? Math.round(payment.amount * effectiveCommissionRate * 100) / 100 : null

      await prisma.upiPayment.update({
        where: { id: paymentId },
        data: {
          status: 'APPROVED',
          commission,
          ...(resolvedAgentId && !payment.agentId ? { agentId: resolvedAgentId } : {})
        }
      })

      if (payment.businessId) {
        await prisma.business.update({
          where: { id: payment.businessId },
          data: { isPaid: true, ...(payment.packageTier ? { packageTier: payment.packageTier } : {}) }
        })
      }

      const commissionMsg = commission
        ? ` Agent earns ₹${commission.toFixed(2)} (${Math.round(effectiveCommissionRate * 100)}%) commission.`
        : ''

      return { success: true, commission, message: `Payment approved! Business card is now LIVE.${commissionMsg}` }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // REJECT PAYMENT
  ipcMain.handle('payments:reject', async (_, paymentId: string) => {
    try {
      await prisma.upiPayment.update({ where: { id: paymentId }, data: { status: 'REJECTED' } })
      return { success: true, message: 'Payment rejected. Business card remains inactive.' }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // MARK COMMISSION PAID
  ipcMain.handle('payments:markCommissionPaid', async (_, paymentId: string) => {
    try {
      await prisma.upiPayment.update({ where: { id: paymentId }, data: { commissionPaid: true } })
      return { success: true, message: 'Commission marked as paid.' }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })
}
