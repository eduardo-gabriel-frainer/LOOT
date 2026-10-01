"use client"

import { useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import DataList from "./DataList"
import { gameSave } from "@/types/types"
import GameCard from "./GameCard"

type SearchProps = {
    games: gameSave[]
}

export default function Search({ games }: SearchProps) {
    const [searchValue, setSearchValue] = useState("")
    const [selectedGame, setSelectedGame] = useState<gameSave | null>(null)

    function pesquisar() {
        const game = games.find(
            (game) =>
                game.name.toLowerCase().includes(searchValue.toLowerCase())
        )

        setSelectedGame(game || null)
    }

    return (
        <div className="w-150 mt-10">

            <div className="flex border border-blue-500 justify-between p-2 rounded-lg items-center">
                <div className="flex gap-4 items-center flex-1 pr-4">
                    <SearchIcon className="text-gray-400 shrink-0" />

                    <DataList
                        value={searchValue}
                        onChange={setSearchValue}
                        games={games}
                    />

                    <button
                        onClick={pesquisar}
                        className="py-1 px-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                    >
                        Pesquisar
                    </button>
                </div>
            </div>

            {selectedGame && (
                <GameCard game={selectedGame} />
            )}

        </div>
    )
}