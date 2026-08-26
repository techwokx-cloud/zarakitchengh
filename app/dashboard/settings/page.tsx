// app/dashboard/settings/page.tsx
'use client'

import { useState } from 'react'
import { Eye, EyeOff, Save, AlertCircle } from 'lucide-react'

export default function DashboardSettings() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [settings, setSettings] = useState({
    // Business Info
    businessName: 'Zara Kitchen',
    businessPhone: '+233243637122',
    businessEmail: 'info@zarakitchengh.com',
    businessAddress: '64 Patrice Lumumba St, Accra, Ghana',

    // API Keys
    openaiKey: '',
    falAiKey: '',
    groqKey: '',
    googleAiKey: '',
    gensparkKey: '',

    // Social Media
    facebookAccessToken: '',
    instagramAccessToken: '',
    tiktokAccessToken: '',
    twitterBearerToken: '',
    whatsappBusinessToken: '',

    // Settings
    autoPostApproval: false,
    defaultImageModel: 'stable-diffusion',
    postsPerDay: 3,
  })

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': token || '',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Settings saved successfully!',
        })
      } else {
        setStatus({
          type: 'error',
          message: 'Failed to save settings',
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const maskKey = (key: string) => {
    if (!key) return ''
    const visible = key.slice(-4)
    return `${'•'.repeat(key.length - 4)}${visible}`
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your business information and API integrations
        </p>
      </div>

      {status.type && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            status.type === 'success'
              ? 'bg-green-500 bg-opacity-10 border-green-500 text-green-400'
              : 'bg-red-500 bg-opacity-10 border-red-500 text-red-400'
          }`}
        >
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <span className="text-sm">{status.message}</span>
        </div>
      )}

      {/* Business Information */}
      <SettingsSection title="Business Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Business Name"
            name="businessName"
            value={settings.businessName}
            onChange={handleSettingsChange}
          />
          <InputField
            label="Phone Number"
            name="businessPhone"
            value={settings.businessPhone}
            onChange={handleSettingsChange}
          />
          <InputField
            label="Email Address"
            name="businessEmail"
            value={settings.businessEmail}
            onChange={handleSettingsChange}
          />
          <InputField
            label="Address"
            name="businessAddress"
            value={settings.businessAddress}
            onChange={handleSettingsChange}
          />
        </div>
      </SettingsSection>

      {/* AI Services API Keys */}
      <SettingsSection title="AI Services API Keys">
        <div className="space-y-4">
          <SecureInputField
            label="OpenAI API Key (DALL-E 3)"
            name="openaiKey"
            value={settings.openaiKey}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('openaiKey')}
            isVisible={showKeys.openaiKey}
          />
          <SecureInputField
            label="FAL AI Key (Stable Diffusion)"
            name="falAiKey"
            value={settings.falAiKey}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('falAiKey')}
            isVisible={showKeys.falAiKey}
          />
          <SecureInputField
            label="Groq API Key"
            name="groqKey"
            value={settings.groqKey}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('groqKey')}
            isVisible={showKeys.groqKey}
          />
          <SecureInputField
            label="Google AI Key (Gemini)"
            name="googleAiKey"
            value={settings.googleAiKey}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('googleAiKey')}
            isVisible={showKeys.googleAiKey}
          />
          <SecureInputField
            label="Genspark API Key"
            name="gensparkKey"
            value={settings.gensparkKey}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('gensparkKey')}
            isVisible={showKeys.gensparkKey}
          />
        </div>
      </SettingsSection>

      {/* Social Media Integration */}
      <SettingsSection title="Social Media Integration">
        <div className="space-y-4">
          <SecureInputField
            label="Facebook Page Access Token"
            name="facebookAccessToken"
            value={settings.facebookAccessToken}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('facebookAccessToken')}
            isVisible={showKeys.facebookAccessToken}
          />
          <SecureInputField
            label="Instagram Access Token"
            name="instagramAccessToken"
            value={settings.instagramAccessToken}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('instagramAccessToken')}
            isVisible={showKeys.instagramAccessToken}
          />
          <SecureInputField
            label="TikTok Access Token"
            name="tiktokAccessToken"
            value={settings.tiktokAccessToken}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('tiktokAccessToken')}
            isVisible={showKeys.tiktokAccessToken}
          />
          <SecureInputField
            label="Twitter Bearer Token"
            name="twitterBearerToken"
            value={settings.twitterBearerToken}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('twitterBearerToken')}
            isVisible={showKeys.twitterBearerToken}
          />
          <SecureInputField
            label="WhatsApp Business Token"
            name="whatsappBusinessToken"
            value={settings.whatsappBusinessToken}
            onChange={handleSettingsChange}
            onToggleVisibility={() => toggleKeyVisibility('whatsappBusinessToken')}
            isVisible={showKeys.whatsappBusinessToken}
          />
        </div>
      </SettingsSection>

      {/* Content Settings */}
      <SettingsSection title="Content Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Default Image Generation Model
            </label>
            <select
              name="defaultImageModel"
              value={settings.defaultImageModel}
              onChange={handleSettingsChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold"
            >
              <option value="stable-diffusion">Stable Diffusion (Free/Fast)</option>
              <option value="dalle3">DALL-E 3 (Premium Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Default Posts Per Day
            </label>
            <input
              type="number"
              name="postsPerDay"
              value={settings.postsPerDay}
              onChange={handleSettingsChange}
              min="1"
              max="10"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              name="autoPostApproval"
              checked={settings.autoPostApproval}
              onChange={handleSettingsChange}
              className="w-4 h-4 rounded bg-gray-700 border border-gray-600"
            />
            <span className="text-gray-300">Auto-approve posts before posting</span>
          </label>
        </div>
      </SettingsSection>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSaveSettings}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4 text-blue-400">
        <h3 className="font-semibold mb-2">💡 Getting API Keys</h3>
        <ul className="text-sm space-y-1 ml-4 list-disc">
          <li>
            <strong>OpenAI:</strong> Get at{' '}
            <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">
              platform.openai.com
            </a>
          </li>
          <li>
            <strong>FAL AI:</strong> Sign up at{' '}
            <a href="https://fal.ai" target="_blank" rel="noopener noreferrer" className="underline">
              fal.ai
            </a>
          </li>
          <li>
            <strong>Social Media:</strong> Get from respective platform's developer console
          </li>
        </ul>
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}

function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
      />
    </div>
  )
}

function SecureInputField({
  label,
  name,
  value,
  onChange,
  onToggleVisibility,
  isVisible,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onToggleVisibility: () => void
  isVisible: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter your API key"
          className="w-full bg-gray-700 text-white px-4 py-2 pr-10 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
