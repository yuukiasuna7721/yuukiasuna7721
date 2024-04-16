const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.0",
    author: "rehat--",
    role: 0,
    countDown: 5,
    longDescription: {
      en: "Generate images using dalle 3"
    },
    category: "ai",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, event, args, message }) {

    const keySearch = args.join(" ");
if (!keySearch) return message.reply("Add something baka.");
    message.reply("Please wait...⏳");

    try {
        const res = await axios.get(`https://www.rehatdesu.xyz/api/dalle?prompt=${keySearch}&cookie=1L5w_ol7evq9SIf5WUWyVHGmgkMRaAHdei0hBZ6spzQ9KOKCTA5sSuOAxmfq-yFdfaVIe9Z2FmcM-GiHRNZ6Ym8_CeEQNB7ZJUADNuyA8iwiBCBc1LkcsHWnQSAlNCL6YCsSPQnq2rsnds3a4qaO2vNTsupl26KVsmanNvwvYa2JRlkaC-kuWr3Q9pvnb4j4uoJ4UmHQuA2PGaKLXhXN1cw`);// add your bing cookie _u value!!
        const data = res.data.result

        if (!data || data.length === 0) {
            api.sendMessage("An error occurred.", event.threadID, event.messageID);
            return;
        }

        const imgData = [];
        for (let i = 0; i < data.length; i++) { // No need to limit to Math.min(numberSearch, data.length)
            const imgUrl = data[i];
            const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
            attachment: imgData,
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred.", event.threadID, event.messageID);
    } finally {
        await fs.remove(path.join(__dirname, 'cache'));
    }
  }
}
