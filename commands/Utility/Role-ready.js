const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");

const Booster = require("../../settings/models/ServerBooster");

module.exports = {
  name: ["role", "ready"],
  description: "Input user yang sudah membuat custom role ke database.",
  category: "Utility",
  options: [
    {
      name: "user",
      description: "Pilih user yang ingin diperiksa",
      type: 6,
      required: true,
    },
  ],
  permissions: {
    channel: [],
    bot: [],
    user: ["ManageGuild"],
  },
  settings: {
    isOwner: false,
  },
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: false });
    const targetUser = interaction.options.getUser("user");

    let userReady = await Booster.findOne({ userId: targetUser.id });

    const embed = new EmbedBuilder().setColor(client.color);
    // Jika user sudah ada di database
    if (userReady) {
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            `<a:no1:1105770830589329438> <@${targetUser.id}> gagal terdaftar ke database, karena udah ada!`
          ),
        ],
      });
    } else {
      // Jika pengguna booster tidak ditemukan, buat entri baru dalam database
      const newBooster = new Booster({
        userId: targetUser.id,
        userUsername: targetUser.username,
        boostCount: 1,
      });
      await newBooster.save();
    }

    await interaction.editReply({
      embeds: [
        embed.setDescription(
          `<a:centang2:1105511424832315452> <@${targetUser.id}> berhasil terdaftar ke database.`
        ),
      ],
    });
  },
};
