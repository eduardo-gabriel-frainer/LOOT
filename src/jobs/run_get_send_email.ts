import { handler } from "./get_send_email";

handler().catch((error: unknown) => {
    console.error("Erro ao verificar alertas e enviar emails:", error);
    process.exitCode = 1;
});
