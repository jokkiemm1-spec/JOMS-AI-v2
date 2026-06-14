const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const P = require("pino");

const plugins = {};

// load plugins
const fs = require("fs");
const path = require("path");

const plugins = {};

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

  console.log("🤖 JOMS AI is running...");

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
