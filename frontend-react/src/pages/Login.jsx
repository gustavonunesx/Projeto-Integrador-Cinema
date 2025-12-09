import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Senha</label>
            <input
              type="password"
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            className="w-full bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Ainda não tem conta? <a href="#" className="text-cinema-neon hover:underline">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
