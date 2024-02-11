const Eris = require("eris");
const keep_alive = require('./keep_alive.js');
const fetch = require('node-fetch');

// Replace TOKEN with your bot account's token
const bot = new Eris(process.env.token);

bot.on("error", (err) => {
  console.error(err); // or your preferred logger
});

bot.on("ready", () => {
  console.log("Bot is ready!");
  // Set activity status
  bot.editStatus("online", {
    name: "Follow us on Instagram!",
    type: 3, // type 3 indicates streaming status
    url: "https://www.instagram.com/br3gadzegiorgi/"
  });
});

bot.on("rawWS", async (packet) => {
  if (packet.t === "MESSAGE_CREATE") {
    const { author, content } = packet.d;
    if (author.id !== bot.user.id && content.includes("https://www.instagram.com/br3gadzegiorgi//")) {
      // Send message to webhook
      await sendToWebhook(author.username, content);
    }
  }
});

async function sendToWebhook(username, content) {
  const webhookURL = "https://discord.com/api/webhooks/1206253686213578803/0EFWRFMk8tIJ4qgMsJbuHnKB63bYNKD3gFpbs3TVei6VHQ2eLTyRMLteJfa-Gksn1rM_";
  const message = `User ${username} clicked the Instagram link: ${content}`;

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message to webhook');
    }
  } catch (error) {
    console.error('Error sending message to webhook:', error);
  }
}

bot.connect();