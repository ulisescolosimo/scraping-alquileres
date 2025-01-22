"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useProperties } from "@/app/hooks/useProperties"; // Usando tu hook para obtener las propiedades
import { motion } from "framer-motion";
import {
  Bath,
  Bed,
  Home,
  Phone,
  Ruler,
  Mail,
  DollarSign,
  Info,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PropertyDetail() {
  const [propertyId, setPropertyId] = useState(null); // Mantener el id de la propiedad
  const [property, setProperty] = useState(null); // Mantener los detalles de la propiedad
  const { loading, error, fetchPropertyById } = useProperties(); // Usar el hook para cargar la propiedad por id

  // Obtener el id de la propiedad desde la URL
  useEffect(() => {
    const propertyId = window.location.pathname.split("/").pop();
    setPropertyId(propertyId); // Setear el id de la propiedad
  }, []);

  // Llamar a fetchPropertyById cuando el id de la propiedad cambie
  useEffect(() => {
    if (propertyId) {
      setProperty(null); // Resetear propiedad antes de hacer la llamada
      fetchPropertyById(propertyId)
        .then((data) => {
          if (data) {
            setProperty(data); // Solo setear si la propiedad es válida
          } else {
            setProperty(null); // Si no se encuentra la propiedad, manejar el caso
          }
        })
        .catch((err) => {
          console.error("Error fetching property:", err);
          setProperty(null); // En caso de error, manejar el estado como no encontrado
        });
    }
  }, [propertyId]);

  // Mostrar Skeleton mientras se carga la propiedad
  if (loading) return <PropertyDetailSkeleton />;

  // Mostrar mensaje de error si ocurre
  if (error) return <ErrorDisplay message={error} />;

  // Si no hay propiedad, mostrar "Property not found"
  if (!property) return <ErrorDisplay message="Property not found" />;

  // Función para convertir valores numéricos correctamente
  const parseNumber = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
  };

  const formatPhoneNumber = (phone) => {
    // Elimina el ".0" del número si existe
    return phone ? phone.toString().replace(".0", "") : "";
  };

  // Convertir valores numéricos antes de mostrarlos
  const bedrooms = parseNumber(property.dormitorios);
  const bathrooms = parseNumber(property.banos);
  const totalArea = parseNumber(property.superficie_total);
  const coveredArea = parseNumber(property.superficie_cubierta);
  const priceAmount = parseNumber(property.price_amount);
  const expensesAmount = parseNumber(property.expenses_amount);

  // Separar las imágenes
  const images = property.images
    ? property.images.split("|").filter((img) => img.startsWith("http"))
    : [];
  const formattedPhone = formatPhoneNumber(property.whatsapp); // Formatea el número de whatsapp

  const getCurrencySymbol = (currency) => {
    if (currency === "$") {
      return "$"; // Signo de peso argentino
    }
    return "USD"; // Dólar
  };

  const getSiteBadgeImage = (site) => {
    if (site === "argenprop") {
      return "/images/argenprop.jpg"; // Imagen de Argenprop
    } else if (site === "zonaprop") {
      return "/images/zonaprop.jpg"; // Imagen de Zonaprop
    }
    return "/placeholder.svg"; // Imagen por defecto
  };

  const formattedPrice = priceAmount.toLocaleString("es-AR");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-xl rounded-xl">
          <CardContent className="p-0">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((foto, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative">
                      <img
                        src={foto || "/placeholder.svg"}
                        alt={`Property photo ${index + 1}`}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                      {/* Badge que muestra la imagen del sitio de origen */}
                      <div className="absolute top-2 left-2 m-2 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                        <img
                          className="w-full h-full object-cover"
                          src={getSiteBadgeImage(property.site)}
                          alt={property.site}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center space-x-2 text-gray-500">
                <MapPin size={18} />
                <span>{property.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="text-lg py-1 px-3">
                <Bed size={18} className="mr-2" />
                {bedrooms} Bedrooms
              </Badge>
              <Badge variant="secondary" className="text-lg py-1 px-3">
                <Bath size={18} className="mr-2" />
                {bathrooms} Bathrooms
              </Badge>
              <Badge variant="secondary" className="text-lg py-1 px-3">
                <Ruler size={18} className="mr-2" />
                {coveredArea} m²
              </Badge>
            </div>

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="text-gray-700 leading-relaxed">
                {property.description}
              </TabsContent>
              <TabsContent value="features">
                <ul className="grid grid-cols-2 gap-4">
                  <li className="flex items-center">
                    <Bed size={18} className="mr-2 text-gray-500" />
                    {bedrooms} Bedrooms
                  </li>
                  <li className="flex items-center">
                    <Bath size={18} className="mr-2 text-gray-500" />
                    {bathrooms} Bathrooms
                  </li>
                  <li className="flex items-center">
                    <Ruler size={18} className="mr-2 text-gray-500" />
                    {totalArea} m² Covered
                  </li>
                  <li className="flex items-center">
                    <Ruler size={18} className="mr-2 text-gray-500" />
                    {coveredArea} m² Total
                  </li>
                  <li className="flex items-center">
                    <Home size={18} className="mr-2 text-gray-500" />
                    {property.ambientes} Rooms
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary flex items-center justify-center">
                    {getCurrencySymbol(property.price_currency)} {formattedPrice}
                  </p>

                  {expensesAmount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      + ${expensesAmount.toLocaleString()} expenses
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Info size={18} className="mr-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Phone size={18} className="mr-2 text-gray-500" />+{formattedPhone}
                    </p>
                    <p className="flex items-center">
                      <Mail size={18} className="mr-2 text-gray-500" />
                      {property.publisher_nombre}
                    </p>
                  </div>
                  <Button className="w-full">Contact Seller</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/properties">
            <Button variant="outline">Back to Listings</Button>
          </Link>
          <Button>Schedule a Visit</Button>
        </div>
      </motion.div>
    </div>
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8 animate-pulse">
      <div className="aspect-video bg-gray-300 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div>
          <div className="h-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ message }) {
  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-gray-700">{message}</p>
      <Link href="/properties" className="mt-4 inline-block">
        <Button variant="outline">Back to Listings</Button>
      </Link>
    </div>
  );
}
