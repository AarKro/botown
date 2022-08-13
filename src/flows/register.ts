import { CommandInteraction } from "discord.js";
import { Player, PlayerService } from "../database/index.js";
import { Flow } from "./index.js";
import { registerPlayer } from "./commonSteps/processors.js";

export const RegisterFlow = {
  create(event: CommandInteraction) {
    return Flow.new(event)
      .validate(playerDoesNotExist)
      .apply(registerPlayer)
      .apply(resolve);
  }
}; 

const resolve = (event: CommandInteraction) => {
  event.reply("You are now a member of the city!");
  return [];
};

const playerDoesNotExist = (event: CommandInteraction, id: string) => {
  let player: Player | undefined;
  if (id) {
    player = PlayerService.get(id);
  } else {
    player = PlayerService.get(event.user.id);
  }

  if (player) {
    event.reply("Looks like you already are a citizen here, no work to be done!");
  }

  return !player;
};