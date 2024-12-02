import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface InventoryItem {
    inventoryID: number;
    food_name: string;
    food_type: string;
    quantity: number;
}

interface RecipeRecommendation {
    id: number;
    food_name: string;
    tagline: string;
    description: string;
    category: string;
    ingredients: Array<{
        id: number;
        ingredients_string: string;
    }>;
    how_to_cook: Array<{
        id: number;
        step: string;
    }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
    try {
        const inventoryQuery = `
        SELECT "inventoryID", food_name, food_type, quantity
        FROM public.food_inventory
        WHERE quantity > 0;
        `;
        const inventoryResult = await pool.query(inventoryQuery);
        const inventory: InventoryItem[] = inventoryResult.rows;

        const inventoryList = inventory.map(item => 
        `${item.food_name} (${item.food_type}): ${item.quantity}`
        ).join(', ');

        const prompt = `
        I have the following food inventory: ${inventoryList}. 
        Suggest 3 traditional Filipino cuisine recipes that can be made using these ingredients. 
        For each recipe, provide:
        - A unique ID
        - Food name
        - Tagline (EXACTLY 3-4 words only)
        - Description
        - Category
        - A list of ingredients with IDs, using descriptive measurement phrases like "2 cups of rice"
        - Cooking steps with IDs
        
        Respond strictly in this JSON format:
        {
            "recipes": [
            {
                "id": 1,
                "food_name": "",
                "tagline": "Quick Pinoy Delight",
                "description": "",
                "category": "",
                "ingredients": [
                {
                    "id": 1,
                    "ingredients_string": "2 cups of rice"
                }
                ],
                "how_to_cook": [
                {
                    "id": 1,
                    "step": ""
                }
                ]
            }
            ]
        }

        Important: Tagline must be EXACTLY 3-4 words!
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recipeText = response.text();

        let parsedRecipes: { recipes: RecipeRecommendation[] };
        try {
        parsedRecipes = JSON.parse(recipeText);
        } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        return NextResponse.json(
            { message: 'Failed to parse recipe recommendations', error: parseError },
            { status: 500 }
        );
        }

        return NextResponse.json(parsedRecipes.recipes, { status: 200 });

    } catch (error) {
        console.error('Error generating recipe recommendations:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
        { message: 'Internal server error', error: errorMessage },
        { status: 500 }
        );
    }
}