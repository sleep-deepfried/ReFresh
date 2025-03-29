"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiCuisineChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [inputMessage, setInputMessage] = useState("");
  const [inventory, setInventory] = useState<
    { food_name: string; quantity: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Safely initialize Gemini AI with error handling
  const genAI = React.useMemo(() => {
    try {
      // Ensure API key is correctly accessed
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Gemini API key is not defined");
        return null;
      }
      return new GoogleGenerativeAI(apiKey);
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      return null;
    }
  }, []);

  // Fetch inventory on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/get-inventory");
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      }
    };

    fetchInventory();
  }, []);

  // Generate cuisine recommendations based on inventory
  // Updated generateCuisineRecommendations function
  const generateCuisineRecommendations = async (userQuery: string) => {
    if (!genAI) {
      return "API configuration error. Please check your API setup.";
    }

    try {
      // Prepare inventory context
      const inventoryItems = inventory
        .map((item) => `${item.food_name} (${item.quantity} available)`)
        .join(", ");

      // Combine user query with inventory context
      const prompt = `
        You are a professional Filipino cuisine chef and cookbook author. (if the user asked in filipino answer in filipino)
        Current kitchen inventory: ${inventoryItems}
        User query: ${userQuery}
        
        For the requested dish, provide a comprehensive response in the following structured format:
  
        ## 🍲 Authentic [Dish Name] Recipe
  
        ### 🥘 Traditional Ingredients
        - List all authentic, traditional ingredients
        - Specify exact quantities
        - Note any regional variations
  
        ### 👨‍🍳 Authentic Cooking Method
        - Detailed step-by-step traditional preparation
        - Cooking techniques specific to the dish
        - Traditional serving suggestions
  
        ### 🛒 Essential Ingredients to Buy
        - List key ingredients missing from current inventory
        - Explain why these ingredients are crucial
        - Suggest where to find them
  
        ### 🥄 Inventory-Based Adaptation
        - If current inventory is insufficient, suggest:
          * Closest possible adaptation
          * Substitutions
          * Simplified version of the dish
  
        Emphasize authenticity first, then provide practical adaptation advice.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      return "I'm having trouble generating a recommendation right now. Please check your API configuration.";
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    // Generate AI response
    try {
      const aiResponse = await generateCuisineRecommendations(inputMessage);
      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I couldn't process that request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert Markdown to HTML
  function formatMarkdown(text: string): string {
    return text
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold mt-3 text-blue-700">$1</h2>'
      ) // Headers with color
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') // Italics
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-2 text-blue-600">$1</h3>'
      ) // Sub-headers
      .replace(
        /^\* (.*$)/gim,
        '<li class="ml-4 list-disc flex items-center">$1</li>'
      ) // Bullet points
      .replace(
        /🍖|🍊|🍅|🧅|🌶️|🥬|🍆|🫛|🥕|🛒|🍗|🥣|👨‍🍳|🥘|🍲|🥣|🥗|🧂|🍽️|⏱️|🔥|🍚|🚨|💡|💭|🇵🇭|👨‍🍳/g,
        (emoji) => `<span class="mr-1">${emoji}</span>`
      ) // Emoji handling
      .replace(/\n/g, "<br/>"); // Line breaks
  }

  // Rest of the component remains the same...
  return (
    <div className="fixed bottom-7 right-4 z-50">
      {/* Chatbot Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        Bot
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white shadow-xl rounded-lg border">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Filipino Cuisine Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ✕
            </button>
          </div>

          {/* Updated message rendering in the chat messages section */}
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-2xl ax ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-green-100 text-left mr-auto"
                }`}
              >
                <div
                  className={`whitespace-pre-wrap ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html:
                      msg.role === "ai"
                        ? formatMarkdown(msg.content)
                        : msg.content,
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500 italic">
                Generating response...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about Filipino cuisine..."
              className="flex-grow p-2 border rounded mr-2"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiCuisineChatbot;
