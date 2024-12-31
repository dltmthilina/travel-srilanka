"use client"; // Add this for Next.js (app router)

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect } from "react";

export default function DistrictMap() {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: "https://demotiles.maplibre.org/style.json",
      center: [80.7718, 7.8731], // Sri Lanka
      zoom: 6,
      minZoom: 5, // Minimum zoom level
      maxZoom: 8,
    });

    // Load GeoJSON Data
    map.on("load", () => {
      map.addSource("districts", {
        type: "geojson",
        data: "/lk.json", // Path to your GeoJSON
      });

      map.addLayer({
        id: "district-boundaries",
        type: "fill-extrusion",
        source: "districts",
        paint: {
          "fill-extrusion-color": "#3993D3", // Color for the district fill
          "fill-extrusion-height": 1000, // Use 'height' property from GeoJSON (optional, can be a fixed value)
          "fill-extrusion-base": 0, // Base level of extrusion
          "fill-extrusion-opacity": 0.8, // Transparency of the fill
        },
      });

      map.addLayer({
        id: "district-boundary-lines",
        type: "line",
        source: "districts",
        paint: {
          "line-color": "#000",
          "line-width": 1,
        },
      });

      map.addLayer({
        id: "district-names",
        type: "symbol",
        source: "districts",
        layout: {
          "text-field": ["get", "name"], // Get the district name from the 'name' property
          "text-size": 12, // Size of the text
          "text-anchor": "center", // Anchor the text at the center of the district
          "text-allow-overlap": true, // Allow overlapping labels
        },
        paint: {
          "text-color": "#000", // Color of the text
          "text-halo-color": "#fff", // Add a halo to improve text visibility
          "text-halo-width": 2, // Width of the halo around the text
        },
      });

      map.on("click", "district-boundaries", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["district-boundaries"],
        });

        if (features.length > 0) {
          const feature = features[0];
          const districtName = feature.properties.name; // Assuming 'name' is the property for district name
          alert(`You clicked on district: ${districtName}`);
          // You can do more with the feature, like showing more info or navigating to a new page
        }
      });
    });

    return () => map.remove(); // Cleanup
  }, []);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
}
