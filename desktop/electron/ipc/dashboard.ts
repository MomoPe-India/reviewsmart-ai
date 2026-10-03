import { IpcMain } from 'electron'
import { prisma } from '../prisma'

export function registerDashboardHandlers(ipcMain: IpcMain): void {

  ipcMain.handle('dashboard:getStats', async () => {
    try {
      const [merchantCount, agentCount, allPayments, businesses] = await Promise.all([
        prisma.user.count({ where: { role: 'BUSINESS_OWNER' } }),
        prisma.user.count({ where: { role: 'MARKETING_AGENT' } }),
        prisma.upiPayment.findMany({
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: {
              select: {
                name: true,
                businesses: { select: { name: true, slug: true }, take: 1 }
              }
            }
          }
        }),
        prisma.business.count({ where: { isPaid: true } }),
      ])

      const approvedPayments = allPayments.filter(p => p.status === 'APPROVED')
      const pendingPayments = allPayments.filter(p => p.status === 'PENDING')
      const totalRevenue = approvedPayments.reduce((s, p) => s + p.amount, 0)
      const totalCommission = approvedPayments.reduce((s, p) => s + (p.commission || 0), 0)

      return {
        success: true,
        stats: {
          merchantCount,
          agentCount,
          activeMerchants: businesses,
          pendingPaymentCount: pendingPayments.length,
          totalRevenue,
          totalCommission,
          recentPayments: allPayments.slice(0, 10),
        }
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })
}
