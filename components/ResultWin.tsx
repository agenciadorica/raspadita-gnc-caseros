interface ResultWinProps {
  codigo: string
}

export default function ResultWin({ codigo }: ResultWinProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center animate-fade-in">
      <div className="text-7xl">🏆</div>
      <h2 className="text-3xl font-extrabold text-brand-primary">
        ¡Ganaste! La carga que acabás de hacer es gratis.
      </h2>
      <p className="text-gray-600 text-lg">Mostrá este código al playero:</p>
      <div className="bg-violet-50 border-4 border-brand-primary rounded-2xl px-8 py-6 shadow-lg">
        <span className="font-mono text-5xl font-black text-brand-primary tracking-widest">{codigo}</span>
      </div>
    </div>
  )
}
