import { Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";
import { TestFlow } from "../flows/test.js";


@Discord()
class Test {
  
  @Slash("test")
  test(interaction: CommandInteraction) {
    TestFlow
      .create(interaction)
      .execute();
  }
}

