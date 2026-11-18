"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AccountFormMode = "login" | "register";

export default function AccountForm() {
    const router = useRouter();
    const [mode, setMode] = useState<AccountFormMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/auth/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data: { email?: string; error?: string } = await response.json();

            if (!response.ok || !data.email) {
                setError(data.error ?? "Não foi possível concluir a operação.");
                return;
            }

            window.localStorage.setItem("loot-email", data.email);
            window.dispatchEvent(new Event("loot-auth-change"));
            router.push("/");
        } catch {
            setError("Não foi possível conectar ao servidor. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const isRegistering = mode === "register";

    return (
        <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-xl">
            <h1 className="text-3xl font-bold">{isRegistering ? "Criar conta" : "Entrar"}</h1>
            <p className="mt-2 text-gray-400">
                {isRegistering
                    ? "Cadastre seu email para começar."
                    : "Entre para continuar usando sua conta."}
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-2 text-sm text-gray-300">
                    Email
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-300">
                    Senha
                    <input
                        type="password"
                        autoComplete={isRegistering ? "new-password" : "current-password"}
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                </label>

                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Aguarde..." : isRegistering ? "Cadastrar" : "Entrar"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
                {isRegistering ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setMode(isRegistering ? "login" : "register");
                    }}
                    className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                    {isRegistering ? "Entrar" : "Cadastre-se"}
                </button>
            </p>
            <Link href="/" className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-300">
                Voltar para o início
            </Link>
        </section>
    );
}
