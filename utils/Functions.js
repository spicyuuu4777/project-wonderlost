module.exports = {
  timestamp: function (ms) {
    return `<t:${Math.trunc(ms / 1000)}:R>`; // <t:${Math.trunc(ms / 1000)}:D> |
  },
  createdAt: function (time) {
    // Konversi waktu menjadi objek Date
    const date = new Date(time * 1000);

    // Mengambil Unix timestamp
    const unixTime = Math.floor(date.getTime() / 1000);

    return `<t:${unixTime}:D> | <t:${unixTime}:R>`;
  },
};
