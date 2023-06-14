const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  name: ["test"],
  description: "test",
  category: "Utility",
  permissions: {
    channel: [],
    bot: [],
    user: [],
  },
  settings: {
    isOwner: true,
  },
  run: async (interaction, client) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()

        .setLabel("Total Boosters")
        // .setEmoji("988797857907769374")
        .setCustomId("Total Boosters")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder().setDescription(`TESTING MODE!`);

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
