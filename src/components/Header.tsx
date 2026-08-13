import Button from "./ui/Button";

export default function Header() {

    return (
        <header className="flex justify-between items-center text-gray-300 p-2 border-b border-gray-600">
            <div className="ml-10">
                LOOT
            </div>
            <div className="flex gap-5">
                <Button name="Início" href="/" />
                <Button name="Meus alertas" href="alertas"/>
            </div>
            <div className="mr-10">
                <p>Conta</p>
            </div>
        </header>
    )

}
