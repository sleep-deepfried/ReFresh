import Expiring from "@/components/main/expiring";
import Header from "@/components/main/header";
import Hero from "@/components/main/hero";
import Navbar from "@/components/main/navbar";
import RecentActivity from "@/components/main/recent-activity";

export default function Home() {
  return (
    <main className="bg-white text-black min-h-screen overflow-y-auto pb-24">
      {" "}
      {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <div className="z-20 bg-[#E8ECEF]">
        <Hero />
      </div>
      <div className="z-10">
        <Expiring />
        <RecentActivity />
      </div>
      <Navbar />
    </main>
  );
}
