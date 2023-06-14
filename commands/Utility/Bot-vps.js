const { EmbedBuilder } = require("discord.js");
const os = require("os");
const func = require("../../utils/Functions");

module.exports = {
  name: ["bot", "vps"], // The name of the command
  description: "Display the VPS stats", // The description of the command (for help text)
  category: "Utility",
  permissions: {
    channel: [],
    bot: [],
    user: [],
  },
  settings: {
    isOwner: true,
  },
  run: async (interaction, client, user, language) => {
    await interaction.deferReply({ ephemeral: false });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Virtual Private Server [VPS]",
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setColor(client.color)
      .addFields(
        {
          name: "Host",
          value: `\`\`\`swift\n${os.type()} ${os.release()} (${os.arch()})\`\`\``,
        },
        { name: "CPU", value: `\`\`\`swift\n${os.cpus()[0].model}\`\`\`` },
        {
          name: "CPU Load",
          value: `\`\`\`swift\n${os.loadavg()[0].toFixed(2)}%\`\`\``,
          inline: true,
        },
        {
          name: "Total RAM",
          value: `\`\`\`swift\n${(os.totalmem() / 1024 / 1024 / 1024).toFixed(
            2
          )} GB\`\`\``,
          inline: true,
        },
        {
          name: "Memory Usage",
          value: `\`\`\`swift\n${(
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(2)} MB\`\`\``,
          inline: true,
        },
        {
          name: "CPU Cores",
          value: `\`\`\`swift\n${os.cpus().length}\`\`\``,
          inline: true,
        },
        {
          name: "Uptime",
          value: `${func.timestamp(client.readyTimestamp)}`,
          inline: true,
        }
      )
      .setFooter({ text: `Node.js ${process.version}` })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};
