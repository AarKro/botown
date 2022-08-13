import { CommandInteraction } from "discord.js";
import { Flow } from "./index.js";

export const TestFlow = {
  create(event: CommandInteraction) {
    return Flow.new(event)
      .apply(processor1)
      .apply(processor2)
      .apply(processor3)
      .apply(processor4)
      .apply(processor5);
  }
}; 

const processor1 = () => {
  return [{}];
};
const processor2 = (event: CommandInteraction, arg: any) => {
  arg.one = 1;
  return [arg];
};
const processor3 = (event: CommandInteraction, arg: any) => {
  arg.two = 2;
  return [arg];
};
const processor4 = (event: CommandInteraction, arg: any) => {
  arg.three = 3;
  return [arg];
};
const processor5 = (event: CommandInteraction, arg: any) => {
  event.reply(JSON.stringify(arg));
  return [];
};