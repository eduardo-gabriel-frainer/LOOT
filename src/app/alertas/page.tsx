import AlertList from "@/components/AlertList";

export const dynamic = "force-dynamic";

export default function AlertasPage() {
  return (
    <div className="p-20">
      <h1 className="mb-2 font-bold text-white sm:text-4xl">
        Meus Alertas
      </h1>
      <AlertList />
    </div>
  );
}
