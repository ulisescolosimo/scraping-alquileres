// src/app/components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Alquileres</h1>
      <nav className="space-x-6">
        <Link href="/" passHref>
          <button className="text-white hover:text-gray-400 focus:outline-none">
            Home
          </button>
        </Link>
        <Link href="/properties" passHref>
          <button className="text-white hover:text-gray-400 focus:outline-none">
            Propiedades
          </button>
        </Link>
      </nav>
    </header>
  );
}
