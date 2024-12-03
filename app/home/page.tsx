import Header from "@/components/main/header";
import SearchBar from "@/components/main/search-bar";
import Hero from "@/components/main/hero";
import Navbar from "@/components/main/navbar";
import Expiring from "@components/main/expiring";
import Recommended from "@components/main/recommended";

export default function Home() {
  return (
    <main className="pb-24"> {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <SearchBar />
      <Hero />
      <Expiring />
      <Navbar />
      <Recommended />
    </main>
  );
}