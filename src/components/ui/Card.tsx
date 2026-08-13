type cardProps = {
    name: string,
    price: number,
    expectPrice: number,
    status: string
}

export default function Card({ name, price, expectPrice, status }: cardProps) {
    return (
        <div>
            <div>
                {name}
            </div>
            <div>
                <p>{price}</p>
                <p>{expectPrice}</p>
                <p>{status}</p>
            </div>
        </div>
    )
}