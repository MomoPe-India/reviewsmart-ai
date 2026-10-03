import React, { useEffect, useState } from 'react'
import {
  Users,
  Plus,
  Edit2,
  Lock,
  Trash2,
  KeyRound,
  TrendingUp,
  Percent,
  Phone,
  DollarSign,
  CheckCircle,
} from 'lucide-react'
import { Agent } from '@/lib/types'
import { API, formatCurrency, formatDate } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'

interface AgentsProps {
  showToast: (type: 'success' | 'error' | 'info', message: string) => void
}

export function Agents({ showToast }: AgentsProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agentCode, setAgentCode] = useState('')
  const [pin, setPin] = useState('')
  const [commissionRate, setCommissionRate] = useState('30')

  // Reset PIN modal
  const [resetPinTarget, setResetPinTarget] = useState<Agent | null>(null)
  const [newPinResult, setNewPinResult] = useState<{ agentName: string; pin: string } | null>(null)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await API.getAgents()
      if (res.success) {
        setAgents(res.agents || [])
      } else {
        showToast('error', res.error || 'Failed to fetch marketing agents')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error connecting to database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const openCreateModal = () => {
    setEditingAgent(null)
    setName('')
    setPhone('')
    setAgentCode('')
    setPin('')
    setCommissionRate('30')
    setIsModalOpen(true)
  }

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent)
    setName(agent.name || '')
    setPhone(agent.phone || '')
    setAgentCode(agent.agentCode || '')
    setPin('')
    setCommissionRate(agent.commissionRate ? String(Math.round(agent.commissionRate * 100)) : '30')
    setIsModalOpen(true)
  }

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !agentCode.trim()) {
      showToast('error', 'Agent Name and Code are required')
      return
    }

    if (!editingAgent && (!pin || pin.length !== 4)) {
      showToast('error', 'A 4-digit PIN is required for new agents')
      return
    }

    setModalLoading(true)
    try {
      if (editingAgent) {
        const payload: any = {
          agentId: editingAgent.id,
          name,
          phone,
          agentCode,
          commissionRate: Number(commissionRate) / 100,
        }
        if (pin && pin.length === 4) payload.pin = pin

        const res = await API.updateAgent(payload)
        if (res.success) {
          showToast('success', `Agent ${agentCode} updated successfully`)
          setIsModalOpen(false)
          fetchAgents()
        } else {
          showToast('error', res.error || 'Failed to update agent')
        }
      } else {
        const payload = {
          name,
          phone,
          agentCode,
          pin,
          commissionRate: Number(commissionRate) / 100,
        }

        const res = await API.createAgent(payload)
        if (res.success) {
          showToast('success', `Agent ${agentCode} created with PIN: ${pin}`)
          setIsModalOpen(false)
          fetchAgents()
        } else {
          showToast('error', res.error || 'Failed to create agent')
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Operation failed')
    } finally {
      setModalLoading(false)
    }
  }

  const handleToggleActive = async (agent: Agent) => {
    try {
      const res = await API.toggleAgentActive(agent.id)
      if (res.success) {
        showToast('info', res.message || 'Status updated')
        fetchAgents()
      } else {
        showToast('error', res.error || 'Failed to toggle status')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    }
  }

  const handleResetPin = async (agent: Agent) => {
    try {
      const res = await API.resetAgentPin(agent.id)
      if (res.success) {
        setNewPinResult({ agentName: agent.name, pin: res.pin })
      } else {
        showToast('error', res.error || 'Failed to reset PIN')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Action failed')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await API.deleteAgent(deleteTarget.id)
      if (res.success) {
        showToast('success', `Agent ${deleteTarget.agentCode} deleted. Historical financial records preserved.`)
        setDeleteTarget(null)
        fetchAgents()
      } else {
        showToast('error', res.error || 'Failed to delete agent')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Marketing Field Agents</h1>
          <p className="text-sm text-slate-400">
            Manage agent codes, commission splits, PINs, and deal attributions
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={openCreateModal}>
          Add New Agent
        </Button>
      </div>

      {/* Agents Table */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : agents.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Agent & Code</th>
                  <th className="px-6 py-3.5">Phone & Login Tag</th>
                  <th className="px-6 py-3.5">Commission Rate</th>
                  <th className="px-6 py-3.5">Deals Closed</th>
                  <th className="px-6 py-3.5">Total Revenue</th>
                  <th className="px-6 py-3.5">Earned Commission</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {agents.map((agt) => {
                  const commPct = Math.round((agt.commissionRate || 0.30) * 100)

                  return (
                    <tr key={agt.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Code */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-300 font-bold font-mono text-xs">
                            {agt.agentCode || 'AGT'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{agt.name}</div>
                            <div className="text-xs font-mono text-indigo-400">{agt.agentCode}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-white">{agt.phone || 'No Phone'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Tag: {agt.userIdTag || agt.agentCode}</div>
                      </td>

                      {/* Commission % */}
                      <td className="px-6 py-4 font-semibold text-indigo-300">
                        {commPct}%
                      </td>

                      {/* Deals Closed */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-white">{agt.dealsClosed}</span>
                        {agt.pendingDeals > 0 && (
                          <span className="ml-2 text-xs text-amber-400 font-medium">
                            ({agt.pendingDeals} pending)
                          </span>
                        )}
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        {formatCurrency(agt.totalRevenue || 0)}
                      </td>

                      {/* Commission */}
                      <td className="px-6 py-4 font-semibold text-amber-300">
                        {formatCurrency(agt.totalCommission || 0)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge color={agt.isActive ? 'green' : 'red'} dot>
                          {agt.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(agt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Agent Details"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => handleResetPin(agt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                            title="Reset Agent 4-digit PIN"
                          >
                            <KeyRound size={15} />
                          </button>

                          <button
                            onClick={() => handleToggleActive(agt)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              agt.isActive
                                ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                : 'text-emerald-400 hover:bg-emerald-950/40'
                            }`}
                            title={agt.isActive ? 'Suspend Agent' : 'Reactivate Agent'}
                          >
                            <Lock size={15} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(agt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete Agent"
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
          <p className="text-base font-medium text-slate-300">No marketing agents registered</p>
          <p className="text-xs text-slate-500">Create an agent to enable offline field sales</p>
        </div>
      )}

      {/* Create / Edit Agent Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAgent ? `Edit Agent: ${editingAgent.agentCode}` : 'Add Marketing Agent'}
      >
        <form onSubmit={handleSaveAgent} className="space-y-4">
          <Input
            label="Agent Full Name"
            placeholder="e.g. Suresh Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Agent Code (Unique)"
              placeholder="e.g. MKT-01"
              value={agentCode}
              onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
              required
            />

            <Input
              label="Phone Number"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={editingAgent ? 'New PIN (Leave blank to keep current)' : '4-Digit Login PIN'}
              placeholder="e.g. 1234"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              maxLength={4}
              required={!editingAgent}
            />

            <Input
              label="Commission Rate (%)"
              placeholder="e.g. 30 for 30%"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              min={1}
              max={100}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={modalLoading}>
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Agent"
        message={`Are you sure you want to delete agent "${deleteTarget?.name}" (${deleteTarget?.agentCode})? All historical deal revenue and payment records will be preserved but unlinked from this agent.`}
        confirmLabel="Delete Agent"
        loading={deleteLoading}
      />

      {/* New PIN Result Modal */}
      {newPinResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setNewPinResult(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <KeyRound size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Agent PIN Reset</h3>
              <p className="text-xs text-slate-400 mt-1">
                New login credentials for <span className="text-indigo-300 font-semibold">{newPinResult.agentName}</span>:
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">4-Digit Agent PIN</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 mt-1 tracking-widest">
                {newPinResult.pin}
              </p>
            </div>
            <Button variant="primary" size="md" className="w-full" onClick={() => setNewPinResult(null)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
