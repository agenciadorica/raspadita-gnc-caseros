'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [url, setUrl] = useState('')
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    setUrl(window.location.origin)
  }, [])

  async function generate() {
    if (!canvasRef.current || !url) return
    await QRCode.toCanvas(canvasRef.current, url, {
      width: 400,
      margin: 2,
      color: { dark: '#1e3a5f', light: '#ffffff' },
    })
    setGenerated(true)
  }

  function download() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qr-gnc-caseros.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-50 px-4 py-8 gap-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Generador de QR</h1>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Generá el código QR para imprimir y pegar en la estación.
      </p>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4 w-full max-w-sm">
        <label className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-600 font-medium">URL de la raspadita</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <button
          onClick={generate}
          className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold hover:bg-blue-700 transition"
        >
          Generar QR
        </button>

        <canvas
          ref={canvasRef}
          className={`rounded-xl ${generated ? 'block' : 'hidden'}`}
          style={{ maxWidth: '100%' }}
        />

        {generated && (
          <button
            onClick={download}
            className="w-full bg-green-600 text-white rounded-xl py-3 font-bold hover:bg-green-700 transition"
          >
            Descargar PNG
          </button>
        )}
      </div>
    </div>
  )
}
