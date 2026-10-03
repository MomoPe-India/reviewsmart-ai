import React, { useEffect, useState } from 'react'
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle,
  Database,
  Mail,
  Phone,
  CreditCard,
  Percent,
  ShieldCheck,
} from 'lucide-react'
import { PlatformSettings } from '@/lib/types'
import { API } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'

interface SettingsProps {
  showToast: (type: 'success' | 'error' | 'info', message: string) => void
}

export function Settings({ showToast }: SettingsProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form State
  const [platformName, setPlatformName] = useState('ReviewSmart AI')
  const [supportEmail, setSupportEmail] = useState('momopedeals@gmail.com')
  const [supportWhatsapp, setSupportWhatsapp] = useState('+918639831132')
  const [currencySymbol, setCurrencySymbol] = useState('₹')
  const [upiId, setUpiId] = useState('momopedeals@oksbi')
  const [upiPayeeName, setUpiPayeeName] = useState('Damerla Mohan')
  const [minNegotiatedPrice, setMinNegotiatedPrice] = useState('1999')
  const [commissionRate, setCommissionRate] = useState('30')

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await API.getSettings()
      if (res.success && res.settings) {
        const s: PlatformSettings = res.settings
        setPlatformName(s.platformName || 'ReviewSmart AI')
        setSupportEmail(s.supportEmail || 'momopedeals@gmail.com')
        setSupportWhatsapp(s.supportWhatsapp || '+918639831132')
        setCurrencySymbol(s.currencySymbol || '₹')
        setUpiId(s.upiId || 'momopedeals@oksbi')
        setUpiPayeeName(s.upiPayeeName || 'Damerla Mohan')
        setMinNegotiatedPrice(String(s.minNegotiatedPrice || 1999))
        setCommissionRate(String(Math.round((s.commissionRate || 0.30) * 100)))
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        platformName,
        supportEmail,
        supportWhatsapp,
        currencySymbol,
        upiId,
        upiPayeeName,
        minNegotiatedPrice: Number(minNegotiatedPrice),
        commissionRate: Number(commissionRate) / 100,
      }

      const res = await API.updateSettings(payload)
      if (res.success) {
        showToast('success', 'Platform settings updated and synchronized with live site!')
      } else {
        showToast('error', res.error || 'Failed to update settings')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Configuration</h1>
          <p className="text-sm text-slate-400">
            Global payment details, pricing floors, and customer support channels
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Save size={16} />}
          loading={saving}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Supabase Connection Health Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Database size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                Supabase PostgreSQL Cloud Cluster
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                aws-0-ap-south-1.pooler.supabase.com:6543
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            Connected & Synced
          </span>
        </div>

        {/* Section: Platform Identity & Support */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-semibold text-sm">
            <ShieldCheck size={18} className="text-indigo-400" />
            <span>Platform Identity & Support</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Platform Display Name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              required
            />

            <Input
              label="Support WhatsApp (with country code)"
              placeholder="+918639831132"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Support Email Address"
                type="email"
                placeholder="momopedeals@gmail.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Section: UPI Payment & Collection Account */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-semibold text-sm">
            <CreditCard size={18} className="text-indigo-400" />
            <span>Default UPI Payment Collection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Admin UPI VPA / ID"
              placeholder="momopedeals@oksbi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
              hint="Shown on merchant QR checkout and agent payment links"
            />

            <Input
              label="Payee Legal Account Name"
              placeholder="Damerla Mohan"
              value={upiPayeeName}
              onChange={(e) => setUpiPayeeName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Section: Pricing Floor & Default Commission */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-semibold text-sm">
            <Percent size={18} className="text-indigo-400" />
            <span>Pricing Floor & Commission Rules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Negotiated Price (₹)"
              type="number"
              placeholder="1999"
              value={minNegotiatedPrice}
              onChange={(e) => setMinNegotiatedPrice(e.target.value)}
              required
              hint="Hard price floor for in-field agent deals"
            />

            <Input
              label="Default Agent Commission (%)"
              type="number"
              placeholder="30"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              min={1}
              max={100}
              required
              hint="Applied if individual agent has no specific rate override"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Save size={18} />}
            loading={saving}
          >
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
