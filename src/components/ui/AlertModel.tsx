"use client"

import { X } from "lucide-react"
import { useState } from "react"
import Toast from "./Toast"
import { useRouter } from "next/navigation"

type AlertModalProps = {
    appid: number
    gameName: string
    currentPrice: number | string | null
    img: string | null | undefined
    onClose: () => void
}

export default function AlertModal({
    appid,
    gameName,
    onClose,
    currentPrice,
    img
}: AlertModalProps) {
      const router = useRouter();
      
    const [targetPrice, setTargetPrice] = useState("")
    const [showToast, setShowToast] = useState(false)
    
    console.log("CCUUUUCUCU" + gameName)


    const price = Number(currentPrice)
    const target = Number(targetPrice)

    const invalidPrice =
        targetPrice !== "" &&
        currentPrice !== null &&
        target > price

    async function criarAlerta() {
        if (invalidPrice || targetPrice === "") {
            return
        }

        const resposta = await fetch("/api/alertas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                appid: appid,
                img: img,
                name: gameName,
                targetPrice: Number(targetPrice),
            }),
        })

    if (!resposta.ok) {
        console.error("Erro ao criar alerta")
        return
    }

        setShowToast(true)

        setTimeout(() => {
            setShowToast(false)
            onClose()
            router.push("/alertas")
        }, 1000)

        
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="w-105 rounded-xl bg-[#111827] border border-slate-700 p-8 shadow-2xl">

                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Criar alerta de preço
                            </h2>

                            <p className="text-sm text-blue-400 mt-1">
                                {gameName} — preço atual: R$ {currentPrice}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mt-7">
                        <label className="text-sm text-blue-300">
                            Avise-me quando o preço chegar a:
                        </label>

                        <div
                            className={`flex items-center mt-2 rounded-lg px-4 h-14 border ${
                                invalidPrice
                                    ? "border-red-500"
                                    : "border-blue-500"
                            }`}
                        >
                            <span className="text-gray-400 mr-2">
                                R$
                            </span>

                            <input
                                type="number"
                                placeholder="0,00"
                                value={targetPrice}
                                onChange={(e) =>
                                    setTargetPrice(e.target.value)
                                }
                                className="bg-transparent outline-none text-white text-lg w-full"
                            />
                        </div>

                        {invalidPrice && (
                            <p className="text-red-400 text-sm mt-2">
                                O valor do alerta deve ser menor que o preço atual do jogo.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-slate-800 border border-slate-700">
                        <p className="text-sm text-blue-300">
                            Você receberá um aviso quando o preço do jogo for
                            igual ou menor que o valor definido.
                        </p>
                    </div>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={criarAlerta}
                            disabled={invalidPrice || targetPrice === ""}
                            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Criar alerta
                        </button>
                    </div>
                </div>
            </div>

            {showToast && (
                <Toast
                    message="Alerta criado com sucesso!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    )
}