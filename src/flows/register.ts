import { CommandInteraction } from "discord.js";
import { PlayerService } from "../database/index.js";
import { FlowEngine } from "./engine.js";

export const RegisterFlow = {
  create(interaction: CommandInteraction) {
    return FlowEngine
      .createFlow("register", interaction)
      .validate(validator => validator
        .check(doesPlayerExist)
        .not()
        .onValid(registerPlayer)
        .onInvalid(playerAlreadyExists))
      .process(resolve);
  }
}; 

const doesPlayerExist = (interaction: CommandInteraction) => {
  const player = PlayerService.get(interaction.user.id);
  return Boolean(player);
};

const playerAlreadyExists = (interaction: CommandInteraction) => {
  interaction.reply("Looks like you already are a citizen here, no work to be done!");
};

const registerPlayer = (interaction: CommandInteraction) => {
  PlayerService.create({id: interaction.user.id});
};

const resolve = (interaction: CommandInteraction) => {
  interaction.reply("You are now a member of the city!");
};
