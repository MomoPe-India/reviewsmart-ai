import React, { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ExternalLink,
  Edit2,
  Lock,
  Trash2,
  CheckCircle,
  Clock,
  KeyRound,
  ShieldAlert,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { Merchant, Screen } from '@/lib/types'
import { API, formatCurrency, formatDate, getMerchantStatus, getReviewPageUrl } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ConfirmModal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'

interface MerchantsProps {
  onNavigate: (screen: Screen, context?: any) => void
  showToast: (type: 'success' | 'error' | 'info', message: string) => void
}

export function Merchants({ onNavigate, showToast }: MerchantsProps) {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DEMO' | 'INACTIVE' | 'SUSPENDED'>('ALL')

  // Modals & action states
  const [deleteTarget, setDeleteTarget] = useState<Merchant | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [pinModalData, setPinModalData] = useState<{ merchantName: string; pin: string } | null>(null)

  const fetchMerchants = async () => {
    setLoading(true)
    try {
      const res = await API.getMerchants()
      if (res.success) {
        setMerchants(res.merchants || [])
      } else {
        showToast('error', res.error || 'Failed to fetch merchants')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error connecting to database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMerchants()
  }, [])

  // Filtered merchants
  const filtered = useMemo(() => {
    return merchants.filter((m) => {
      const biz = m.businesses[0]
      const status = getMerchantStatus(m)

      // Search match
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.phone?.includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        biz?.name?.toLowerCase().includes(q) ||
        biz?.slug?.toLowerCase().includes(q) ||
        biz?.category?.toLowerCase().includes(q)

      // Status match
      let matchesStatus = true
      if (statusFilter === 'ACTIVE') matchesStatus = status.label === 'Active'
      if (statusFilter === 'DEMO') matchesStatus = status.label === 'Demo'
      if (statusFilter === 'INACTIVE') matchesStatus = status.label === 'Inactive'
      if (statusFilter === 'SUSPENDED') matchesStatus = status.label === 'Suspended'

      return matchesSearch && matchesStatus
    })
  }, [merchants, searchTerm, statusFilter])

  // Actions
  const handleToggleActive = async (m: Merchant) => {
    try {
      const res = await API.toggleMerchantActive(m.id)
      if (res.success) {
        showToast('info', res.message || 'Account status updated')
        fetchMerchants()
      } else {
        showToast('error', res.error || 'Failed to toggle status')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    }
  }

  const handleResetPin = async (m: Merchant) => {
    try {
      const res = await API.resetMerchantPin(m.id)
      if (res.success) {
        setPinModalData({ merchantName: m.name, pin: res.pin })
      } else {
        showToast('error', res.error || 'Failed to reset PIN')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    }
  }

  const handleActivateDemo = async (m: Merchant) => {
    const biz = m.businesses[0]
    if (!biz) return
    try {
      const res = await API.activateMerchantDemo(biz.id)
      if (res.success) {
        showToast('success', '3-Day Evaluation Demo activated!')
        fetchMerchants()
      } else {
        showToast('error', res.error || 'Failed to activate demo')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    }
  }

  const handleQuickApprovePayment = async (m: Merchant) => {
    const biz = m.businesses[0]
    if (!biz) return
    if (!confirm(`Directly mark "${biz.name}" as LIVE without requiring a UPI payment verification?`)) return

    try {
      const res = await API.approveMerchantPayment(biz.id, 1999, biz.packageTier || 'EXECUTIVE_STANDEE')
      if (res.success) {
        showToast('success', res.message || 'Business card is now LIVE!')
        fetchMerchants()
      } else {
        showToast('error', res.error || 'Failed to activate business')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      const res = await API.deleteMerchant(deleteTarget.id)
      if (res.success) {
        showToast('success', `Merchant "${deleteTarget.name}" deleted.`)
        setDeleteTarget(null)
        fetchMerchants()
      } else {
        showToast('error', res.error || 'Failed to delete merchant')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete failed')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Merchants & Businesses</h1>
          <p className="text-sm text-slate-400">
            {merchants.length} total merchants on the live platform
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => onNavigate('merchant-editor')}
        >
          Add New Merchant
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search business name, phone, slug, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['ALL', 'ACTIVE', 'DEMO', 'INACTIVE', 'SUSPENDED'] as const).map((filter) => {
            const count =
              filter === 'ALL'
                ? merchants.length
                : merchants.filter((m) => {
                    const st = getMerchantStatus(m).label.toUpperCase()
                    return st === filter
                  }).length

            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === filter
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {filter} <span className="opacity-70 font-mono">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Merchants Table */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Business & Slug</th>
                  <th className="px-6 py-3.5">Contact / Phone</th>
                  <th className="px-6 py-3.5">Category & Tier</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Google Setup</th>
                  <th className="px-6 py-3.5">Revenue</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((m) => {
                  const biz = m.businesses[0]
                  const status = getMerchantStatus(m)
                  const hasPlaceId = Boolean(biz?.googlePlaceId)
                  const reviewUrl = biz?.slug ? getReviewPageUrl(biz.slug) : null

                  return (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Business & Slug */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {biz?.logoUrl ? (
                            <img
                              src={biz.logoUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-sm">
                              {(biz?.name || m.name || 'B').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate max-w-[200px]">
                              {biz?.name || m.name}
                            </div>
                            {biz?.slug ? (
                              <button
                                onClick={() => reviewUrl && API.openExternal(reviewUrl)}
                                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-0.5 truncate max-w-[200px]"
                                title="Open Live Review Page"
                              >
                                <span>/r/{biz.slug}</span>
                                <ExternalLink size={10} className="shrink-0" />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500 italic">No business slug</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-white">{m.phone || 'No Phone'}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[160px]">
                          {m.name}
                        </div>
                      </td>

                      {/* Category & Tier */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-300">{biz?.category || 'Local Business'}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {biz?.packageTier || 'EXECUTIVE_STANDEE'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge
                          color={
                            status.label === 'Active'
                              ? 'green'
                              : status.label === 'Demo'
                              ? 'yellow'
                              : status.label === 'Suspended'
                              ? 'red'
                              : 'gray'
                          }
                          dot
                        >
                          {status.label}
                        </Badge>
                        {biz?.isDemoActive && biz?.demoExpiresAt && (
                          <div className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1 font-mono">
                            <Clock size={10} />
                            Expires {formatDate(biz.demoExpiresAt)}
                          </div>
                        )}
                      </td>

                      {/* Google Setup */}
                      <td className="px-6 py-4">
                        {hasPlaceId ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <CheckCircle size={14} />
                            <span>Place ID Verified</span>
                          </div>
                        ) : biz?.googleReviewUrl ? (
                          <div className="flex items-center gap-1.5 text-xs text-amber-400">
                            <MapPin size={14} />
                            <span>Raw Link Only</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <ShieldAlert size={14} />
                            <span>Missing URL</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {biz?.qrMode === 'REVIEW_BOOSTER' ? 'Review Booster' : 'Smart Hub QR'}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        {formatCurrency(m.totalPaid || 0)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit Details */}
                          <button
                            onClick={() => onNavigate('merchant-editor', { merchantId: m.id, merchant: m })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Merchant & Review Settings"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Quick Activate Demo (if not paid and demo not used) */}
                          {!biz?.isPaid && !biz?.demoUsed && (
                            <button
                              onClick={() => handleActivateDemo(m)}
                              className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 transition-colors"
                              title="Activate 3-Day Demo"
                            >
                              <Sparkles size={15} />
                            </button>
                          )}

                          {/* Direct Mark as Paid */}
                          {!biz?.isPaid && (
                            <button
                              onClick={() => handleQuickApprovePayment(m)}
                              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                              title="Mark as LIVE (bypass payment flow)"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}

                          {/* Reset PIN */}
                          <button
                            onClick={() => handleResetPin(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                            title="Reset Merchant 4-digit PIN"
                          >
                            <KeyRound size={15} />
                          </button>

                          {/* Suspend / Unsuspend */}
                          <button
                            onClick={() => handleToggleActive(m)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              m.isActive
                                ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                : 'text-emerald-400 hover:bg-emerald-950/40'
                            }`}
                            title={m.isActive ? 'Suspend Account' : 'Reactivate Account'}
                          >
                            <Lock size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete Merchant"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <p className="text-base font-medium text-slate-300">No merchants matched your filter</p>
          <p className="text-xs text-slate-500">Try changing your search term or filter options</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Merchant"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? All associated QR cards, feedback, analytics, and generated reviews will be deleted from the database.`}
        confirmLabel="Delete Permanently"
        loading={actionLoading}
      />

      {/* New PIN Result Modal */}
      {pinModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPinModalData(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <KeyRound size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Merchant PIN Reset</h3>
              <p className="text-xs text-slate-400 mt-1">
                New login credentials for <span className="text-indigo-300 font-semibold">{pinModalData.merchantName}</span>:
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">4-Digit PIN</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 mt-1 tracking-widest">
                {pinModalData.pin}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Share this PIN with the merchant. They use their 10-digit mobile number and this PIN to login to their merchant console.
            </p>
            <Button variant="primary" size="md" className="w-full" onClick={() => setPinModalData(null)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
