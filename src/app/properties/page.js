"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProperties } from "@/app/hooks/useProperties";
import Pagination from "../components/Pagination";
import PropertyCard from "../components/PropertyCard";
import PropertyListSkeleton from "../components/PropertyListSkeleton";
import Filter from "../components/Filter";
import { supabase } from "../utils/supabaseClient";

const PropertyList = () => {
  const { properties, loading, error, nextPage, prevPage, page, totalPages } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSite, setFilterSite] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const router = useRouter();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const user = supabase.auth.getUser();
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
        <Filter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterSite={filterSite}
          setFilterSite={setFilterSite}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          isFilterExpanded={isFilterExpanded}
          setIsFilterExpanded={setIsFilterExpanded}
        />
      </header>

      {loading && !properties.length ? (
        <PropertyListSkeleton />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No properties found.
            </p>
          ) : (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      )}

      <Pagination nextPage={nextPage} prevPage={prevPage} page={page} totalPages={totalPages} />
    </div>
  );
};

export default PropertyList;
