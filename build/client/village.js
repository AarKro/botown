import { createClient } from "./client.js";
export const createVillage = async (botMap) => {
    // create client for every bot
    const clients = Object.keys(botMap).map(key => createClient(key));
    // log in all the bots
    await Promise.all(clients.map(client => client.login(botMap[client.botId])));
    console.log("everyone is logged in");
    console.log(`( ${clients.map(client => `"${client.botId}" `)})`);
};
//# sourceMappingURL=village.js.map