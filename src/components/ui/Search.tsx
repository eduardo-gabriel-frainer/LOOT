import { Search } from "lucide-react"
export default function SearchInput() {
    return (
        <div className="flex border border-blue-500 w-150 justify-between p-2 rounded-lg mt-10">
            <div className="flex gap-4 items-center">
                <Search className="text-gray-400" />
                <input placeholder="Pesquise por um jogo" className="w-90 border-none outline-none text-gray-400" />
            </div>

            <button className="py-1 px-5 bg-blue-500 rounded-lg">
                Pesquisar
            </button>
        </div>
    )
}