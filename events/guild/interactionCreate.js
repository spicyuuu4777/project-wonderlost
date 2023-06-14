const {
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "Total Boosters") {
      const members = await interaction.guild.members.fetch();
      const boosters = members.filter((m) => m.premiumSinceTimestamp);
      const boosterCount = boosters.size;

      if (boosterCount === 0) {
        await interaction.reply("❌ Maaf, belum ada boost di server ini!", {
          ephemeral: true,
        });
        return;
      }

      const pageSize = 10;
      const pageCount = Math.ceil(boosterCount / pageSize);
      let page = 1;

      if (interaction.isStringSelectMenu()) {
        page = parseInt(interaction.values[0]);
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, boosterCount);
      const boosterSubset = Array.from(boosters.values())
        .slice(startIndex, endIndex)
        .map(
          (member) =>
            `${member} | ${member.user.username} | ${
              member.user.id
            } | Boost at: <t:${Math.round(
              member.premiumSinceTimestamp / 1000
            )}:f>`
        )
        .join("\n");

      const totalBoosterEmbed = new EmbedBuilder()
        .setTitle(
          `All Server Boosters from ${interaction.guild.name} [${boosterCount}] - Page ${page}/${pageCount}`
        )
        .setDescription(boosterSubset)
        .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
        .setColor(interaction.guild.members.me.displayHexColor)
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        })
        .setTimestamp();

      if (pageCount > 1) {
        const pageOptions = [];
        for (let i = 1; i <= pageCount; i++) {
          pageOptions.push({ label: i.toString(), value: i.toString() });
        }

        const pageSelectMenu = new StringSelectMenuBuilder()
          .setCustomId("Total Boosters")
          .setPlaceholder("Select a page")
          .addOptions(pageOptions)
          .setMaxValues(1)
          .setMinValues(1);

        totalBoosterEmbed.setFooter({
          text: `Requested by ${interaction.user.username} | Page ${page}/${pageCount}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        });

        await interaction.reply({
          embeds: [totalBoosterEmbed],
          components: [new ActionRowBuilder().addComponents(pageSelectMenu)],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [totalBoosterEmbed],
          ephemeral: true,
        });
      }
    }
  }

  if (
    interaction.isCommand ||
    interaction.isContextMenuCommand ||
    interaction.isModalSubmit ||
    interaction.isChatInputCommand
  ) {
    if (!interaction.guild || interaction.user.bot) return;
    let subCommandName = "";
    try {
      subCommandName = interaction.options.getSubcommand();
    } catch {}
    let subCommandGroupName = "";
    try {
      subCommandGroupName = interaction.options.getSubcommandGroup();
    } catch {}
    const command = client.slash.find((command) => {
      switch (command.name.length) {
        case 1:
          return command.name[0] == interaction.commandName;
        case 2:
          return (
            command.name[0] == interaction.commandName &&
            command.name[1] == subCommandName
          );
        case 3:
          return (
            command.name[0] == interaction.commandName &&
            command.name[1] == subCommandGroupName &&
            command.name[2] == subCommandName
          );
      }
    });
    if (!command) return;

    console.log(
      chalk.yellowBright(
        `[COMMAND] ${interaction.user.tag} Used ${command.name.at(-1)} in ${
          interaction.guild.name
        } (${interaction.guild.id})`
      )
    );

    //check default permission (must need)
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.SendMessages
      )
    )
      return interaction.user.dmChannel.send(
        `Invite gw pake default perms lah aelah!`
      );
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ViewChannel
      )
    )
      return;
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.EmbedLinks
      )
    )
      return interaction.reply({
        content: `Gw gapunya perms EmbedLinks woi!`,
        ephemeral: true,
      });

    //check owner
    if (command.settings.isOwner && interaction.user.id !== client.owner) {
      return interaction.reply({
        content: `Hanya untuk owner bot`,
        ephemeral: true,
      });
    }

    const allowedUsers = ["638751724747882536"];

    if (command.settings.isMT && !allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        content: `Maaf, fitur ini sedang dalam pemeliharaan. Silahkan coba lagi nanti.`,
        ephemeral: true,
      });
    }

    if (
      command.settings.isBooster &&
      interaction.user.id !==
        interaction.guild.roles.cache.has(
          interaction.guild.roles.premiumSubscriberRole.id
        )
    ) {
      return interaction.reply({
        content: `Hanya untuk pengguna boost`,
        ephemeral: false,
      });
    }
    //check bot permissions in guild
    if (
      !interaction.guild.members.me.permissions.has(
        command.permissions.bot || []
      )
    ) {
      return interaction.reply({
        content: `Hm`,
        ephemeral: true,
      });
    }
    //check user permissions
    if (!interaction.member.permissions.has(command.permissions.user || [])) {
      return interaction.reply({
        content: `Kamu tidak punya akses untuk menggunakan command ini`,
        ephemeral: true,
      });
    }

    if (command) {
      try {
        command.run(interaction, client);
      } catch (error) {
        await interaction.reply({
          content: `${error} pukilah`,
          ephmeral: true,
        });
      }
    }
  }
};
