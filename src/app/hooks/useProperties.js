import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar las propiedades desde Supabase
  const fetchProperties = async () => {
    try {
      // Realizar la solicitud para obtener todas las propiedades desde Supabase
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
        `);

      if (fetchError) throw fetchError;

      // Asociar las fotos (si están en el campo images)
      const propertiesWithPhotos = propertiesData.map((property) => {
        const photos = property.images ? property.images.split("|").filter((url) => url.includes("http")) : [];
        return {
          ...property,
          fotos: photos,  // Aquí se añaden las imágenes procesadas
        };
      });

      setProperties(propertiesWithPhotos);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar las propiedades: " + error.message);
      setLoading(false);
    }
  };

  // Función para cargar una propiedad específica por id
  const fetchPropertyById = async (id) => {
    try {
      const { data: propertyData, error: fetchError } = await supabase
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
        .single();  // Devuelve solo un objeto (propiedad única)

      if (fetchError) {
        throw fetchError;
      }

      const propertyWithPhotos = {
        ...propertyData,
        fotos: propertyData.images ? propertyData.images.split("|").filter((url) => url.includes("http")) : [],
      };

      return propertyWithPhotos;
    } catch (error) {
      setError("Error al cargar la propiedad: " + error.message);
      return null;  // Retornamos null si ocurre un error
    }
  };

  // Cargar las propiedades al montar el componente
  useEffect(() => {
    fetchProperties();
  }, []); // Solo se ejecuta una vez al montar el componente

  return { properties, loading, error, fetchPropertyById };
};
