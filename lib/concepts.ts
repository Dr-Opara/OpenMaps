export type Environment = "city" | "highway" | "suburb" | "rural";

/** Local assets only (no external image URLs). Files live in /public/concepts. */
export const CONCEPTS = {
  hero: "/concepts/highway.jpg",
  live: "/concepts/highway.jpg",
} as const;

export const ENVIRONMENTS: {
  id: Environment;
  title: string;
  line: string;
  image: string;
  alt: string;
}[] = [
  {
    id: "city",
    title: "City",
    line: "Places, parking, traffic and what is happening around you.",
    image: "/concepts/city.jpg",
    alt: "OpenMaps on a phone in a city: turn guidance, nearby places and parking",
  },
  {
    id: "highway",
    title: "Highway",
    line: "Lane guidance, exits, traffic and what is coming next.",
    image: "/concepts/highway.jpg",
    alt: "OpenMaps on a phone on a highway: lane guidance, next exit and traffic",
  },
  {
    id: "suburb",
    title: "Suburb",
    line: "Neighborhood context, schools and precise destination guidance.",
    image: "/concepts/suburb.jpg",
    alt: "OpenMaps on a phone in a neighborhood: school, grocery and park labels",
  },
  {
    id: "rural",
    title: "Rural",
    line: "Weather, fuel and essential road intelligence.",
    image: "/concepts/rural.jpg",
    alt: "OpenMaps on a phone on a county road: fuel, food and incoming rain",
  },
];
