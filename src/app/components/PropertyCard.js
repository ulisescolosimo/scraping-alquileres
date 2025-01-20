import { motion } from "framer-motion";
import { Bed, Bath, DollarSign, Home, Ruler } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertyCard({ property }) {
  // Función para obtener el símbolo de la moneda basado en price_currency
  const getCurrencySymbol = (currency) => {
    if (currency === "$") {
      return "$"; // Signo de peso argentino
    }
    return "USD"; // Dólar
  };

  // Función para obtener la imagen del badge según el sitio
  const getSiteBadgeImage = (site) => {
    if (site === "argenprop") {
      return "/images/argenprop.jpg"; // Imagen de Argenprop
    } else if (site === "zonaprop") {
      return "/images/zonaprop.jpg"; // Imagen de Zonaprop
    }
    return "/placeholder.svg"; // Imagen por defecto
  };

  // Convertir el precio a un número y formatearlo
  const formattedPrice = parseFloat(property.price_amount).toLocaleString('es-AR');

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          className="w-full h-64 object-cover"
          src={property.fotos[0] || "/placeholder.svg"}
          alt={property.title}
        />
        {/* Badge que muestra la imagen del sitio de origen */}
        <div className="absolute top-2 left-2 m-2 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          <img
            className="w-full h-full object-cover"
            src={getSiteBadgeImage(property.site)} // Usa la imagen en lugar de texto
            alt={property.site}
          />
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h2 className="font-bold text-xl mb-2 line-clamp-1">{property.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-2">{property.description || "Description not available"}</p>
        
        {/* Dirección */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Home className="text-gray-400" size={20} />
            <span className="text-gray-600 text-sm">{property.address}</span>
          </div>
        </div>

        {/* Precio */}
        <div className="text-center">
          <p className="text-3xl font-bold text-primary flex items-center justify-center">
            {getCurrencySymbol(property.price_currency)}{" "}
            {formattedPrice}
          </p>
          {property.expenses_amount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              + ${property.expenses_amount.toLocaleString()} expenses
            </p>
          )}
        </div>

        {/* Detalles adicionales */}
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Bed size={16} />
            <span>{property.dormitorios} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath size={16} />
            <span>{property.banos} Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Ruler size={16} />
            <span>{property.superficie_cubierta} m²</span>
          </div>
        </div>

        {/* Antigüedad */}
        <div className="text-sm text-gray-600">
          <span>Antiguedad: {property.antiguedad} years</span>
        </div>

        {/* Botón de ver detalles */}
        <Link href={`/properties/${property.id}`} passHref>
          <Button className="w-full mt-4 bg-cyan-800 text-white hover:text-black hover:border-solid-red" variant="default">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
