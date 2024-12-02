export type Ingredient = {
    id: number;
    ingredients_string: string;
}

export type  HowToCook = {
    id: number;
    step: string;
}

export type  RecommendationItem = {
    id: number;
    food_name: string;
    tagline: string;
    description: string;
    category: string; // Corrected the spelling here
    ingredients: Ingredient[];  // Array of Ingredient objects
    how_to_cook: HowToCook[];   // Array of HowToCook objects
}

export type RecommendationItems = RecommendationItem &{
    src: string; // Image source
    alt: string; // Image alt text
    title: string; // Item title
    description: string; // Item description
  }

export type RecommendationProps = {
    title: string; // Section title
    linkText: string; // Text for the link
    linkHref: string; // Link URL
    items: RecommendationItems[]; // Array of recommendation items
  }
