import { CommandInteraction } from "discord.js";
import { Player, PlayerService } from "../database/index.js";
import { FlowEngine } from "./engine.js";

export const RegisterFlow = {
  create(interaction: CommandInteraction) {
    return FlowEngine
      .createFlow(interaction)
      .validate(playerDoesNotExist)
      .process(registerPlayer)
      .process(resolve);
  }
}; 

const playerDoesNotExist = (interaction: CommandInteraction, id: string) => {
  let player: Player | undefined;
  if (id) {
    player = PlayerService.get(id);
  } else {
    player = PlayerService.get(interaction.user.id);
  }

  if (player) {
    interaction.reply("Looks like you already are a citizen here, no work to be done!");
  }

  return !player;
};

const registerPlayer = (interaction: CommandInteraction) => {
  PlayerService.create({id: interaction.user.id});
};

const resolve = (interaction: CommandInteraction) => {
  interaction.reply("You are now a member of the city!");
};
