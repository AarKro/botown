import { dirname, importx } from "@discordx/importer";
import { createVillage } from "./client/village.js";
const run = async () => {
    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
    if (!process.env.BOT_MAP) {
        throw Error('Bot Mapping not found. Add it to your environemnt variables. BOT_MAP: {"botName": "botToken", ...}');
    }
    const botMap = JSON.parse(process.env.BOT_MAP);
    createVillage(botMap);
};
run();
//# sourceMappingURL=index.js.map