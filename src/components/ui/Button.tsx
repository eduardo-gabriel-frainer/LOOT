import Link from "next/link"

type buttonProps = {
    name: string
    href: string
}

export default function Button({ name, href }: buttonProps){
    return (
        <Link href={href} className="p-2 hover:bg-gray-500 rounded-xl">
            {name}
        </Link>
    )
}