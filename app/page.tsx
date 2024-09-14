import VPNCheckout from "@/components/app/VPNCheckout";

export default function Home() {
  return (
    <main className="relative flex min-h-[100svh] gap-4 flex-col items-center  bg-bg dark:bg-darkBg px-5 py-[150px]  font-bold">
      <h1 className="text-6xl font-bold text-text dark:text-darkText">
        LN VPN
      </h1>
      <VPNCheckout />
    </main>
  );
}
