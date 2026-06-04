export default function ResultLose() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center animate-fade-in">
      <div className="text-7xl">😔</div>
      <h2 className="text-3xl font-extrabold text-gray-700">¡Suerte la próxima!</h2>
      <p className="text-gray-500 text-xl">Volvé mañana para intentarlo de nuevo.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 mt-2">
        <p className="text-blue-600 text-base">Todos los días tenés una nueva chance de ganar una carga de GNC gratis.</p>
      </div>
    </div>
  )
}
