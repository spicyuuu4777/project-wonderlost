const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  name: ["bot", "ping"],
  description: "Periksa ping bot",
  category: "Utility",
  permissions: {
    channel: [],
    bot: [],
    user: [],
  },
  settings: {
    isOwner: false,
  },
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: false });
    const embed = new EmbedBuilder().setColor(client.color);
    interaction.editReply({
      embeds: [
        embed.setDescription(
          `Websocket ping: **\` ${client.ws.ping}ms \`**\nWebsocket status: **\` ${client.ws.status} \`**`
        ),
      ],
    });
  },
};
