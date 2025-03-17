import Header from "@/components/main/header";
import Hero from "@/components/main/hero";
import Navbar from "@/components/main/navbar";
import Expiring from "@components/main/expiring";
import Recommended from "@components/main/recommended";

export default function Home() {
  return (
    <main className="pb-24"> {/* Add padding bottom to prevent content from being hidden behind navbar */}
      <Header />
      <div className="z-20">
      <Hero  />
      </div>
      {/* <Expiring /> */}
      <Navbar />
      {/* <Recommended /> */}
    </main>
  );
}