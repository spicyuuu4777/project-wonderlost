const { EmbedBuilder } = require("discord.js");
const { MEMBER_JOINEDCH } = require("../../settings/config");

module.exports = async (client, newMember) => {
  const channelID = client.channels.cache.get(MEMBER_JOINEDCH);
  let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

  const content = `<@${newMember.id}> <a:WL_Welcome:1114158616749031485>`;
  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({
      name: `${newMember.user.tag}`,
      // iconURL: newMember.iconURL({ dynamic: true }),
    })
    .setThumbnail(newMember.user.displayAvatarURL())
    .setDescription(
      `<:WL_wlee:1113079709551562803> Halo **${
        newMember.user.username
      }**, welcome to **${
        newMember.guild.name
      }**.\nJangan lupa buat cek channel dibawah ini ya <:WL_please:1113079576827006977>\n<#1110599795455819837> & <#1110600054349254787>\n\nSekarang **${newMember.guild.name.toLowerCase()}** memiliki **${
        newMember.guild.memberCount || newMember.guild.members.size
      }** members.\n<a:logodcgif2:1105861572162748537> **\` ${
        newMember.guild.members.cache.filter((m) => !m.user.bot).size
      } Manusia \`** | **\` ${
        newMember.guild.members.cache.filter((m) => m.user.bot).size
      } Robot \`**`
    )
    .setImage(
      `https://media.discordapp.net/attachments/1093560358876237946/1115437321391710279/standard.gif`
    )
    .setFooter({
      text: `Terima kasih ${newMember.user.username} 💖`,
      iconURL: newMember.guild.iconURL({ dynamic: true }),
    })
    .setTimestamp();

  await client.user.setPresence({
    activities: [
      {
        name: `with ${members} members`,
        type: 0,
      },
    ],
    status: "online",
  });
  return channelID.send({ content, embeds: [embed] });
};
