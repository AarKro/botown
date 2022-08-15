import { CommandInteraction } from "discord.js";
import { FlowEngine } from "./engine.js";

export const TestFlow = {
  create(interaction: CommandInteraction) {
    return FlowEngine
      .createFlow(interaction)
      .transform(transformer1)
      .logArgs()
      .validate(validator1)
      .transform(transformer2)
      .logArgs()
      .validate(validator2)
      .process(processor1);  
  }
}; 

const transformer1 = () => {
  return [1, 2, 3, 4, 5];
};

const validator1 = (interaction: CommandInteraction, numbers: number[]) => {
  return numbers.every(n => typeof n === "number");
};

const transformer2 = (interaction: CommandInteraction, numbers: number[]) => {
  return numbers.map(n => n.toString());
};

const validator2 = (interaction: CommandInteraction, strings: string[]) => {
  return strings.every(s => typeof s === "string");
};

const processor1 = (interaction: CommandInteraction, strings: string[]) => {
  interaction.reply(`an array of number strings! ${strings}`);
};