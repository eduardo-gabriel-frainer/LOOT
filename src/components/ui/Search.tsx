"use client"

import { useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import DataList from "./DataList"

export default function Search() {
    const [searchValue, setSearchValue] = useState("")

    return (
        <div className="flex border border-blue-500 w-150 justify-between p-2 rounded-lg mt-10 items-center">
            <div className="flex gap-4 items-center flex-1 pr-4">
                <SearchIcon className="text-gray-400 shrink-0" />
                <DataList value={searchValue} onChange={setSearchValue} />
            </div>

            <button
                className="py-1 px-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
            >
                Pesquisar
            </button>
        </div>
    )
}