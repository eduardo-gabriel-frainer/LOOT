import Card from "@/components/ui/Card";
import getAlertas from "@/services/getAlertas";

export default async function Home() {

  const {alertas, total} = await getAlertas();

  const text = total == 1 ? `${total} Alerta ativo` : `${total} Alertas ativos`

  return (
    <div className="p-20">
      <h1 className="mb-2 font-bold text-white sm:text-4xl">
        Meus Alertas
      </h1>
      <p>{text}</p>

      {total == 0  ? (
        <div className="flex justify-center">
          <p className="text-2xl mt-50">Nenhum alerta cadastrado</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 mt-5">
          {alertas.map((alerta) => (
            <Card name={String(alerta.name)} price={Number(alerta.currentPrice)} expectPrice={Number(alerta.targetPrice)} img={alerta.img}/>
          ))}
        </div>
      )}

    </div>
  );
}
