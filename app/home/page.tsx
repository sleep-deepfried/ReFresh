import Header from "@/components/main/header";
import Hero from "@/components/main/hero";
import Navbar from "@/components/main/navbar";

export default function Home() {
  return (
    <main className="pb-24"> {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <div className="z-20">
      <Hero  />
      </div>
      <Navbar />
     
    </main>
  );
}