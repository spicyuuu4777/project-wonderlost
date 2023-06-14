const { EmbedBuilder } = require("discord.js");
const RestartChannel = require("../../settings/models/RestartChannel");

module.exports = {
  name: ["bot", "reboot"],
  description: "Merestart ulang bot.",
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
    await interaction.deferReply({ ephemeral: false });

    const embed = new EmbedBuilder()
      .setDescription(`<a:logodcgif:1105861366818029619> Bot sedang reboot..`)
      .setColor(client.color);

    await interaction.editReply({ embeds: [embed] });
    const restartChannel = new RestartChannel({
      channelId: interaction.channel.id,
    });

    await restartChannel.save();
    process.exit();
  },
};
