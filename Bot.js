const { Client, GatewayIntentBits, Collection } = require("discord.js");

class MainClient extends Client {
  constructor() {
    super({
      shards: "auto",
      allowedMentions: { parse: ["users", "roles"] },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
      ],
    });

    this.config = require("./settings/config.js");
    this.button = require("./settings/button.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    if (!this.token) this.token = this.config.TOKEN;

    process.on("unhandledRejection", (error) => console.log(error));
    process.on("uncaughtException", (error) => console.log(error));

    const client = this;

    ["slash"].forEach((x) => (client[x] = new Collection()));
    ["loadCommand", "loadEvent", "loadDatabase"].forEach((x) =>
      require(`./handlers/${x}`)(client)
    );
  }
  connect() {
    return super.login(this.token);
  }
}

module.exports = MainClient;
