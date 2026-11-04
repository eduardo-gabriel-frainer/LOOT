"use client"

import { gameSave } from "@/types/types"
import { BellPlus } from "lucide-react"
import { useEffect, useState } from "react"
import AlertModal from "./AlertModel"

type GameCardProps = {
    game: gameSave
}

export default function GameCard({ game }: GameCardProps) {
    const [modalOpen, setModalOpen] = useState(false)
    const [image, setImage] = useState<string | null>(game.image || null)
    const [currentPrice, setCurrentPrice] = useState<number | string | null>(null)

    useEffect(() => {
        async function getGameData() {
            try {
                const response = await fetch(
                    `/api/steam?appid=${game.appid}`
                )

                const data = await response.json()

                const gameData = data[game.appid]?.data

                if (!gameData) return

                setImage(gameData.header_image || null)

                if (gameData.price_overview) {
                    setCurrentPrice(
                        gameData.price_overview.final / 100
                    )
                } else {
                    setCurrentPrice('Gratuito')
                }
            } catch (error) {
                console.error("Erro ao buscar dados do jogo:", error)
            }
        }

        getGameData()
    }, [game.appid])

    console.log("Current Price:", currentPrice)

    return (
        <>
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">

                {image && (
                    <img
                        src={image}
                        alt={game.name}
                        className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                )}

                <h2 className="text-2xl font-bold text-white">
                    {game.name}
                </h2>

                {currentPrice !== null && (
                    <p className="text-white mt-4 font-semibold">
                        Preço atual: R$ {String(currentPrice).replace('.', ',')}
                    </p>
                )}

                <button
                    onClick={() => setModalOpen(true)}
                    className="mt-5 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer flex items-center justify-center gap-2"
                >
                    <BellPlus size={18} />
                    Criar alerta
                </button>
            </div>

            {modalOpen && (
                <AlertModal
                    appid={game.appid}
                    gameName={game.name}
                    img={image}
                    currentPrice={currentPrice}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}