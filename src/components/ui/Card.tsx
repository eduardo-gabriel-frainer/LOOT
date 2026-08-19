type cardProps = {
    name: string,
    price: number,
    expectPrice: number,
    status: string
}

export default function Card({ name, price, expectPrice, status }: cardProps) {
    return (
        <div className="flex justify-between p-4 items-center bg-gray-800 border rounded-xl border-gray-600">
            <div className="flex">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq2MXq2ORdfwLev7s34kACtNVYKp2KIRXwyaV32SnJfg&s=10"
                    className="max-h-20 w-35 rounded-xl mr-5"
                />
                <div className="flex flex-col text-white justify-center gap-2">
                    <p>{name}</p>
                    <div className="flex flex-row gap-5">
                        <p><span className="text-gray-400">Atual: </span>R$ {price}</p>
                        <p className="text-blue-500"><span className="text-gray-400">Desejado: </span>R$  {expectPrice}</p>
                    </div>
                </div>
            </div>
            <button className="text-red-500 border border-red-500 rounded-md px-2 h-8 hover:border-red-800 hover:text-red-400">Excluir</button>
        </div>
    )
}