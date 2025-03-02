"use client";

import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, LogOut, HomeIcon, Search, Menu, X } from "lucide-react"; // Iconos de lucide-react
import { motion } from "framer-motion"; // Librería de animación

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú hamburguesa

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getSession(); // Usamos getSession() para obtener la sesión
      if (error) {
        console.error("Error obteniendo sesión:", error.message);
      }
      setUser(user || null); // Si el usuario está autenticado, lo almacenamos
    };

    checkUser();

    // Escuchar cambios de sesión en tiempo real
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null); // Actualiza el estado con el usuario si está autenticado
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/"); // Redirigir al home después de cerrar sesión
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error.message);
    }
  };


  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 left-0 w-full z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold text-yellow-400">Alquileres</h1>
      </div>

      {/* Menú hamburguesa para mobile */}
      <div className="lg:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Barra de navegación para dispositivos grandes */}
      <nav className="space-x-6 hidden lg:flex items-center">
        <Link href="/" passHref>
          <button className="btn btn-ghost text-white hover:bg-yellow-600 focus:outline-none flex items-center rounded-xl px-4 py-2">
            <HomeIcon className="mr-2" size={20} /> Home
          </button>
        </Link>
        <Link href="/properties" passHref>
          <button className="btn btn-ghost text-white hover:bg-yellow-600 focus:outline-none flex items-center rounded-xl px-4 py-2">
            <Search className="mr-2" size={20} /> Propiedades
          </button>
        </Link>

        {!user ? (
          <>
            <Link href="/register" passHref>
              <button className="btn btn-ghost text-white hover:bg-yellow-600 focus:outline-none flex items-center rounded-xl px-4 py-2">
                <User className="mr-2" size={20} /> Register
              </button>
            </Link>
            <Link href="/login" passHref>
              <button className="btn btn-ghost text-white hover:bg-yellow-600 focus:outline-none flex items-center rounded-xl px-4 py-2">
                <User className="mr-2" size={20} /> Login
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="btn btn-ghost text-white hover:bg-red-500 focus:outline-none flex items-center rounded-xl px-4 py-2"
          >
            <LogOut className="mr-2" size={20} /> Cerrar sesión
          </button>
        )}
      </nav>

      {/* Menú desplegable para mobile con animaciones */}
      {isMenuOpen && (
        <motion.div
          className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 text-white p-4 space-y-4 flex flex-col z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" passHref>
            <button className="w-full text-left text-white hover:bg-yellow-600 hover:rounded-xl p-2 focus:outline-none flex items-center">
              <HomeIcon className="mr-2" size={20} /> Home
            </button>
          </Link>

          <Link href="/properties" passHref>
            <button className="w-full text-left text-white hover:bg-yellow-600 hover:rounded-xl p-2 focus:outline-none flex items-center">
              <Search className="mr-2" size={20} /> Propiedades
            </button>
          </Link>

          {!user ? (
            <>
              <Link href="/register" passHref>
                <button className="w-full text-left text-white hover:bg-yellow-600 hover:rounded-xl p-2 focus:outline-none flex items-center">
                  <User className="mr-2" size={20} /> Register
                </button>
              </Link>
              <Link href="/login" passHref>
                <button className="w-full text-left text-white hover:bg-yellow-600 hover:rounded-xl p-2 focus:outline-none flex items-center">
                  <User className="mr-2" size={20} /> Login
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-left text-white hover:bg-red-500 focus:outline-none flex items-center"
            >
              <LogOut className="mr-2" size={20} /> Cerrar sesión
            </button>
          )}
        </motion.div>
      )}
    </header>
  );
}
