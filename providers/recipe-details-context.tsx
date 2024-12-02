import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RecommendationItem } from '@/types'; // Assume you have a types file

interface RecipeDetailsContextType {
  selectedRecipe: RecommendationItem | null;
  openRecipeDetails: (recipe: RecommendationItem) => void;
  closeRecipeDetails: () => void;
}

const RecipeDetailsContext = createContext<RecipeDetailsContextType>({
  selectedRecipe: null,
  openRecipeDetails: () => {},
  closeRecipeDetails: () => {}
});

export const RecipeDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<RecommendationItem | null>(null);

  const openRecipeDetails = (recipe: RecommendationItem) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <RecipeDetailsContext.Provider value={{ 
      selectedRecipe, 
      openRecipeDetails, 
      closeRecipeDetails 
    }}>
      {children}
    </RecipeDetailsContext.Provider>
  );
};

export const useRecipeDetails = () => useContext(RecipeDetailsContext);