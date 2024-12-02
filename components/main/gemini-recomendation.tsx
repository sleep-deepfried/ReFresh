'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RecommendationProps } from "@/types"
import { useRecipeDetails } from '@/providers/recipe-details-context';
// import { RecipeProps } from '@/types';


function RecommendationSection({ title, linkText, linkHref, items }: RecommendationProps) {
    const { openRecipeDetails } = useRecipeDetails();
    return (
        <div className="px-6 space-y-7">
        <div className="flex justify-between">
            <p className="text-xl font-bold">{title}</p>
            <Link href={linkHref} className="text-orange">
            {linkText}
            </Link>
        </div>

        {items.map((item, index) => (
            <div
            key={index}
            className="flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] p-3"
            >
                <div className="flex space-x-7">
                    <Image src={item.src} alt={item.alt} width={125} height={40} />
                    <div className="space-y-2">
                    <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-xs">{item.description}</p>
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
