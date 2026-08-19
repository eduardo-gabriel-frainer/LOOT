'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

type buttonProps = {
    name: string
    href: string
}

export default function Button({ name, href }: buttonProps) {
    const pathname = usePathname();

    const pathnameClean = pathname.replace('/', '')
    const hrefClean = href.replace('/', '')

    const selected = pathnameClean === hrefClean
    return (
        <Link
            href={href}
            className={`py-2 px-4 rounded-xl ${selected ? 'bg-blue-900/30  text-blue-500' : 'hover:bg-blue-900/30 text-gray-400' }`}
        >
            {name}
        </Link>
    )
}