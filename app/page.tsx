import Header from "@/components/main/header";
import SearchBar from "@/components/main/search-bar";
import FoodCategory from "@/components/main/food-category";
import AddRemoveCard from "@/components/main/hero";
import Inventory from "@/components/main/inventory";
import Navbar from "@/components/main/navbar";

export default function Home() {
  return (
    <main className="pb-24"> {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <SearchBar />
      <FoodCategory />
      <AddRemoveCard />
      
      <Navbar />
    </main>
  );
}