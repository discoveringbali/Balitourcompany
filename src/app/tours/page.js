import React from "react";
import { getActiveListings } from "@/lib/cache";
import ToursClient from "./ToursClient";

export const revalidate = 3600; // Cache on server for 1 hour


export default async function Tours() {
  const allListings = await getActiveListings();
  const tours = allListings
    .filter(t => t.type === 'Tour')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return <ToursClient initialTours={tours || []} />;
}
