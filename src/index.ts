import { dirname, importx } from "@discordx/importer";
import { createVillage } from "./client/village.js";

export interface BotMap {
  [k: string]: string; // bot name: bot token
}

export enum Bots {
  BANK = "Bank",
  BUILDER = "Builder",
  CITY_ADMINISTRATION = "City Administration",
}

const run = async () => {
  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");

  if (!process.env.BOT_MAP) {
    throw Error('Bot Mapping not found. Add it to your environemnt variables. BOT_MAP: {"botName": "botToken", ...}');
  }

  const botMap: BotMap = JSON.parse(process.env.BOT_MAP);

  const providedBotIds = Object.keys(botMap);
  const configuredBotIds = Object.values(Bots);
  if (configuredBotIds.some(id => !providedBotIds.includes(id))) {
    const notProvided = configuredBotIds.filter(id => !providedBotIds.includes(id));
    throw Error(`Configured bot ids not provided (${notProvided})`);
  }

  createVillage(botMap);
};

run();