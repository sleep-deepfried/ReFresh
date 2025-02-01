"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import SearchBar from "@components/main/search-bar";
import CardCarousel from "@components/main/card-carousel"
import { slides } from "@/data/recomendation-category";
import dynamic from "next/dynamic";
import { RecommendationItem } from "@/types"
import { RecipeDetailsProvider } from '@/providers/recipe-details-context';
import RecipeDetailsModal from "@/components/main/[food_name]-recipe";
import Navbar from "@/components/main/navbar";


const GeminiRecommendation = dynamic(() => import('@components/main/gemini-recomendation'), { ssr: false });

function Recommendation() {
    const [recommendation, setRecommendation] = useState<RecommendationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchRecommendation = async () => {
        try{
            const response = await fetch("http://47.129.131.225/api/suggest-cuisines");
            const data = await response.json();
            setRecommendation(data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchRecommendation();
    },[]);

    const customOptions = {
        perPage: 3,
        gap: '1rem',
        arrows: false,
    };
    

    const recommendationItems = recommendation.map(item => ({
        ...item,
        src: item.food_name 
            ? `/assets/${item.food_name.toLowerCase().replace(/\s+/g, '-')}.svg` 
            : '/assets/recommended-default.jpg',
        alt: item.food_name || 'Recommended Meal',
        title: item.food_name || 'Unknown Meal', 
        description: item.description || 'No description available'
    }));

    return(
        <RecipeDetailsProvider>
            <div className="overflow-x-hidden relative">
                {/* Header */}
                <div className="relative flex px-6 pt-8 pb-20">
                    <p className="text-4xl font-bold">Best Meals <br /> for you</p>
                    <Image src="/assets/burger.svg" alt="burger" width={350} height={200} className="absolute -right-2 top-0"/>
                </div>

                {/* SearchBar */}
                <SearchBar />

                {/* Categories */}
                <div>
                    <p className="text-2xl px-6 font-bold">
                        Catergories
                    </p>
                    <div className="">
                        <CardCarousel slides={slides} options={customOptions}/>
                    </div>
                </div>

                {/* Recommended for you */}
                {loading ? (
                    <div>Loading recommendations...</div>
                ) : (
                    <GeminiRecommendation
                        title="Recommended for you"
                        linkText="See all"
                        linkHref="#"
                        items={recommendationItems}
                    />
                )}
                <RecipeDetailsModal />
            </div>
            <Navbar />
        </RecipeDetailsProvider>
    );
}

export default Recommendation