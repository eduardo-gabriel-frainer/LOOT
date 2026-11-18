"use client";

import Button from "./ui/Button";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const syncEmail = () => setEmail(window.localStorage.getItem("loot-email"));

        syncEmail();
        window.addEventListener("loot-auth-change", syncEmail);
        return () => window.removeEventListener("loot-auth-change", syncEmail);
    }, []);

    function handleLogout() {
        window.localStorage.removeItem("loot-email");
        window.dispatchEvent(new Event("loot-auth-change"));
    }

    return (
        <header className="flex items-center justify-between border-b border-gray-600 p-2 text-gray-300">
            <Link href="/" className="ml-10">
                <img src="/images/1.png" className="w-30" alt="LOOT" />
            </Link>
            <nav className="flex gap-5">
                <Button name="Início" href="/" />
                <Button name="Meus alertas" href="/alertas" />
            </nav>
            <div className="mr-10 flex items-center gap-2 rounded-xl p-2">
                <User size={20} />
                {email ? (
                    <>
                        <span className="max-w-40 truncate">{email}</span>
                        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">
                            Sair
                        </button>
                    </>
                ) : (
                    <Link href="/conta" className="hover:text-white">Conta</Link>
                )}
            </div>
        </header>
    );
}
