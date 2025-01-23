import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState(null); // Establecer el estado para la propiedad individual
  const [loading, setLoading] = useState(false); // Modificado para iniciar como false
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Función para obtener todas las propiedades
  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true);

      const pageSize = 9;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Obtener el total de propiedades
      const { count, error: countError } = await supabase
        .from("properties")
        .select("id", { count: "exact" });

      if (countError) throw countError;

      setTotalCount(count);
      setTotalPages(Math.ceil(count / pageSize));

      const { data: propertiesData, error: fetchError } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          description,
          caractextra,
          site,
          barrio,
          tipo_propiedad_id,
          tipo_propiedad_nombre,
          publisher_nombre,
          publisher_telefono,
          price_amount,
          price_currency,
          expenses_amount,
          expenses_currency,
          whatsapp,
          superficie_total,
          superficie_cubierta,
          ambientes,
          dormitorios,
          banos,
          antiguedad,
          latitude,
          longitude,
          address,
          images,
          url,
          scraped_at
        `)
        .range(from, to);

      if (fetchError) throw fetchError;

      const propertiesWithPhotos = propertiesData.map((property) => {
        const photos = property.images
          ? property.images.split("|").filter((url) => url.includes("http"))
          : [];
        return { ...property, fotos: photos };
      });

      setProperties(propertiesWithPhotos);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar las propiedades: " + error.message);
      setLoading(false);
    }
  };

  // Función para obtener una propiedad por ID
  const fetchPropertyById = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          description,
          caractextra,
          site,
          barrio,
          tipo_propiedad_id,
          tipo_propiedad_nombre,
          publisher_nombre,
          publisher_telefono,
          price_amount,
          price_currency,
          expenses_amount,
          expenses_currency,
          whatsapp,
          superficie_total,
          superficie_cubierta,
          ambientes,
          dormitorios,
          banos,
          antiguedad,
          latitude,
          longitude,
          address,
          images,
          url,
          scraped_at
        `)
        .eq("id", id)
        .single(); // Asegura que solo se obtenga una propiedad

      if (error) throw error;

      const propertyWithPhotos = {
        ...data,
        fotos: data.images ? data.images.split("|").filter((url) => url.includes("http")) : [],
      };

      setProperty(propertyWithPhotos); // Establecer la propiedad individual
      setLoading(false);
      return propertyWithPhotos; // Retornar los datos directamente
    } catch (error) {
      setError("Error al cargar la propiedad: " + error.message);
      setLoading(false);
      return null;
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    fetchProperties(page);
  }, [page]);

  return {
    properties,
    property, // Retornar la propiedad individual
    loading,
    error,
    nextPage,
    prevPage,
    page,
    totalPages,
    fetchPropertyById, // Exportar la nueva función
    setProperty, // Exportar setProperty
  };
};
