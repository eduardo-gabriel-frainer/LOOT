
async function main() {
    try {

        const apiKey = process.env.STEAM_API_KEY;

        if (!apiKey) {
            throw new Error("STEAM_API_KEY não foi configurada");
        }

        const API_STEAM = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&max_results=5`;

        const response = await fetch(API_STEAM)

        if (!response.ok) {
            throw new Error(
                `Steam retornou ${response.status}`
            )
        }

        const data = await response.json()

        console.log(JSON.stringify(data, null, 2));
        
    } catch (e) {
        throw new Error(
            `Deu ruim na função de pegar os jogos ${e}`
        )
    }
}

main()