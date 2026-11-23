"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

type AlertItem = {
    id: number;
    name: string;
    img: string;
    currentPrice: number | string;
    targetPrice: number | string;
};

type AlertListResponse = {
    alertas: AlertItem[];
    total: number;
};

export default function AlertList() {
    const [alertas, setAlertas] = useState<AlertItem[]>([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUserId = window.localStorage.getItem("loot-user-id");
        const parsedUserId = storedUserId === null ? NaN : Number(storedUserId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            setIsLoading(false);
            return;
        }

        setUserId(parsedUserId);
        const controller = new AbortController();

        async function loadAlertas() {
            try {
                const response = await fetch(
                    `/api/alertas?userId=${parsedUserId}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(`Falha ao carregar alertas (${response.status}).`);
                }

                const data: AlertListResponse = await response.json();
                setAlertas(data.alertas);
                setTotal(data.total);
            } catch (loadError) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error("Falha ao carregar alertas", loadError);
                setError("Não foi possível carregar seus alertas. Tente novamente.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadAlertas();

        return () => controller.abort();
    }, []);

    async function handleDelete(alerta: AlertItem) {
        if (userId === null) {
            setError("Entre na sua conta para excluir um alerta.");
            return;
        }

        if (!window.confirm(`Deseja excluir o alerta de "${alerta.name}"?`)) {
            return;
        }

        setError("");
        setDeletingId(alerta.id);

        try {
            const response = await fetch("/api/alertas", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: alerta.id, userId }),
            });

            if (response.status === 404) {
                setError("Alerta não encontrado para sua conta.");
                return;
            }

            if (!response.ok) {
                throw new Error(`Falha ao excluir alerta (${response.status}).`);
            }

            setAlertas((currentAlertas) =>
                currentAlertas.filter((currentAlerta) => currentAlerta.id !== alerta.id)
            );
            setTotal((currentTotal) => Math.max(0, currentTotal - 1));
        } catch (deleteError) {
            console.error("Falha ao excluir alerta", deleteError);
            setError("Não foi possível excluir o alerta. Tente novamente.");
        } finally {
            setDeletingId(null);
        }
    }

    if (isLoading) {
        return <p className="mt-5 text-gray-300">Carregando alertas...</p>;
    }

    if (userId === null) {
        return <p className="mt-5 text-gray-300">Entre na sua conta para ver seus alertas.</p>;
    }

    const totalText = total === 1 ? "1 Alerta ativo" : `${total} Alertas ativos`;

    return (
        <>
            <p>{totalText}</p>

            {error && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                    {error}
                </p>
            )}

            {total === 0 ? (
                <div className="flex justify-center">
                    <p className="mt-50 text-2xl">Nenhum alerta cadastrado</p>
                </div>
            ) : (
                <div className="mt-5 flex flex-col gap-5">
                    {alertas.map((alerta) => (
                        <Card
                            key={alerta.id}
                            id={alerta.id}
                            name={alerta.name}
                            price={Number(alerta.currentPrice)}
                            expectPrice={Number(alerta.targetPrice)}
                            img={alerta.img}
                            isDeleting={deletingId === alerta.id}
                            onDelete={() => void handleDelete(alerta)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
