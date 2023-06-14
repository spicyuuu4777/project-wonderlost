const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");

const Booster = require("../../settings/models/ServerBooster");

module.exports = {
  name: ["role", "delete"],
  description: "Menghapus role.",
  category: "Utility",
  options: [
    {
      name: "role",
      description: "Pilih role yang ingin kamu hapus.",
      type: 8,
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
    const embed = new EmbedBuilder().setColor(client.color);

    const targetRole = interaction.options.getRole("role");

    if (!targetRole) {
      await interaction.reply({
        embeds: [embed.setDescription(`Role tidak ditemukan!`)],
      });
      return;
    }

    const user = interaction.member.user;

    try {
      await targetRole.delete();
      await interaction.reply({
        embeds: [
          embed.setDescription(
            `Role **\` ${targetRole.name} \`** telah dihapus oleh **${user.username}**`
          ),
        ],
      });
    } catch (error) {
      console.error("Gagal menghapus role:", error);
      await interaction.reply("Terjadi kesalahan saat menghapus role.");
    }
  },
};
