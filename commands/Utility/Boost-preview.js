const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  name: ["boost", "preview"],
  description: "Preview boost UI.",
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
    const boostAnnounceEmbed = new EmbedBuilder()
      .setAuthor({
        name: `spicyuuu`,
        iconURL: interaction.guild.iconURL({ size: 1024 }),
      })
      .setDescription(
        `**Wonderlost** sekarang memiliki **999** boosts!\nBoost: **Level 3**\n\nTerima kasih telah ngeboost server.\nNikmati keuntungan server boost mu!`
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setImage("https://cdn131.picsart.com/332076882062211.png")
      .setColor("F47FFF")
      .setFooter({
        text: `Wonderlost Boost Detection System`,
        iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
      })
      .setTimestamp();
    const boostAnnounceRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()

        .setLabel("Total Boosters")
        // .setEmoji("988797857907769374")
        .setCustomId("Total Boosters")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel(`${interaction.user.tag}`)
        // .setEmoji("899583101796253706")
        .setCustomId("BoostDetection")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    const msg = await interaction.reply({
      content: `<@${interaction.user.id}> **ID User: \` 999999999999999 \`**`,
      embeds: [boostAnnounceEmbed],
    });
  },
};
