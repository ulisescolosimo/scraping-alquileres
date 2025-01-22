"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Usamos useRouter de next/navigation
import { supabase } from "../utils/supabaseClient";
import { motion } from "framer-motion"; // Librería de animación

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // Inicializamos el hook useRouter

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        // Si hay un error, mostramos el mensaje de "Credenciales incorrectas"
        setError("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
      } else {
        // Si el login es exitoso, redirigimos a la página de propiedades
        router.push("/properties");
      }
    } catch (err) {
      console.error("Error en la autenticación:", err);
      setError("Hubo un problema al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white font-semibold rounded-xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Login
          </button>
        </form>
      </div>
    </motion.div>
  );
}
