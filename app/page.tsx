import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import FoodCategory from "@/components/food-category";


export default function Home() {
  return (
    <div>
      <Header />
      <SearchBar />
      <FoodCategory />
    </div>
  );
}
