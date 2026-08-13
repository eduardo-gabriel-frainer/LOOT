import SearchInput from "@/components/ui/Search";

export default function Home() {
  return (
    <div className="flex flex-col text-center pt-10 text-white items-center">
      <div className="text-5xl font-bold">
        <h1 className="pb-2">Sua próxima conquista</h1>
        <h2 className="text-cyan-600">Pode estar em promoção.</h2>
      </div>
      <p className="pt-3 text-gray-400">Pesquise jogos, monitore preços e receba alertas quando o valor baixar.</p>
      <SearchInput/>
    </div>
  );
}
