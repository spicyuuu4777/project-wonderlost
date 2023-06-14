const { EmbedBuilder } = require("discord.js");
const { green, white } = require("chalk");
const func = require("../../utils/Functions");
const RestartChannel = require("../../settings/models/RestartChannel");

module.exports = async (client) => {
  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green(`${client.user.tag} (${client.user.id})`) +
      white(` is Ready!`)
  );

  const restartEmbed = new EmbedBuilder()
    .setDescription(
      `<a:centang1:1105393147695087657> Bot telah menyala kembali.\n${func.timestamp(
        client.readyTimestamp
      )}`
    )
    .setColor(client.color);

  const restartChannel = await RestartChannel.findOne();

  if (restartChannel) {
    const targetChannelId = restartChannel.channelId;
    const targetChannel = client.channels.cache.get(targetChannelId);
    if (!targetChannel) return;
    if (targetChannel) {
      targetChannel.send({ embeds: [restartEmbed] });
    }

    await RestartChannel.deleteOne({ _id: restartChannel._id });
  }

  let guilds = client.guilds.cache.size;
  let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
  let channels = client.channels.cache.size;

  const activities = [
    `/premium setup | ${guilds} servers`,
    `/play <input> | ${members} users`,
    `/filter doubletime | ${channels} channels`,
  ];

  // setInterval(() => {
  client.user.setPresence({
    activities: [
      {
        name: `In Development`,
        type: 0,
      },
    ],
    status: "dnd",
  });
  // }, 15000);
};
