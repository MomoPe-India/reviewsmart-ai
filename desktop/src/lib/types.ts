// TypeScript types matching the Prisma models used in the desktop app

export interface Business {
  id: string
  name: string
  slug: string
  tagline?: string | null
  category?: string | null
  logoUrl?: string | null
  primaryColor: string
  googlePlaceId?: string | null
  googleReviewUrl?: string | null
  googleAddress?: string | null
  phone?: string | null
  whatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  website?: string | null
  minRatingForGoogle: number
  tagChips: string
  keywords: string
  reviewPromptTone: string
  qrMode: string
  packageTier: string
  isPaid: boolean
  demoExpiresAt?: string | null
  demoUsed: boolean
  isDemoActive?: boolean
  createdAt: string
  updatedAt: string
  customerType: string
}

export interface Payment {
  id: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  agentCode?: string | null
  agentId?: string | null
  commission?: number | null
  commissionPaid: boolean
  utrNumber: string
  packageTier?: string | null
  planType: string
  notes?: string | null
  createdAt: string
}

export interface Merchant {
  id: string
  name: string
  phone?: string | null
  userIdTag?: string | null
  email: string
  customerType: string
  isActive: boolean
  referredBy?: string | null
  createdAt: string
  businesses: Business[]
  upiPayments: Payment[]
  totalPaid: number
  dealCount: number
}

export interface Agent {
  id: string
  name: string
  email: string
  phone?: string | null
  userIdTag?: string | null
  agentCode?: string | null
  commissionRate?: number | null
  isActive: boolean
  createdAt: string
  dealsClosed: number
  totalRevenue: number
  totalCommission: number
  pendingDeals: number
}

export interface PlatformSettings {
  id: string
  platformName: string
  supportEmail: string
  supportWhatsapp: string
  currencySymbol: string
  upiId: string
  upiPayeeName: string
  minNegotiatedPrice: number
  commissionRate: number
}

export interface DashboardStats {
  merchantCount: number
  agentCount: number
  activeMerchants: number
  pendingPaymentCount: number
  totalRevenue: number
  totalCommission: number
  recentPayments: (Payment & { user: { name: string; businesses: { name: string; slug: string }[] } })[]
}

export interface PaymentWithUser extends Payment {
  user: {
    name: string
    email: string
    phone?: string | null
    businesses: { name: string; slug: string; isPaid: boolean }[]
  }
}

export type Screen =
  | 'dashboard'
  | 'merchants'
  | 'merchant-editor'
  | 'agents'
  | 'payments'
  | 'settings'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
