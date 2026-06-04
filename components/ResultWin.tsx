interface ResultWinProps {
  codigo: string
}

export default function ResultWin({ codigo }: ResultWinProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center animate-fade-in">
      <div className="text-7xl">🏆</div>
      <h2 className="text-3xl font-extrabold text-yellow-600">¡Ganaste una carga de GNC gratis!</h2>
      <p className="text-gray-600 text-lg">Mostrá este código al playero:</p>
      <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl px-8 py-6 shadow-lg">
        <span className="font-mono text-5xl font-black text-yellow-700 tracking-widest">{codigo}</span>
      </div>
      <p className="text-sm text-gray-400 max-w-xs">
        Este código es válido por hoy. Presentalo en la estación para recibir tu carga.
      </p>
    </div>
  )
}
