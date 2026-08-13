import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="text-white border border-gray-200 rounded-lg mx-20 mt-10">
     <Card name="God of War" price={100} expectPrice={50} status="teste"/>
    </div>
  );
}
