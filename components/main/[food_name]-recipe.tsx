'use client';

import { useRecipeDetails } from '@/providers/recipe-details-context';
import Image from 'next/image';
import { IoIosArrowBack } from "react-icons/io";

function RecipeDetailsModal() {
    const { selectedRecipe, closeRecipeDetails } = useRecipeDetails();

    if (!selectedRecipe) return null;

    return (
        <div className="absolute inset-0 backdrop-blur-xs block h-full">
            <div className="bg-[url(`/assets/${selectedRecipe.food_name.toLowerCase().replace(/\s+/g, '-')}.png`)] bg-fixed bg-top bg-no-repeat h-full w-full bg-contain rounded-md relative">
                <button 
                    onClick={closeRecipeDetails} 
                    className="z-10 absolute top-3 left-4 text-black text-5xl"
                >
                    <IoIosArrowBack />
                </button>

                {/* Rest of your existing modal content, using selectedRecipe data */}
                <div className="absolute top-36 px-5 space-y-5">
                    <div className="bg-white py-4 px-6 rounded-2xl shadow-xl">
                        <p className="font-semibold">{selectedRecipe.food_name}</p>
                        <p className="text-xs">{selectedRecipe.description}</p>
                    </div>

                    {/* Ingredients section */}
                    <div className="bg-white py-4 px-6 rounded-2xl shadow-xl space-y-5">
                        <div className="space-y-4">
                            <div className="flex space-x-2 items-center">
                                <Image src="/assets/ingredients.svg" alt="ingredients" width={28} height={32} />
                                <p className="font-semibold text-2xl">Ingredients</p>
                            </div>
                            <hr className="h-px bg-slate-700"/>
                            <div className="px-9">
                                <ul className="list-disc">
                                    {selectedRecipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient.ingredients_string}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Cooking steps section */}
                        <div className="space-y-4">
                            <div className="flex space-x-2 items-center">
                                <Image src="/assets/how-to-cook.svg" alt="How to Cook" width={28} height={32} />
                                <p className="font-semibold text-2xl">How to Cook</p>
                            </div>
                            <hr className="h-px bg-slate-700"/>
                            <div className="px-9">
                                <ul className="list-decimal">
                                    {selectedRecipe.how_to_cook.map((step, index) => (
                                        <li key={index}>{step.step}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetailsModal;