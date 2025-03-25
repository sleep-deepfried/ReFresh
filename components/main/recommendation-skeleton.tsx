"use client"

import React from 'react';

const RecommendationsSkeleton = () => {
    return (
        <div className="px-4 py-2 animate-pulse">
            {[1, 2, 3, 4, 5].map((item) => (
                <div 
                    key={item} 
                    className="flex items-center space-x-4 mb-4 bg-gray-100 rounded-xl p-4"
                >
                    {/* Image Placeholder */}
                    <div className="w-24 h-24 bg-gray-300 rounded-lg animate-pulse"></div>
                    
                    {/* Text Placeholders */}
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendationsSkeleton;