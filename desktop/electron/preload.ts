import { contextBridge, ipcRenderer } from 'electron'

// Expose a safe API to the renderer process
const api = {
  // ── Dashboard ────────────────────────────────────────────────────────────────
  getDashboardStats: () => ipcRenderer.invoke('dashboard:getStats'),

  // ── Merchants ────────────────────────────────────────────────────────────────
  getMerchants: () => ipcRenderer.invoke('merchants:getAll'),
  getMerchant: (id: string) => ipcRenderer.invoke('merchants:getOne', id),
  createMerchant: (data: unknown) => ipcRenderer.invoke('merchants:create', data),
  updateMerchant: (data: unknown) => ipcRenderer.invoke('merchants:update', data),
  deleteMerchant: (id: string) => ipcRenderer.invoke('merchants:delete', id),
  toggleMerchantActive: (id: string) => ipcRenderer.invoke('merchants:toggleActive', id),
  resetMerchantPin: (id: string, pin?: string) => ipcRenderer.invoke('merchants:resetPin', id, pin),
  activateMerchantDemo: (businessId: string) => ipcRenderer.invoke('merchants:activateDemo', businessId),
  approveMerchantPayment: (businessId: string, amount: number, packageTier: string) =>
    ipcRenderer.invoke('merchants:approvePayment', businessId, amount, packageTier),
  resolveGoogleUrl: (url: string) => ipcRenderer.invoke('merchants:resolveGoogleUrl', url),
  generateAiChips: (businessType: string, businessName: string) =>
    ipcRenderer.invoke('merchants:generateAiChips', businessType, businessName),

  // ── Agents ───────────────────────────────────────────────────────────────────
  getAgents: () => ipcRenderer.invoke('agents:getAll'),
  createAgent: (data: unknown) => ipcRenderer.invoke('agents:create', data),
  updateAgent: (data: unknown) => ipcRenderer.invoke('agents:update', data),
  deleteAgent: (id: string) => ipcRenderer.invoke('agents:delete', id),
  toggleAgentActive: (id: string) => ipcRenderer.invoke('agents:toggleActive', id),
  resetAgentPin: (id: string, pin?: string) => ipcRenderer.invoke('agents:resetPin', id, pin),

  // ── Payments ─────────────────────────────────────────────────────────────────
  getPayments: () => ipcRenderer.invoke('payments:getAll'),
  approvePayment: (paymentId: string) => ipcRenderer.invoke('payments:approve', paymentId),
  rejectPayment: (paymentId: string) => ipcRenderer.invoke('payments:reject', paymentId),
  markCommissionPaid: (paymentId: string) => ipcRenderer.invoke('payments:markCommissionPaid', paymentId),

  // ── Settings ─────────────────────────────────────────────────────────────────
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (data: unknown) => ipcRenderer.invoke('settings:update', data),

  // ── Shell ────────────────────────────────────────────────────────────────────
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
