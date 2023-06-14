const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  name: ["boost", "checker"],
  description: "Memeriksa berapa kali user ngeboost server.",
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
    const targetUser = interaction.options.getUser("user");
    // Dapatkan daftar server yang telah di-boost oleh pengguna menggunakan interaction.client.guilds.cache
    const boostedServers = interaction.client.guilds.cache.filter(
      (guild) => guild.premiumSubscriptionCount > 0
    );

    // Dapatkan daftar server di mana pengguna atau pengguna yang dimasukkan merupakan booster
    const userBoostedServers = boostedServers.filter(
      (guild) => guild.members.cache.get(targetUser.id)?.premiumSince !== null
    );

    // Dapatkan jumlah boost yang dilakukan oleh pengguna atau pengguna yang dimasukkan
    const boostCount = userBoostedServers.size;

    // Berikan tanggapan ke pengguna dengan jumlah boost yang dilakukan
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `${targetUser.username} telah melakukan boost sebanyak ${boostCount} kali.`
          ),
      ],
    });
  },
};
