import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="p-20">
      <h1 className="mb-2 font-bold text-white sm:text-4xl">
        Meus Alertas
      </h1>
      <p>1 Alerta ativo</p>
      <Card name="God of War" price={100} expectPrice={50} status="teste" />
    </div>
  );
}
