import Navbar from "@components/main/navbar";
import Header from "@/components/main/header";
import DonutChart from "@components/main/analytics/donut";

import { format } from "date-fns";
import TrendsCarousel from "@/components/main/analytics/trends-card";
import WeeklyFoodStats from "@/components/main/analytics/food-stats";
import FoodCategoryRadarChart from "@/components/main/analytics/radar-chart";

const getCurrentWeekRange = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6); // Sunday

  return `${format(startOfWeek, "MMM dd")} - ${format(endOfWeek, "MMM dd")}`;
};

const getCurrentYear = () => {
  const today = new Date();
  return format(today, "yyyy");
};

export default function Analytics() {
  return (
    <div className="bg-[#E8ECEF] overflow-x-hidden ">
      <div className="bg-gradient-to-b from-green-100 to-blue-100 pb-28">
        <Header />
        <div className="p-4 flex flex-col items-center justify-center">
          <div className="text-lg font-semibold w-fit text-center text-black">
            {getCurrentWeekRange()} <br /> {getCurrentYear()}
          </div>
          <DonutChart />
        </div>
        <Navbar />
      </div>

      <WeeklyFoodStats />

      <div className="pl-6 pt-6">
        <p className="text-black font-bold text-xl pb-4">
          See your weekly trends
        </p>
        <TrendsCarousel />
      </div>

      <div className="py-6">
        <p className="text-black font-bold text-xl pl-6 pb-4">
          This week on your fridge
        </p>
        <FoodCategoryRadarChart />
      </div>
    </div>
  );
}
