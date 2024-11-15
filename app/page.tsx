import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import FoodCategory from "@/components/food-category";
import AddRemoveCard from "@/components/add-remove-card";
import Inventory from "@/components/inventory";


export default function Home() {
  return (
    <div>
      <Header />
      <SearchBar />
      <FoodCategory />
      <AddRemoveCard />
      <Inventory />
    </div>
  );
}
