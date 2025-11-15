import { useState, useEffect } from "react";
import type { Client, Item } from "@/types";
import { getAllClients, getAllItems } from "@/services/api";

/**
 * Custom hook to load clients and items data
 */
export const useOrderData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clientsData, itemsData] = await Promise.all([
          getAllClients(),
          getAllItems(),
        ]);

        setClients(clientsData);
        setItems(itemsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { clients, items, loading, error };
};
