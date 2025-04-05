import Expiring from "@/components/main/expiring";
import Header from "@/components/main/header";
import Hero from "@/components/main/hero";
import Navbar from "@/components/main/navbar";

export default function Home() {
  return (
    <main className="pb-24 bg-[#E8ECEF] text-black min-h-screen">
      {" "}
      {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <div className="z-20">
        <Hero />
      </div>
      <div className="z-10 bg-white min-h-screen">
        <Expiring />
      </div>
      <Navbar />
    </main>
  );
}
