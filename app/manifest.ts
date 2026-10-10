import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenMaps",
    short_name: "OpenMaps",
    description: "Camera-first navigation. See what's ahead.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/openmaps-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/openmaps-app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
