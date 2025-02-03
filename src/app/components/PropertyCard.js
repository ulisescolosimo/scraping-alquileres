"use client";

import { motion } from "framer-motion";
import { Bed, Bath, Ruler, MapPin, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertyCard({ property }) {
  // Función para extraer números enteros de un texto
  const extractInteger = (text) => {
    const match = text?.match(/\d+/); // Busca el primer número entero en el texto
    return match ? parseInt(match[0], 10) : 0; // Devuelve el número o 0 si no hay coincidencia
  };

  // Extraer valores numéricos de los campos
  const priceAmount = extractInteger(property.price_amount); // Precio
  const expensesAmount = extractInteger(property.expenses_amount); // Gastos
  const bedrooms = extractInteger(property.dormitorios); // Habitaciones
  const bathrooms = extractInteger(property.banos); // Baños
  const area = extractInteger(property.superficie_cubierta); // Superficie cubierta
  const age = extractInteger(property.antiguedad); // Antigüedad

  // Formatear el precio con el símbolo de la moneda
  const getCurrencySymbol = (currency) => (currency === "$" ? "$" : "USD");
  const formattedPrice = priceAmount.toLocaleString("es-AR");

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 flex flex-col"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen de la propiedad */}
      <div className="relative flex-shrink-0">
        <img
          className="w-full h-64 object-cover rounded-t-lg"
          src={property.fotos[0] || "/placeholder.svg"}
          alt={property.title}
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Título y descripción */}
        <h2 className="font-semibold text-xl text-gray-900 truncate">{property.title}</h2>
        <p className="text-gray-500 text-sm truncate">{property.description || "Descripción no disponible"}</p>

        {/* Dirección */}
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <MapPin size={18} className="text-gray-400" />
          <span>{property.address}</span>
        </div>

        {/* Precio */}
        <div className="text-center mt-2">
          <p className="text-3xl font-bold text-blue-700">
            {getCurrencySymbol(property.price_currency)} {formattedPrice}
          </p>
          {expensesAmount > 0 && (
            <p className="text-sm text-gray-500">+ ${expensesAmount.toLocaleString()} expensas</p>
          )}
        </div>

        {/* Detalles adicionales */}
        <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
          <div className="flex items-center space-x-1">
            <Bed size={18} />
            <span>{bedrooms} Habitaciones</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath size={18} />
            <span>{bathrooms} Baños</span>
          </div>
          <div className="flex items-center space-x-1">
            <Ruler size={18} />
            <span>{area} m²</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={18} />
            <span>Antigüedad: {age} años</span>
          </div>
        </div>
      </div>

      {/* Botón de ver detalles */}
      <div className="p-6 mt-auto">
        <Link href={`/properties/${property.id}`} passHref>
          <Button className="w-full rounded-xl bg-blue-700 text-white hover:bg-blue-900 transition">Ver Detalles</Button>
        </Link>
      </div>
    </motion.div>
  );
}