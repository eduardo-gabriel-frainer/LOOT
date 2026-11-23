type CardProps = {
    id: number
    name: string,
    price: number,
    expectPrice: number,
    img?: string,
    isDeleting: boolean,
    onDelete: () => void
}

export default function Card({
    id,
    name,
    price,
    expectPrice,
    img,
    isDeleting,
    onDelete,
}: CardProps) {
    return (
        <div className="flex justify-between p-4 items-center bg-gray-800 border rounded-xl border-gray-600" data-alert-id={id}>
            <div className="flex">
                <img
                    src={img}
                    alt={name}
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
            <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                aria-label={`Excluir alerta de ${name}`}
                className="text-red-500 border border-red-500 rounded-md px-2 h-8 hover:border-red-800 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? "Excluindo..." : "Excluir"}
            </button>
        </div>
    )
}