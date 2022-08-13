import { CommandInteraction } from "discord.js";
import { PlayerService } from "../../database/index.js";

export const registerPlayer = (event: CommandInteraction) => {
  PlayerService.create({id: event.user.id});
  return [];
};