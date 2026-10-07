"use client"

import { Check, X } from "lucide-react"

type ToastProps = {
    message: string
    onClose: () => void
}

export default function Toast({ message, onClose }: ToastProps) {
    return (
        <div className="fixed top-5 right-5 z-100 flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500/10">
                <Check
                    size={20}
                    className="text-green-400"
                />
            </div>

            <div>
                <p className="text-white font-semibold">
                    Sucesso!
                </p>

                <p className="text-gray-400 text-sm">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="ml-2 text-gray-500 hover:text-white transition"
            >
                <X size={18} />
            </button>
        </div>
    )
}