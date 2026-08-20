"use client"

import { useState } from "react"

const GAMES = [
    "Valorant",
    "League of Legends",
    "Counter-Strike 2",
    "GTA V",
    "Cyberpunk 2077",
    "Minecraft"
]

type DataListProps = {
    value: string
    onChange: (value: string) => void
}

export default function DataList({ value, onChange }: DataListProps) {
    const [isFocused, setIsFocused] = useState(false)

    const filteredGames = value
        ? GAMES.filter((game) => game.toLowerCase().includes(value.toLowerCase()))
        : []

    return (
        <div className="relative flex-1">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Pesquise por um jogo..."
                className="w-full bg-transparent border-none outline-none text-slate-100 placeholder-gray-400 text-sm font-medium"
            />

            {isFocused && filteredGames.length > 0 && (
                <ul className="absolute left-0 top-full mt-3 w-full bg-slate-900/95 backdrop-blur-md border border-blue-500/40 rounded-b-lg shadow-2xl py-1.5 z-50 overflow-hidden divide-y divide-slate-800/40">
                    {filteredGames.map((game) => (
                        <li
                            key={game}
                            onClick={() => onChange(game)}
                            className="px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-150 flex items-center justify-between font-medium"
                        >
                            <span>{game}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}