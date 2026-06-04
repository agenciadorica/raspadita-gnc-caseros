export default function AlreadyPlayed() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center">
      <div className="text-7xl">⏰</div>
      <h2 className="text-3xl font-extrabold text-gray-700">Ya participaste hoy.</h2>
      <p className="text-gray-500 text-xl">¡Volvé mañana!</p>
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-4 mt-2">
        <p className="text-orange-600 text-base">Podés jugar una vez por día. Volvé mañana para una nueva oportunidad.</p>
      </div>
    </div>
  )
}
