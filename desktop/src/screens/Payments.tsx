import React, { useEffect, useState, useMemo } from 'react'
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { PaymentWithUser } from '@/lib/types'
import { API, formatCurrency, formatDateTime } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

interface PaymentsProps {
  showToast: (type: 'success' | 'error' | 'info', message: string) => void
}

export function Payments({ showToast }: PaymentsProps) {
  const [payments, setPayments] = useState<PaymentWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await API.getPayments()
      if (res.success) {
        setPayments(res.payments || [])
      } else {
        showToast('error', res.error || 'Failed to fetch payments')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error connecting to database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const q = searchTerm.toLowerCase().trim()
      const bizName = p.user?.businesses?.[0]?.name?.toLowerCase() || ''
      const userName = p.user?.name?.toLowerCase() || ''
      const utr = p.utrNumber?.toLowerCase() || ''
      const agent = p.agentCode?.toLowerCase() || ''

      const matchesSearch =
        !q || bizName.includes(q) || userName.includes(q) || utr.includes(q) || agent.includes(q)

      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [payments, searchTerm, statusFilter])

  const handleApprove = async (paymentId: string) => {
    setActionLoadingId(paymentId)
    try {
      const res = await API.approvePayment(paymentId)
      if (res.success) {
        showToast('success', res.message || 'Payment approved and business card is now LIVE!')
        fetchPayments()
      } else {
        showToast('error', res.error || 'Failed to approve payment')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Approve failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (paymentId: string) => {
    if (!confirm('Are you sure you want to mark this payment as REJECTED?')) return
    setActionLoadingId(paymentId)
    try {
      const res = await API.rejectPayment(paymentId)
      if (res.success) {
        showToast('info', 'Payment marked as rejected')
        fetchPayments()
      } else {
        showToast('error', res.error || 'Failed to reject payment')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Reject failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleMarkCommissionPaid = async (paymentId: string) => {
    setActionLoadingId(paymentId)
    try {
      const res = await API.markCommissionPaid(paymentId)
      if (res.success) {
        showToast('success', 'Agent commission marked as paid')
        fetchPayments()
      } else {
        showToast('error', res.error || 'Failed to update commission status')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Summary counts
  const totalApprovedRev = useMemo(
    () => payments.filter((p) => p.status === 'APPROVED').reduce((s, p) => s + p.amount, 0),
    [payments]
  )
  const pendingCount = useMemo(() => payments.filter((p) => p.status === 'PENDING').length, [payments])

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">UPI Payments & UTR Approvals</h1>
          <p className="text-sm text-slate-400">
            Verify transaction reference numbers, approve activations, and track agent commissions
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300">
            Total Approved: <span className="font-bold">{formatCurrency(totalApprovedRev)}</span>
          </div>
          {pendingCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/50 border border-amber-800 text-amber-300">
              Pending: <span className="font-bold">{pendingCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search by UTR number, business, agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((filter) => {
            const count =
              filter === 'ALL'
                ? payments.length
                : payments.filter((p) => p.status === filter).length

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

      {/* Payments Table */}
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
                  <th className="px-6 py-3.5">Business / Customer</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">UTR Reference</th>
                  <th className="px-6 py-3.5">Agent Attribution</th>
                  <th className="px-6 py-3.5">Commission</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Submission Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((p) => {
                  const biz = p.user?.businesses?.[0]
                  const bizName = biz?.name || p.user?.name || 'Local Business'
                  const isApproved = p.status === 'APPROVED'
                  const isPending = p.status === 'PENDING'
                  const isRejected = p.status === 'REJECTED'

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Business */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{bizName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {p.packageTier || 'EXECUTIVE_STANDEE'}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        {formatCurrency(p.amount)}
                      </td>

                      {/* UTR */}
                      <td className="px-6 py-4 font-mono text-xs text-slate-200">
                        {p.utrNumber || '—'}
                      </td>

                      {/* Agent */}
                      <td className="px-6 py-4">
                        {p.agentCode ? (
                          <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                            {p.agentCode}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Direct Online</span>
                        )}
                      </td>

                      {/* Commission */}
                      <td className="px-6 py-4">
                        {p.commission ? (
                          <div>
                            <div className="font-semibold text-amber-300 text-xs">
                              {formatCurrency(p.commission)}
                            </div>
                            <div className="text-[10px] mt-0.5">
                              {p.commissionPaid ? (
                                <span className="text-emerald-400 flex items-center gap-0.5">
                                  <Check size={10} /> Disbursed
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleMarkCommissionPaid(p.id)}
                                  disabled={actionLoadingId === p.id}
                                  className="text-slate-400 hover:text-amber-300 underline"
                                  title="Mark as paid to agent"
                                >
                                  Mark Disbursed
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge
                          color={isApproved ? 'green' : isPending ? 'yellow' : 'red'}
                          dot
                        >
                          {p.status}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {formatDateTime(p.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="success"
                              size="sm"
                              icon={<CheckCircle2 size={13} />}
                              loading={actionLoadingId === p.id}
                              onClick={() => handleApprove(p.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<XCircle size={13} />}
                              loading={actionLoadingId === p.id}
                              onClick={() => handleReject(p.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">Completed</span>
                        )}
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
          <p className="text-base font-medium text-slate-300">No payment records found</p>
          <p className="text-xs text-slate-500">Transactions submitted by merchants or agents will show up here</p>
        </div>
      )}
    </div>
  )
}
