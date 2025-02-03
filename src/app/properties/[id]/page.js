"use client"

import { useEffect, useState } from "react"
import { useProperties } from "@/app/hooks/useProperties"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bath, Bed, Phone, Ruler, Mail, Info, MapPin, ChevronLeft, Calendar, X } from "lucide-react"

export default function PropertyDetail() {
  const [propertyId, setPropertyId] = useState(null)
  const [property, setProperty] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const { loading, error, fetchPropertyById } = useProperties()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = window.location.pathname.split("/").pop();
      setPropertyId(id);
    }
  }, []);
  

  useEffect(() => {
    if (propertyId) {
      setLoadingDetail(true)
      fetchPropertyById(propertyId)
        .then((data) => setProperty(data || null))
        .catch((err) => console.error("Error fetching property:", err))
        .finally(() => setLoadingDetail(false))
    }
  }, [propertyId]) // Added fetchPropertyById to dependencies

  if (loadingDetail) return <PropertyDetailSkeleton />
  if (error) return <ErrorDisplay message={error} />
  if (!property) return <ErrorDisplay message="Property not found" />

  const formattedPhone = property.whatsapp?.replace(".0", "")
  const formattedPrice = property.price_amount?.toLocaleString("es-AR")
  const images = property.images ? property.images.split("|").filter((img) => img.startsWith("http")) : []

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="relative">
  <div className="sticky top-0 z-20 bg-gradient-to-b from-white to-gray-100/90 backdrop-blur-lg shadow-md border-b px-6 py-3 flex justify-between items-center rounded-b-lg">
    {/* Botón Volver */}
    <Link href="/properties">
      <Button size="sm" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
        <ChevronLeft className="h-5 w-5" /> <span>Volver</span>
      </Button>
    </Link>

    {/* Título con Icono */}
    <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg md:text-xl">
      <MapPin className="h-5 w-5 text-blue-600" />
      <span className="truncate">{property.title}</span>
    </div>

    {/* Botón de Agendar Visita */}
    <Button variant="primary" size="sm" className="flex items-center gap-2">
      <Calendar className="h-5 w-5" />
      <span>Agendar Visita</span>
    </Button>
  </div>
</div>


        {/* Image Gallery */}
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((foto, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={foto || "/placeholder.svg"}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-[400px] object-contain cursor-pointer hover:opacity-90 transition-opacity duration-300"
                      onClick={() => setLightboxImage(foto)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
              onClick={() => setLightboxImage(null)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white"
                onClick={() => setLightboxImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={lightboxImage || "/placeholder.svg"}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Property Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h2>
              <p className="flex items-center text-gray-500">
                <MapPin size={20} className="mr-2" /> {property.address}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center">
                <Bed size={16} className="mr-2" /> {property.dormitorios} Bedrooms
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center">
                <Bath size={16} className="mr-2" /> {property.banos} Bathrooms
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center">
                <Ruler size={16} className="mr-2" /> {property.superficie_total} m²
              </Badge>
            </div>

            {/* Description Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700">{property.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="list-disc pl-4 text-gray-700 space-y-2">
                      <li>{property.ambientes} Rooms</li>
                      <li>{property.antiguedad} years old</li>
                      {/* Add more features here */}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact and Price */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-600">
                  {property.price_currency} {formattedPrice}
                </CardTitle>
                {property.expenses_amount > 0 && (
                  <p className="text-gray-500">+ ${property.expenses_amount} Expenses</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Publisher Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <Info size={18} className="mr-2" /> Contact
                  </h3>
                  <p className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-2" /> {formattedPhone}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-2" /> {property.publisher_nombre}
                  </p>
                </div>

                <Button className="w-full">Contact Agent</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PropertyDetailSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  )
}

function ErrorDisplay({ message }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}

