import { IpcMain } from 'electron'
import { prisma } from '../prisma'

export function registerSettingsHandlers(ipcMain: IpcMain): void {

  ipcMain.handle('settings:get', async () => {
    try {
      const settings = await prisma.platformSetting.findUnique({ where: { id: 'default' } })
      return { success: true, settings }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('settings:update', async (_, data: any) => {
    try {
      const updated = await prisma.platformSetting.upsert({
        where: { id: 'default' },
        update: {
          platformName: data.platformName || 'ReviewSmart AI',
          supportEmail: data.supportEmail || 'momopedeals@gmail.com',
          supportWhatsapp: data.supportWhatsapp || '+918639831132',
          currencySymbol: data.currencySymbol || '₹',
          upiId: data.upiId || 'momopedeals@oksbi',
          upiPayeeName: data.upiPayeeName || 'Damerla Mohan',
          minNegotiatedPrice: Number(data.minNegotiatedPrice) || 1999,
          commissionRate: Number(data.commissionRate) || 0.30,
        },
        create: {
          id: 'default',
          platformName: data.platformName || 'ReviewSmart AI',
          supportEmail: data.supportEmail || 'momopedeals@gmail.com',
          supportWhatsapp: data.supportWhatsapp || '+918639831132',
          currencySymbol: data.currencySymbol || '₹',
          upiId: data.upiId || 'momopedeals@oksbi',
          upiPayeeName: data.upiPayeeName || 'Damerla Mohan',
          minNegotiatedPrice: Number(data.minNegotiatedPrice) || 1999,
          commissionRate: Number(data.commissionRate) || 0.30,
        }
      })
      return { success: true, settings: updated }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })
}
