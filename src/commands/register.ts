import { Bot, Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";
import { Bots } from "../index.js";
import { RegisterFlow } from "../flows/register.js";


@Discord()
@Bot(Bots.CITY_ADMINISTRATION)
class Register {
  
  @Slash("register")
  register(interaction: CommandInteraction) {
    RegisterFlow
      .create(interaction)
      .execute();
  }
}

