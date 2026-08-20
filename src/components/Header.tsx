import Button from "./ui/Button";
import { User } from "lucide-react"

export default function Header() {

    return (
        <header className="flex justify-between items-center text-gray-300 p-2 border-b border-gray-600">
            <div className="ml-10">
                <img src="/images/1.png" className="w-30" />
            </div>
            <div className="flex gap-5 -ml-25">
                <Button name="Início" href="/" />
                <Button name="Meus alertas" href="/alertas" />
            </div>
            <div className="flex mr-10 gap-1 hover:bg-gray-500 p-2 rounded-xl">
                <User size={20}></User>
                <p>Conta</p>
            </div>
        </header>
    )

}
