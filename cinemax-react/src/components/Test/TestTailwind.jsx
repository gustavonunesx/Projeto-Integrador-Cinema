const TestTailwind = () => {
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Teste Tailwind CSS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 p-4 rounded-lg text-white">
          Card Azul
        </div>
        <div className="bg-green-500 p-4 rounded-lg text-white">
          Card Verde
        </div>
        <div className="bg-red-500 p-4 rounded-lg text-white">
          Card Vermelho
        </div>
      </div>

      <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors">
        Botão Teste
      </button>

      <p className="text-gray-300 mt-4">
        Se você ver cores e layout, o Tailwind está funcionando!
      </p>
    </div>
  )
}

export default TestTailwind