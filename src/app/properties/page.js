"use client";

import { useEffect, useState, useRef } from "react";
import { useProperties } from "@/app/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bath, Bed, DollarSign, Home, Ruler, Search } from "lucide-react";

export default function PropertyList() {
  const { properties, loading, error, fetchMoreProperties } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observer = useRef(null);

  const lastPropertyElementRef = (node) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreProperties();
      }
    });

    if (node) observer.current.observe(node);
  };

  const loadMoreProperties = () => {
    setIsLoadingMore(true);
    fetchMoreProperties().finally(() => {
      setIsLoadingMore(false);
    });
  };

  // Función para procesar las imágenes
  const processImages = (imageString) => {
    return imageString
      ? imageString.split("|").filter((url) => url.startsWith("http"))
      : [];
  };

  // Función para convertir a número, retornando 0 en caso de "nan"
  const parseNumber = (value) => {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  // Filtra las propiedades según el término de búsqueda y tipo
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" || property.tipo_propiedad_nombre === filterType)
  );

  // Procesa las imágenes y valores numéricos de cada propiedad
  const processedProperties = filteredProperties.map((property) => ({
    ...property,
    images: processImages(property.images), // Aplica la función processImages a las imágenes
    // Convierte los valores numéricos antes de mostrarlos
    dormitorios: parseNumber(property.dormitorios),
    banos: parseNumber(property.banos),
    superficie_total: parseNumber(property.superficie_total),
    superficie_cubierta: parseNumber(property.superficie_cubierta),
    price_amount: parseNumber(property.price_amount),
    expenses_amount: parseNumber(property.expenses_amount),
    antiguedad: parseNumber(property.antiguedad), // Convierte antiguedad a número
  }));

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore Properties</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select
            value={filterType}
            onValueChange={setFilterType}
            className="w-full sm:w-48 rounded-lg"
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {loading && !properties.length ? (
        <PropertyListSkeleton />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {processedProperties.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No properties found.
            </p>
          ) : (
            processedProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                ref={lastPropertyElementRef}
              />
            ))
          )}
        </motion.div>
      )}

      {isLoadingMore && <div className="text-center text-gray-500">Loading more...</div>}
    </div>
  );
}

function PropertyCard({ property }, ref) {
  // Función para obtener el símbolo de la moneda basado en price_currency
  const getCurrencySymbol = (currency) => {
    if (currency === "$") {
      return "$"; // Signo de peso argentino
    }
    return "USD"; // Dólar
  };

  // Función para obtener la imagen de la badge según el sitio
  const getSiteBadgeImage = (site) => {
    if (site === "argenprop") {
      return "/images/argenprop.jpg"; // Imagen de Argenprop
    } else if (site === "zonaprop") {
      return "/images/zonaprop.jpg"; // Imagen de Zonaprop
    }
    return "/placeholder.svg"; // Imagen por defecto
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={ref} // Use the ref passed from the parent to observe
    >
      <div className="relative">
        <img
          className="w-full h-64 object-cover"
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
        />
        {/* Badge que muestra la imagen del sitio de origen */}
        <div className="absolute top-0 left-0 m-2 w-10 h-10 rounded-full overflow-hidden">
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
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Home className="text-gray-400" size={20} />
            <span className="text-gray-600 text-sm">{property.address}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary flex items-center justify-center">
            {getCurrencySymbol(property.price_currency)}{" "}
            {property.price_amount.toLocaleString()}
          </p>
          {property.expenses_amount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              + ${property.expenses_amount.toLocaleString()} expenses
            </p>
          )}
        </div>
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
        <div className="text-sm text-gray-600">
          <span>Antiguedad: {property.antiguedad} years</span>
        </div>
        <Link href={`/properties/${property.id}`} passHref>
          <Button className="w-full mt-4 bg-cyan-800 text-white hover:text-black hover:border-solid-red" variant="default">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse"
        >
          {/* Imagen de la propiedad */}
          <div className="w-full h-64 bg-gray-300"></div>

          <div className="p-6 space-y-4">
            {/* Titulo */}
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            
            {/* Descripción */}
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>

            {/* Dirección */}
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>

            {/* Detalles de la propiedad */}
            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>

            {/* Botón de ver detalles */}
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

