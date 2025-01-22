// src/app/layout.js
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css"; // Asegúrate de que el archivo CSS se importe aquí

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Alquileres</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header />

          {/* Contenido principal */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
