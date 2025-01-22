"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Usamos useRouter para redirigir
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
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../utils/supabaseClient";

export default function PropertyList() {
  const { properties, loading, error, nextPage, prevPage, page, totalPages } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSite, setFilterSite] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const router = useRouter();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const user = supabase.auth.getUser();
    console.log(user)
    if (!user) {
      router.push("/login"); // Redirigir al login si no hay usuario autenticado
    }
  }, [router]);

  const filteredProperties = properties.filter((property) => {
    return (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSite === "all" || property.site === filterSite) &&
      property.price_amount >= priceRange[0] &&
      property.price_amount <= priceRange[1]
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="mb-6">
        <div className="rounded-lg overflow-hidden">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <Select value={filterSite} onValueChange={setFilterSite} className="w-full sm:w-auto bg-white">
              <SelectTrigger className="w-full sm:w-40 rounded-full">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="argenprop">Argenprop</SelectItem>
                <SelectItem value="zonaprop">Zonaprop</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full sm:w-auto rounded-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              {isFilterExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" /> Hide Filters
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" /> More Filters
                </>
              )}
            </Button>
          </div>
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200"
              >
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <Slider
                      min={0}
                      max={1000000}
                      step={10000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {loading && !properties.length ? (
        <PropertyListSkeleton />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProperties.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No properties found.</p>
          ) : (
            filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)
          )}
        </motion.div>
      )}

      <div className="flex justify-center gap-5 items-center mt-6">
        <Button onClick={prevPage} disabled={page === 1}>
          Previous
        </Button>
        <p className="text-center">
          Page {page} of {totalPages}
        </p>
        <Button onClick={nextPage} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

function PropertyCard({ property }) {
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

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          className="w-full h-64 object-cover rounded-t-xl"
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
        />
        <div className="absolute top-0 left-0 m-2 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          <img
            className="w-full h-full object-cover"
            src={getSiteBadgeImage(property.site)}
            alt={property.site}
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h2 className="font-bold text-xl mb-2 line-clamp-1 text-gray-800">{property.title}</h2>
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
          <Button className="w-full mt-4 bg-black text-white hover:bg-yellow-600 rounded-xl transition-colors duration-300">
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
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
          <div className="w-full h-64 bg-gray-300"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
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
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
