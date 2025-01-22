import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true);

      // Definir la cantidad de propiedades por página
      const pageSize = 9;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Obtener el total de propiedades (sin paginación)
      const { count, error: countError } = await supabase
        .from("properties")
        .select("id", { count: "exact" });

      if (countError) throw countError;

      setTotalCount(count);
      setTotalPages(Math.ceil(count / pageSize)); // Calcular el número total de páginas

      // Obtener las propiedades para la página actual
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

      // Asociar las fotos (si están en el campo images)
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

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    fetchProperties(page);
  }, [page]);

  return { properties, loading, error, nextPage, prevPage, page, totalPages };
};
