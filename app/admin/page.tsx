'use client'

import { useState, useEffect, useCallback } from 'react'

interface Stats {
  fecha: string
  totalJugadas: number
  totalGanadores: number
  canjeados: number
}

interface Config {
  id: number
  activo: boolean
}

interface ConfigSorteo {
  probabilidad_base: number
  incremento_por_jugada: number
}

interface Franja {
  id: number
  hora_inicio: number
  hora_fin: number
  premios_cupo: number
  activa: boolean
  premiosEntregadosHoy: number
}

function formatHora(h: number): string {
  return `${String(h % 24).padStart(2, '0')}:00`
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [config, setConfig] = useState<Config | null>(null)
  const [configSorteo, setConfigSorteo] = useState<ConfigSorteo | null>(null)
  const [franjas, setFranjas] = useState<Franja[]>([])
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyResult, setVerifyResult] = useState<{ valido: boolean; mensaje: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingSorteo, setSavingSorteo] = useState(false)
  const [savingFranjaId, setSavingFranjaId] = useState<number | null>(null)

  const fetchData = useCallback(async (pwd: string) => {
    const headers = { 'x-admin-password': pwd }
    const [statsRes, configRes, sorteoRes, franjasRes] = await Promise.all([
      fetch('/api/admin/stats', { headers }),
      fetch('/api/admin/config', { headers }),
      fetch('/api/admin/config-sorteo', { headers }),
      fetch('/api/admin/franjas', { headers }),
    ])
    if (statsRes.status === 401) {
      setAuthError(true)
      return
    }
    setStats(await statsRes.json())
    setConfig(await configRes.json())
    setConfigSorteo(await sorteoRes.json())
    const franjasData = await franjasRes.json()
    setFranjas(franjasData.franjas ?? [])
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
      body: JSON.stringify({ activo: config.activo }),
    })
    await fetchData(password)
    setSaving(false)
  }

  async function handleSaveSorteo(e: React.FormEvent) {
    e.preventDefault()
    if (!configSorteo) return
    setSavingSorteo(true)
    await fetch('/api/admin/config-sorteo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(configSorteo),
    })
    await fetchData(password)
    setSavingSorteo(false)
  }

  async function handleSaveFranja(franja: Franja) {
    setSavingFranjaId(franja.id)
    await fetch('/api/admin/franjas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: franja.id, premios_cupo: franja.premios_cupo }),
    })
    await fetchData(password)
    setSavingFranjaId(null)
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
            className="border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            type="submit"
            className="bg-brand-primary text-white rounded-xl py-3 font-bold text-lg hover:opacity-90 transition"
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
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Total jugadas" value={stats.totalJugadas} />
              <Stat label="Ganadores" value={stats.totalGanadores} color="text-green-600" />
              <Stat label="Canjeados" value={stats.canjeados} color="text-brand-primary" />
            </div>
          </div>
        )}

        {/* Promoción activa */}
        {config && (
          <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-700">Estado general</h2>
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
              className="bg-brand-primary text-white rounded-xl py-3 font-bold hover:opacity-90 transition disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}

        {/* Franjas horarias */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-700">Franjas horarias y cupos</h2>
          <div className="flex flex-col gap-2">
            {franjas.map((f) => (
              <div key={f.id} className="flex items-center gap-3 border rounded-xl px-3 py-2">
                <span className="font-mono text-sm text-gray-700 w-24">
                  {formatHora(f.hora_inicio)}&ndash;{formatHora(f.hora_fin)}
                </span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={f.premios_cupo}
                  onChange={(e) =>
                    setFranjas((prev) =>
                      prev.map((p) => (p.id === f.id ? { ...p, premios_cupo: parseInt(e.target.value) || 0 } : p))
                    )
                  }
                  className="border rounded-lg px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <span className="text-xs text-gray-500 flex-1">
                  entregados hoy: <strong>{f.premiosEntregadosHoy}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveFranja(f)}
                  disabled={savingFranjaId === f.id}
                  className="bg-black text-white rounded-lg px-3 py-1 text-sm font-semibold hover:opacity-80 transition disabled:opacity-60"
                >
                  {savingFranjaId === f.id ? '...' : 'Guardar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Config sorteo */}
        {configSorteo && (
          <form onSubmit={handleSaveSorteo} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-700">Probabilidad progresiva</h2>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Probabilidad base (0 a 1)</span>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={configSorteo.probabilidad_base}
                onChange={(e) =>
                  setConfigSorteo({ ...configSorteo, probabilidad_base: parseFloat(e.target.value) || 0 })
                }
                className="border rounded-xl px-4 py-2 text-lg w-32 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Incremento por jugada (0 a 1)</span>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={configSorteo.incremento_por_jugada}
                onChange={(e) =>
                  setConfigSorteo({ ...configSorteo, incremento_por_jugada: parseFloat(e.target.value) || 0 })
                }
                className="border rounded-xl px-4 py-2 text-lg w-32 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </label>
            <button
              type="submit"
              disabled={savingSorteo}
              className="bg-brand-primary text-white rounded-xl py-3 font-bold hover:opacity-90 transition disabled:opacity-60"
            >
              {savingSorteo ? 'Guardando...' : 'Guardar cambios'}
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
              className="border rounded-xl px-4 py-3 text-xl font-mono flex-1 focus:outline-none focus:ring-2 focus:ring-brand-primary tracking-widest"
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
