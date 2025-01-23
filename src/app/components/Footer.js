// src/app/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-6 mt-8 shadow-lg">
      <div className="space-y-4">
        <p className="text-lg">
          &copy; 2024 <span className="font-semibold text-yellow-400">Alquileres</span>. Todos los derechos reservados.
        </p>
        <div className="space-x-4">
          <a href="/" className="text-white hover:text-yellow-600 transition duration-300">Home</a>
          <a href="/properties" className="text-white hover:text-yellow-600 transition duration-300">Propiedades</a>
        </div>
      </div>
    </footer>
  );
}
