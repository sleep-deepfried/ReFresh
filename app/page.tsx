import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import FoodCategory from "@/components/food-category";
import AddRemoveCard from "@/components/add-remove-card";
import Inventory from "@/components/inventory";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="pb-24"> {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <SearchBar />
      <FoodCategory />
      <AddRemoveCard />
      <Inventory />
      <Inventory />
      <Inventory />
      <Inventory />
      <Inventory />
      <Inventory />
      
      <Navbar /> {/* Remove the absolute positioning div wrapper */}
    </main>
  );
}