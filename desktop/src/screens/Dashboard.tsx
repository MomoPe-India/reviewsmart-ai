import React, { useEffect, useState } from 'react'
import {
  DollarSign,
  Store,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { DashboardStats, Screen } from '@/lib/types'
import { API, formatCurrency, formatDate } from '@/lib/api'
import { StatCard, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

interface DashboardProps {
  onNavigate: (screen: Screen, context?: any) => void
  showToast: (type: 'success' | 'error' | 'info', message: string) => void
}

export function Dashboard({ onNavigate, showToast }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await API.getDashboardStats()
      if (res.success) {
        setStats(res.stats)
      } else {
        showToast('error', res.error || 'Failed to fetch dashboard stats')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error connecting to database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleApprovePayment = async (paymentId: string) => {
    setActionLoadingId(paymentId)
    try {
      const res = await API.approvePayment(paymentId)
      if (res.success) {
        showToast('success', res.message || 'Payment approved!')
        fetchStats()
      } else {
        showToast('error', res.error || 'Failed to approve payment')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleRejectPayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to reject this payment?')) return
    setActionLoadingId(paymentId)
    try {
      const res = await API.rejectPayment(paymentId)
      if (res.success) {
        showToast('info', 'Payment rejected')
        fetchStats()
      } else {
        showToast('error', res.error || 'Failed to reject payment')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading && !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles size={14} className="text-indigo-400" />
            Standalone Production Console
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ReviewSmart Platform Manager</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Directly connected to cloud PostgreSQL. All updates here are immediately live on{' '}
            <span className="text-indigo-300 font-mono">reviewsmart.online</span> without any manual deployments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={<Store size={16} />}
            onClick={() => onNavigate('merchant-editor')}
          >
            Add Merchant
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<Users size={16} />}
            onClick={() => onNavigate('agents')}
          >
            Manage Agents
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          subtitle="From all approved UPI transactions"
          icon={<DollarSign size={20} />}
          color="green"
        />
        <StatCard
          title="Active Paid Merchants"
          value={stats?.activeMerchants || 0}
          subtitle={`${stats?.merchantCount || 0} total registered`}
          icon={<Store size={20} />}
          color="indigo"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingPaymentCount || 0}
          subtitle="Require UTR verification"
          icon={<Clock size={20} />}
          color={stats?.pendingPaymentCount && stats.pendingPaymentCount > 0 ? 'yellow' : 'gray'}
        />
        <StatCard
          title="Marketing Agents"
          value={stats?.agentCount || 0}
          subtitle={`₹${(stats?.totalCommission || 0).toLocaleString('en-IN')} earned commission`}
          icon={<TrendingUp size={20} />}
          color="blue"
        />
      </div>

      {/* Pending Action Banner if any */}
      {(stats?.pendingPaymentCount ?? 0) > 0 && (
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-200">
                {stats?.pendingPaymentCount} Pending Payment Approval{stats?.pendingPaymentCount === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-amber-400/80">
                Merchants or agents have submitted UTR reference numbers waiting for your verification.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('payments')}
            icon={<ArrowRight size={14} />}
          >
            Review Payments
          </Button>
        </div>
      )}

      {/* Recent Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Transactions & UTR Submissions</h3>
            <p className="text-xs text-slate-400">Latest merchant onboardings and agent deals</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('payments')}
            icon={<ArrowRight size={14} />}
          >
            View All
          </Button>
        </div>

        {stats?.recentPayments && stats.recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Business / Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">UTR Reference</th>
                  <th className="px-6 py-3">Agent</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {stats.recentPayments.map((p) => {
                  const bizName = p.user?.businesses?.[0]?.name || p.user?.name || 'Local Business'
                  const isApproved = p.status === 'APPROVED'
                  const isPending = p.status === 'PENDING'
                  const isRejected = p.status === 'REJECTED'

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div>{bizName}</div>
                        <div className="text-xs text-slate-500 font-normal">{p.packageTier || 'EXECUTIVE_STANDEE'}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">
                        {p.utrNumber || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {p.agentCode ? (
                          <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {p.agentCode}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Direct Online</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          color={isApproved ? 'green' : isPending ? 'yellow' : 'red'}
                          dot
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={actionLoadingId === p.id}
                              onClick={() => handleApprovePayment(p.id)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors text-xs flex items-center gap-1 px-2.5 py-1"
                              title="Approve & Activate"
                            >
                              <CheckCircle2 size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              disabled={actionLoadingId === p.id}
                              onClick={() => handleRejectPayment(p.id)}
                              className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 transition-colors text-xs flex items-center gap-1 px-2 py-1"
                              title="Reject"
                            >
                              <XCircle size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">Completed</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            No transactions found yet. Onboard a merchant or register an agent deal to begin!
          </div>
        )}
      </div>
    </div>
  )
}
