import { gameSave } from "@/types/types"
import { BellPlus } from "lucide-react"

type GameCardProps = {
    game: gameSave
}

export default function GameCard({ game }: GameCardProps) {
    return (
        <div className="group mt-6 rounded-xl border border-slate-700/80 bg-gradient-to-b from-slate-800 to-slate-800/80 p-5 shadow-lg shadow-slate-950/20 transition duration-200">
            {game.image && (
                <img
                    src={game.image}
                    alt={game.name}
                    className="mb-4 h-48 w-full rounded-lg object-cover transition duration-300 group-hover:brightness-110"
                />
            )}

            <h2 className="text-2xl font-bold tracking-tight text-white">
                {game.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
                {game.description || "Descrição não disponível."}
            </p>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-medium text-white transition hover:bg-cyan-600 cursor-pointer">
                <BellPlus className="h-4 w-4" aria-hidden="true" />
                <span>Criar alerta</span>
            </button>
        </div>
    )
}