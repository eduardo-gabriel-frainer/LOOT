import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

type SteamGameData = {
    name: string;
    is_free: boolean;
    price_overview?: {
        final: number;
        final_formatted: string;
    } | null;
};

type SteamResponse = Record<string, {
    success: boolean;
    data?: SteamGameData;
}>;

async function getPendingAlertas() {
    return prisma.alertas.findMany({
        where: { notifiedAt: null },
        include: { user: { select: { email: true } } },
    });
}

type Alerta = Awaited<ReturnType<typeof getPendingAlertas>>[number];

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}

async function getGameData(appid: number) {
    let response: Response;

    try {
        response = await fetch(
            `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=br&l=portuguese`
        );
    } catch (error) {
        const cause = error instanceof Error ? error.cause : undefined;

        console.error("Falha ao consultar a API da Steam", {
            appid,
            message: error instanceof Error ? error.message : String(error),
            cause: cause instanceof Error
                ? {
                    name: cause.name,
                    message: cause.message,
                    code: "code" in cause ? cause.code : undefined,
                }
                : cause,
        });

        throw error;
    }

    if (!response.ok) {
        throw new Error(`Erro ao buscar o jogo ${appid}: ${response.status}`);
    }

    const data: SteamResponse = await response.json();
    const gameResponse = data[String(appid)];
    const game = gameResponse?.data;

    if (!gameResponse?.success || !game) {
        throw new Error(`A Steam não retornou dados para o jogo ${appid}`);
    }

    if (game.is_free) {
        return { name: game.name, currentPrice: 0, formattedPrice: "Grátis" };
    }

    if (game.price_overview == null) {
        return { name: game.name, currentPrice: null, formattedPrice: null };
    }

    return {
        name: game.name,
        currentPrice: game.price_overview.final / 100,
        formattedPrice: game.price_overview.final_formatted,
    };
}

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;
let mailFrom: string | undefined;

function getMailer() {
    if (!transporter || !mailFrom) {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const user = process.env.SMTP_USER;
        const password = process.env.SMTP_PASSWORD;
        mailFrom = process.env.SMTP_FROM;

        if (!host || !Number.isInteger(port) || !user || !password || !mailFrom) {
            throw new Error(
                "Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD e SMTP_FROM no .env"
            );
        }

        transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass: password },
        });
    }

    return { transporter, from: mailFrom };
}

async function processAlert(alerta: Alerta) {
    if (!alerta.user?.email) {
        console.warn(`Alerta ${alerta.id} sem usuário associado; email não enviado.`);
        return;
    }

    const game = await getGameData(alerta.appid);

    if (game.currentPrice === null) {
        console.warn(`Preço indisponível para ${game.name}; alerta ${alerta.id} ignorado.`);
        return;
    }

    const targetPrice = Number(alerta.targetPrice);

    if (game.currentPrice > targetPrice) {
        await prisma.alertas.update({
            where: { id: alerta.id },
            data: { currentPrice: game.currentPrice },
        });
        console.log(
            `${game.name}: ${game.formattedPrice}, acima do preço desejado de R$ ${targetPrice.toFixed(2)}.`
        );
        return;
    }

    const { transporter: mailer, from } = getMailer();
    const targetPriceFormatted = targetPrice.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const steamUrl = `https://store.steampowered.com/app/${alerta.appid}/`;
    const text = [
        `Boa notícia! ${game.name} chegou ao preço desejado.`,
        `Preço atual: ${game.formattedPrice}.`,
        `Seu limite: ${targetPriceFormatted}.`,
        `Ver jogo na Steam: ${steamUrl}`,
        "",
        "LOOT — alertas de preço de jogos",
    ].join("\n");
    const html = `
        <div style="margin:0;padding:32px 12px;background-color:#0f172a;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;margin:0 auto;border:1px solid #334155;border-radius:16px;background-color:#111827;overflow:hidden;">
                <tr>
                    <td style="padding:24px 32px;background-color:#0891b2;">
                        <div style="font-size:13px;font-weight:bold;letter-spacing:3px;color:#ecfeff;">LOOT</div>
                        <div style="margin-top:8px;font-size:23px;font-weight:bold;color:#ffffff;">O preço baixou!</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:30px 32px;">
                        <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;">Um jogo da sua lista chegou ao preço desejado.</p>
                        <h1 style="margin:0 0 24px;color:#ffffff;font-size:24px;line-height:1.3;">${escapeHtml(game.name)}</h1>
                        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="padding:14px 0;border-bottom:1px solid #334155;color:#94a3b8;font-size:14px;">Preço atual</td>
                                <td style="padding:14px 0;border-bottom:1px solid #334155;color:#67e8f9;font-size:20px;font-weight:bold;text-align:right;">${escapeHtml(game.formattedPrice ?? "")}</td>
                            </tr>
                            <tr>
                                <td style="padding:14px 0;color:#94a3b8;font-size:14px;">Seu limite</td>
                                <td style="padding:14px 0;color:#e2e8f0;font-size:16px;font-weight:bold;text-align:right;">${escapeHtml(targetPriceFormatted)}</td>
                            </tr>
                        </table>
                        <div style="margin-top:28px;text-align:center;">
                            <a href="${steamUrl}" style="display:inline-block;padding:13px 24px;border-radius:8px;background-color:#0891b2;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Ver na Steam</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:18px 32px;border-top:1px solid #334155;color:#64748b;font-size:12px;text-align:center;">
                        Você recebeu este email porque criou um alerta de preço no LOOT.
                    </td>
                </tr>
            </table>
        </div>
    `;

    const sendResult = await mailer.sendMail({
        from,
        to: alerta.user.email,
        subject: `${game.name} chegou ao preço desejado!`,
        text,
        html,
    });

    const acceptedRecipients = sendResult.accepted.map((recipient: string | { address: string }) =>
        typeof recipient === "string" ? recipient : recipient.address
    );

    if (!acceptedRecipients.some(
        (recipient: string) => recipient.toLowerCase() === alerta.user?.email.toLowerCase()
    )) {
        throw new Error(
            `O servidor SMTP não aceitou o destinatário do alerta ${alerta.id}.`
        );
    }

    await prisma.alertas.update({
        where: { id: alerta.id },
        data: {
            currentPrice: game.currentPrice,
            notifiedAt: new Date(),
        },
    });

    console.log(
        `SMTP aceitou o email do alerta ${alerta.id} para ${alerta.user.email} (messageId: ${sendResult.messageId}).`
    );
}

export async function handler() {
    const alertas = await getPendingAlertas();

    for (const alerta of alertas) {
        await processAlert(alerta);
    }

    return { checkedAlerts: alertas.length };
}
