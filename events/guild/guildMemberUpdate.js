const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const Booster = require("../../settings/models/ServerBooster");

const {
  BOOST_CHANNELID,
  BOOST_LOGCHANNELID,
} = require("../../settings/config");

module.exports = async (client, oldMember, newMember) => {
  // All Definitions
  let booster = await Booster.findOne({ userId: newMember.id });

  const boostAnnounceChannel = client.channels.cache.get(BOOST_CHANNELID);
  const boostAnnouceLogChannel = client.channels.cache.get(BOOST_LOGCHANNELID);

  const format = {
    0: "No Level",
    1: "Level 1",
    2: "Level 2",
    3: "Level 3",
  };

  const boostLevel = format[newMember.guild.premiumTier];

  const totalBoosterRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()

      .setLabel("Total Boosters")
      // .setEmoji("988797857907769374")
      .setCustomId("Total Boosters")
      .setStyle(ButtonStyle.Primary)
  );

  // Trigger when member Boost the server and received the Nitro Boost Role

  if (!oldMember.roles.cache.size !== newMember.roles.cache.size) {
    if (
      !oldMember.roles.cache.has(
        newMember.guild.roles.premiumSubscriberRole?.id
      ) &&
      newMember.roles.cache.has(newMember.guild.roles.premiumSubscriberRole?.id)
    ) {
      const boostAnnounceEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${newMember.user.username}`,
          iconURL: newMember.guild.iconURL({ size: 1024 }),
        })
        .setDescription(
          `**${newMember.guild.name}** sekarang memiliki **${newMember.guild.premiumSubscriptionCount}** boosts!\nBoost Level: **${boostLevel}**\n\nTerima kasih telah ngeboost server.\nNikmati keuntungan server boost mu!`
        )
        .setThumbnail(newMember.user.displayAvatarURL())
        .setImage("https://cdn131.picsart.com/332076882062211.png")
        .setColor("F47FFF")
        .setFooter({
          text: `${newMember.guild.name} Boost Detection System`,
          iconURL: newMember.user.displayAvatarURL({ size: 1024 }),
        })
        .setTimestamp();
      const boostAnnounceRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()

          .setLabel("Total Boosters")
          // .setEmoji("988797857907769374")
          .setCustomId("Total Boosters")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setLabel(`${newMember.user.tag}`)
          // .setEmoji("899583101796253706")
          .setCustomId("BoostDetection")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

      const msg = await boostAnnounceChannel.send({
        content: `${newMember} **ID User: \` ${newMember.user.id} \`**`,
        embeds: [boostAnnounceEmbed],
      });
      msg.react("🎉");

      //Send DM to NEW Nitro Booster
      try {
        await newMember.send({
          content: `Halo sultan **${newMember.user.username}**, terima kasih telah memberikan boost pada server **${newMember.guild.name}**.\nSo Enjoy Your **${newMember.guild.roles.premiumSubscriberRole.name}** Role And role kustom di server kami🎉`,
        });
      } catch (error) {
        await console.log(
          `Gagal mengirim pesan DM ke ${newMember.user.username}`
        );
      }

      //Boost Announce Log System
      const boostLogEmbed = new EmbedBuilder()
        .setAuthor({
          name: `NEW Boost Detection System`,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "💎 Nitro Booster",
            value: `${newMember.user} | ${newMember.user.tag}`,
          },
          {
            name: "🎉 Server Boost at:",
            value: `<t:${Math.round(
              newMember.premiumSinceTimestamp / 1000
            )}:f> | <t:${Math.round(
              newMember.premiumSinceTimestamp / 1000
            )}:R>`,
            inline: false,
          },
          {
            name: "⏰ Account Created at:",
            value: `<t:${Math.round(
              newMember.user.createdTimestamp / 1000
            )}:f>\n<t:${Math.round(newMember.user.createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: "📆 Joined Server at:",
            value: `<t:${Math.round(
              newMember.joinedTimestamp / 1000
            )}:f>\n<t:${Math.round(newMember.joinedTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: "💜 Total Boost",
            value: `${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
            inline: false,
          },
          {
            name: "✅ Assigned Role:",
            value: `${newMember.guild.roles.premiumSubscriberRole} | ${newMember.guild.roles.premiumSubscriberRole.name} | ${newMember.guild.roles.premiumSubscriberRole.id}`,
            inline: false,
          }
        )
        .setThumbnail(newMember.user.displayAvatarURL({ size: 1024 }))
        .setColor(newMember.guild.members.me.displayHexColor)
        .setFooter({
          text: `ID: ${newMember.user.id} (All Action Were Passed)`,
          iconURL: newMember.guild.iconURL({ size: 1024 }),
        })
        .setTimestamp();
      const boostLogMessage = await boostAnnouceLogChannel.send({
        embeds: [boostLogEmbed],
        components: [totalBoosterRow],
      });

      //Pin the Embed Message that send in Log channel
      boostLogMessage.pin();

      if (booster) {
        // Jika pengguna booster ditemukan, tambahkan 1 ke boostLimit
        booster.boostLimit += 1;
      } else {
        // Jika pengguna booster tidak ditemukan, buat entri baru dalam database
        const newBooster = new Booster({
          userId: newMember.id,
          userUsername: newMember.username,
          boostLimit: 1,
        });
        booster = await newBooster.save();
      }
      await booster.save();
    }
  }
  // Trigger Ketika user mencabut boost atau Role boost dihapus.
  if (
    oldMember.roles.cache.has(
      oldMember.guild.roles.premiumSubscriberRole?.id
    ) &&
    !newMember.roles.cache.has(oldMember.guild.roles.premiumSubscriberRole?.id)
  ) {
    const unboostEmbedLog = new EmbedBuilder()
      .setAuthor({
        name: `NEW UnBoost or Expired Detection System`,
        iconURL: client.user.displayAvatarURL(),
      })

      .addFields(
        {
          name: "📌 UnBooster:",
          value: `${oldMember.user} | ${oldMember.user.tag}`,
        },
        {
          name: "⏰ Account Created at:",
          value: `<t:${Math.round(
            oldMember.user.createdTimestamp / 1000
          )}:f>\n<t:${Math.round(oldMember.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "📆 Joined Server at:",
          value: `<t:${Math.round(
            oldMember.joinedTimestamp / 1000
          )}:f>\n<t:${Math.round(oldMember.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },

        {
          name: "💜 Total Boost:",
          value: `${oldMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
          inline: false,
        },

        {
          name: "❌ Removed Role:",
          value: `${oldMember.guild.roles.premiumSubscriberRole} | ${oldMember.guild.roles.premiumSubscriberRole.name} | ${oldMember.guild.roles.premiumSubscriberRole.id}`,
          inline: false,
        }
      )
      .setThumbnail(oldMember.user.displayAvatarURL({ size: 1024 }))
      .setColor(oldMember.guild.members.me.displayHexColor)
      .setFooter({
        text: `ID: ${oldMember.user.id}`,
        iconURL: oldMember.guild.iconURL({ size: 1024 }),
      })
      .setTimestamp();
    const unboostLogMessage = await boostAnnouceLogChannel.send({
      embeds: [unboostEmbedLog],
      components: [totalBoosterRow],
    });

    unboostLogMessage.pin();

    // Mengirim pesan DM ke user yang Unboost server.
    try {
      await oldMember.send({
        content: `> **\` Message Form Boost Detection System \`**\n\n> Halo ${oldMember.user.tag}, sayangnya nitro boost kamu pada server **__${oldMember.guild.name}__** telah expired/habis dan kamu kehilangan role **${oldMember.guild.roles.premiumSubscriberRole.name}** dan fitur spesial lainnya :'(\n\n> 🎉Untuk mendapatkannya kembali, silahkan boost server kami lagi!`,
        components: [totalBoosterRow],
      });
    } catch (error) {
      await console.log(
        `Gagal mengirim pesan DM ke ${oldMember.user.username}`
      );
      return;
    }
  }
};

// Coded by spicyuuu#4777
