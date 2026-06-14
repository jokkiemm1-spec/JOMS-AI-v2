const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const path = require("path");

const plugins = {};

// load plugins safely
const pluginPath = path.join(__dirname, "plugins");

if (!fs.existsSync(pluginPath)) {
  fs.mkdirSync(pluginPath);
}

fs.readdirSync(pluginPath).forEach(file => {
  const plugin = require(path.join(pluginPath, file));
  plugins[plugin.name] = plugin;
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  console.log("🤖 JOMS AI is starting...");

  // 🔑 PAIRING CODE (IMPORTANT)
  sock.ev.on("connection.update", async (update) => {
  const { connection } = update;

  if (connection === "open") {
    console.log("✅ WhatsApp Connected (session ready)");

    if (!state.creds.registered) {
      const phoneNumber = "2349036106257"; // your number

      const code = await sock.requestPairingCode(phoneNumber);

      console.log("================================");
      console.log("PAIRING CODE:", code);
      console.log("================================");
    }
  }
});

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const jid = msg.key.remoteJid;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text.startsWith(".")) return;

    const command = text.split(" ")[0].slice(1);

    if (plugins[command]) {
      await plugins[command].run(sock, msg, text);
    }
  });
}

startBot();
