import Card from "@/components/ui/Card";
import getAlertas from "@/services/getAlertas";

export default async function Home() {

  const alertas = await getAlertas();

  return (
    <div className="p-20">
      <h1 className="mb-2 font-bold text-white sm:text-4xl">
        Meus Alertas
      </h1>
      <p>1 Alerta ativo</p>
      {alertas.map((alerta) => (
         <Card name={String(alerta.appid)} price={10} expectPrice={20} />
      ))}
    </div>
  );
}
