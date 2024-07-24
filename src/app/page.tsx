"use client";
import FAQView from "@/components/view/FAQView";
import HistoricalFeeChartView from "@/components/view/HistoricalFeeChartView";
import NotificationSetupForm from "@/components/view/NotificationSetupForm";
function Home() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row ">
      <NotificationSetupForm />
      <div className="flex w-full flex-col">
        <div className="flex-1 p-3">
          <HistoricalFeeChartView />
        </div>
        <div className="flex flex-1 bg-slate-50/60">
          <FAQView />
        </div>
      </div>
    </main>
  );
}

export default Home;
