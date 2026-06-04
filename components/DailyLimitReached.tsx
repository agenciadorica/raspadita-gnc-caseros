export default function DailyLimitReached() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center">
      <div className="text-7xl">🎁</div>
      <h2 className="text-3xl font-extrabold text-gray-700">Los premios de hoy ya se agotaron.</h2>
      <p className="text-gray-500 text-xl">¡Volvé mañana!</p>
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-4 mt-2">
        <p className="text-purple-600 text-base">Todos los días hay nuevas cargas de GNC gratis para ganar. ¡No te lo pierdas!</p>
      </div>
    </div>
  )
}
