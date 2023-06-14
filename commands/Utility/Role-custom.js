const { EmbedBuilder } = require("discord.js");
const func = require("../../utils/Functions");
const { POSITION_ROLE } = require("../../settings/config");
const Booster = require("../../settings/models/ServerBooster");

module.exports = {
  name: ["role", "kustom"],
  description: "Membuat custom role untuk booster",
  category: "Utility",
  options: [
    {
      name: "nama",
      description:
        "Isi nama role yang diinginkan (Note: Tidak lebih dari 8 karakter ya).",
      type: 3,
      required: true,
    },
    {
      name: "warna",
      description: "Warna role apa yang kamu inginkan?",
      type: 3,
      required: false,
      choices: [
        { name: "Merah", value: "#FF0000" },
        { name: "Hijau", value: "#00FF00" },
        { name: "Biru", value: "#0000FF" },
        { name: "Kuning", value: "#FFFF00" },
        { name: "Ungu", value: "#800080" },
        { name: "Hitam", value: "#000001" },
      ],
    },
    {
      name: "icon",
      description:
        "Inputkan icon yang kamu inginkan (Note: harus berupa file berformat .jpg dan .png)",
      type: 11,
      required: false,
    },
  ],
  permissions: {
    channel: [],
    bot: [],
    user: [],
  },
  settings: {
    isOwner: false,
    isMT: false,
    isBooster: false,
  },
  run: async (interaction, client) => {
    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (member.premiumSinceTimestamp || member.id === `638751724747882536`) {
      // Jadikan variable yang di input user.
      const option1 = interaction.options.get(`nama`).value;
      const option2 = interaction.options.get(`warna`)?.value;
      const option3 = interaction.options.get(`icon`)?.attachment.url;
      // END

      // Cek jumlah "boosts" pada server
      const serverBoosts = interaction.guild.premiumSubscriptionCount;
      const allowedExtensions = [".jpg", ".png"];
      // Jika user mengisi nama lebih dari 8 karakter, yang dikirim user bukan file berformat .jpg dan .png, atau server tidak memiliki cukup "boosts"
      if (
        option1.length > 12 ||
        (option3 &&
          !allowedExtensions.includes(
            option3.substring(option3.lastIndexOf("."))
          )) ||
        (option3 && option3.size > 500000) // Tambahkan kondisi untuk ukuran file lebih dari 500KB
      ) {
        let errorDescription = "";
        if (option1.length > 12) {
          errorDescription =
            "<a:warn2:1105775326031777853> Nama role tidak boleh lebih dari 12 karakter!\n ";
        }
        if (
          option3 &&
          !allowedExtensions.includes(
            option3.substring(option3.lastIndexOf("."))
          )
        ) {
          errorDescription +=
            "<a:warn2:1105775326031777853> Hanya file .jpg atau .png yang diperbolehkan!\n ";
        }
        if (option3 && option3.size > 500000) {
          errorDescription +=
            "<a:warn2:1105775326031777853> Ukuran file tidak boleh melebihi 500KB!";
        }

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(errorDescription),
          ],
        });
      }

      // Balas langsung
      await interaction.deferReply({ ephemeral: false });

      // || member.id === `638751724747882536`
      // Mencari pengguna booster dalam database
      let booster = await Booster.findOne({ userId: member.id });

      if (booster) {
        // Jika pengguna booster ditemukan
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `Maaf **${member.user.username}** fitur ini hanya bisa digunakan sekali untuk member yang telah ngeboost server ini <a:nitroflybas:1105774935533682689>`
              ),
          ],
        });
      } else {
        const customRole = await interaction.guild.roles.create({
          name: option1,
          color: option2,
          icon: option3,
          permissions: [],
        });

        try {
          // Mengatur role untuk pengguna yang boost server
          const targetRole = interaction.guild.roles.cache.find(
            (role) => role.id === POSITION_ROLE // 1055033922481819728 Wonderlost
          );
          await customRole.setPosition(targetRole.position + 0);
        } catch (error) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `Posisi role tidak diketahui, harap lapor ke developer bot atau admin server!\nKamu bisa ping/dm <@${client.owner}> atau <@508656364126732299>`
                ),
            ],
          });
        }
        await member.roles.add(customRole);

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `<a:boost1:1105393402905886810> Custom role berhasil dibuat dan telah diberikan.`
              )
              .setThumbnail(option3 ? option3 : null)
              .addFields(
                { name: `Nama Role`, value: `${option1}`, inline: true },
                {
                  name: `Color`,
                  value: `${option2 ? option2 : "Default."}`,
                  inline: true,
                },
                {
                  name: `Icon`,
                  value: `${option3 ? "Di Thumbnail!" : "Tidak ada."}`,
                  inline: true,
                },
                {
                  name: `Dibuat pada`,
                  value: `${func.createdAt(
                    Math.floor(new Date().getTime() / 1000)
                  )}`,
                  inline: true,
                }
              )
              .setFooter({
                text: `Request oleh ${member.user.tag}`,
                iconURL: member.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });

        // Jika pengguna booster tidak ditemukan, buat entri baru dalam database
        const newBooster = new Booster({
          userId: member.id,
          userUsername: member.user.username,
          boostCount: 1,
        });
        await newBooster.save();
      }
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `<a:warn2:1105775326031777853> | Fitur ini hanya khusus **Server Booster**.\nAtau user yang memiliki Role: <@&1055033922481819728>.`
            ),
        ],
      });
    }
  },
};
