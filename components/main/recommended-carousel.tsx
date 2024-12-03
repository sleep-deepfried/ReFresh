'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecipeDetails } from '@/providers/recipe-details-context';
import { RecommendationItem } from "@/types"
import RecipeDetailsModal from "@/components/main/[food_name]-recipe";
import { RecipeDetailsProvider } from '@/providers/recipe-details-context';

interface RecommendedItemProps {
  slides?: RecommendationItem[]; // Optional prop
}

function RecommendedCarousel({ slides = [] }: RecommendedItemProps) {
    const [recommended, setRecommended] = useState<RecommendationItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Move the context hook inside the component
    const recipeDetailsContext = useRecipeDetails();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch("/api/suggest-cuisines");
                const data = await response.json();
                // Limit to first 3 recommendations
                setRecommended(data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    // Use recommendations if available, otherwise use slides prop (also limited to 3)
    const itemsToDisplay = recommended.length > 0 ? recommended : slides.slice(0, 3);

    return (
        <div className="py-3 px-4 space-y-4 gap-4">
            {loading ? (
                <p>Loading...</p>
            ) : itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item, index) => (
                    <div
                        key={index}
                        className="flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] p-3"
                    >
                        <div className="flex space-x-7">
                            <Image 
                                src={`/assets/${item.food_name.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                                alt={item.food_name} 
                                width={125} 
                                height={40} 
                            />
                            <div className="space-y-2">
                                <div>
                                    <p className="font-bold">{item.food_name}</p>
                                    <p className='text-xs'>{item.tagline}</p>
                                </div>
                                <button 
                                    className="text-[8px] bg-orange py-1 px-3 text-white rounded-md shadow-md"
                                    onClick={() => {
                                        console.log("Opening recipe details for:", item);
                                        recipeDetailsContext.openRecipeDetails(item);
                                    }}
                                >
                                    See Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No recommendations found.</p>
            )}
            <RecipeDetailsModal />
        </div>
    );
}

// Wrap the component with the provider in its parent component or page
function RecommendedCarouselWrapper(props: RecommendedItemProps) {
    return (
        <RecipeDetailsProvider>
            <RecommendedCarousel {...props} />
        </RecipeDetailsProvider>
    );
}

export default RecommendedCarouselWrapper;