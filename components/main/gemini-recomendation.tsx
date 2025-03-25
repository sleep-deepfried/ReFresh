'use client';

import Image from 'next/image';
import { RecommendationProps } from "@/types"
import { useRecipeDetails } from '@/providers/recipe-details-context';


function RecommendationSection({ items }: RecommendationProps) {
    const { openRecipeDetails } = useRecipeDetails();
    return (
        <div className="px-6 space-y-3">

        {items.map((item, index) => (
            <div
            key={index}
            className="flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] p-3"
            >
                <div className="flex space-x-7 relative">
                    <div className='absolute rounded-2xl bg-black opacity-50 text-white px-2 py-1 top-1.5 left-1.5'>
                        <p className='text-[8px] font-bold'>
                            {item.category}
                        </p>
                    </div>
                    <Image src={item.src} alt={item.alt} width={125} height={40}  className="rounded-xl" onError={(e) => {
                                    const imgElement = e.currentTarget as HTMLImageElement;
                                    imgElement.src = '/assets/recommended-default.jpg';
                                }}
                    />

                    <div className="space-y-2">
                    <div>
                        <p className="font-bold text-[14px] line-clamp-1">{item.title}</p>
                        <p className="text-xs line-clamp-2">{item.description}</p>
                    </div>
                    <button className="text-[8px] bg-orange py-1 px-3 text-white rounded-md shadow-md"
                            onClick={() => openRecipeDetails(item)}
                    >
                        See Recipe
                    </button>
                    </div>
                </div>
            </div>
        ))}
        </div>
    );
}

export default RecommendationSection;
