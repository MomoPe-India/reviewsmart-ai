// API bridge — all calls go through window.api (Electron IPC)
// In dev, falls back gracefully if window.api is not available

const api = (window as any).api

export const API = {
  // Dashboard
  getDashboardStats: () => api.getDashboardStats(),

  // Merchants
  getMerchants: () => api.getMerchants(),
  getMerchant: (id: string) => api.getMerchant(id),
  createMerchant: (data: object) => api.createMerchant(data),
  updateMerchant: (data: object) => api.updateMerchant(data),
  deleteMerchant: (id: string) => api.deleteMerchant(id),
  toggleMerchantActive: (id: string) => api.toggleMerchantActive(id),
  resetMerchantPin: (id: string, pin?: string) => api.resetMerchantPin(id, pin),
  activateMerchantDemo: (businessId: string) => api.activateMerchantDemo(businessId),
  approveMerchantPayment: (businessId: string, amount: number, packageTier: string) =>
    api.approveMerchantPayment(businessId, amount, packageTier),
  resolveGoogleUrl: (url: string) => api.resolveGoogleUrl(url),
  generateAiChips: (businessType: string, businessName: string) => api.generateAiChips(businessType, businessName),

  // Agents
  getAgents: () => api.getAgents(),
  createAgent: (data: object) => api.createAgent(data),
  updateAgent: (data: object) => api.updateAgent(data),
  deleteAgent: (id: string) => api.deleteAgent(id),
  toggleAgentActive: (id: string) => api.toggleAgentActive(id),
  resetAgentPin: (id: string, pin?: string) => api.resetAgentPin(id, pin),

  // Payments
  getPayments: () => api.getPayments(),
  approvePayment: (paymentId: string) => api.approvePayment(paymentId),
  rejectPayment: (paymentId: string) => api.rejectPayment(paymentId),
  markCommissionPaid: (paymentId: string) => api.markCommissionPaid(paymentId),

  // Settings
  getSettings: () => api.getSettings(),
  updateSettings: (data: object) => api.updateSettings(data),

  // Shell
  openExternal: (url: string) => api.openExternal(url),
}

export function formatCurrency(amount: number, symbol = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function getMerchantStatus(merchant: { isActive: boolean; businesses: { isPaid: boolean; isDemoActive?: boolean }[] }): {
  label: string
  color: string
} {
  if (!merchant.isActive) return { label: 'Suspended', color: 'red' }
  const biz = merchant.businesses[0]
  if (!biz) return { label: 'No Business', color: 'gray' }
  if (biz.isPaid) return { label: 'Active', color: 'green' }
  if (biz.isDemoActive) return { label: 'Demo', color: 'yellow' }
  return { label: 'Inactive', color: 'gray' }
}

export function getReviewPageUrl(slug: string): string {
  return `https://www.reviewsmart.online/r/${slug}`
}
