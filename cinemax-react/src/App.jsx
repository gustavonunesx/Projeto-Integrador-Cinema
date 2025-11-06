function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-red-500 text-center mb-8">
        🎬 CineMax - Teste
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-500 p-6 rounded-lg text-white text-center">
            Card 1
          </div>
          <div className="bg-blue-500 p-6 rounded-lg text-white text-center">
            Card 2
          </div>
          <div className="bg-green-500 p-6 rounded-lg text-white text-center">
            Card 3
          </div>
        </div>
        
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg mx-auto block transition-colors">
          Botão Teste
        </button>
        
        <p className="text-center mt-8 text-green-400">
          Se você vê cores e layout, está funcionando!
        </p>
      </div>
    </div>
  )
}

export default App