'use client'

import { useState, useEffect, useCallback } from 'react'

interface Stats {
  fecha: string
  totalJugadas: number
  totalGanadores: number
  canjeados: number
  premiosPorDia: number
  premiosRestantes: number
}

interface Config {
  id: number
  premios_por_dia: number
  activo: boolean
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [config, setConfig] = useState<Config | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyResult, setVerifyResult] = useState<{ valido: boolean; mensaje: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async (pwd: string) => {
    const headers = { 'x-admin-password': pwd }
    const [statsRes, configRes] = await Promise.all([
      fetch('/api/admin/stats', { headers }),
      fetch('/api/admin/config', { headers }),
    ])
    if (statsRes.status === 401) {
      setAuthError(true)
      return
    }
    setStats(await statsRes.json())
    setConfig(await configRes.json())
    setAuthed(true)
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    fetchData(password)
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault()
    if (!config) return
    setSaving(true)
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ premios_por_dia: config.premios_por_dia, activo: config.activo }),
    })
    await fetchData(password)
    setSaving(false)
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: verifyCode }),
    })
    setVerifyResult(await res.json())
  }

  useEffect(() => {
    if (authed) {
      const interval = setInterval(() => fetchData(password), 30000)
      return () => clearInterval(interval)
    }
  }, [authed, fetchData, password])

  if (!authed) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Panel Admin</h1>
          <p className="text-gray-500 text-sm text-center">GNC Caseros</p>
          {authError && <p className="text-red-500 text-sm text-center">Contraseña incorrecta</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl py-3 font-bold text-lg hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel Admin &mdash; GNC Caseros</h1>

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Estadísticas de hoy ({stats.fecha})</h2>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Total jugadas" value={stats.totalJugadas} />
              <Stat label="Ganadores" value={stats.totalGanadores} color="text-green-600" />
              <Stat label="Canjeados" value={stats.canjeados} color="text-blue-600" />
              <Stat label="Premios restantes" value={stats.premiosRestantes} color="text-orange-500" />
            </div>
          </div>
        )}

        {/* Config */}
        {config && (
          <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-700">Configuración</h2>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Premios por día</span>
              <input
                type="number"
                min={0}
                max={100}
                value={config.premios_por_dia}
                onChange={(e) => setConfig({ ...config, premios_por_dia: parseInt(e.target.value) })}
                className="border rounded-xl px-4 py-2 text-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.activo}
                onChange={(e) => setConfig({ ...config, activo: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">Promoción activa</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white rounded-xl py-3 font-bold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}

        {/* Verify code */}
        <form onSubmit={handleVerify} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-700">Verificar código ganador</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              maxLength={6}
              className="border rounded-xl px-4 py-3 text-xl font-mono flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest"
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded-xl px-4 py-3 font-bold hover:bg-green-700 transition"
            >
              Verificar
            </button>
          </div>
          {verifyResult && (
            <div className={`rounded-xl px-4 py-3 font-semibold ${verifyResult.valido ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {verifyResult.mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

function Stat({ label, value, color = 'text-gray-800' }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
