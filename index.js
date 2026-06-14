const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  console.log("🤖 JOMS AI STARTED");

  // 🔑 PAIRING CODE (IMPORTANT)
 let pairingDone = false;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  console.log("🤖 BOT STARTED");

  // 🔑 SAFE PAIRING CONTROL
  if (!state.creds.registered && !pairingDone) {
    pairingDone = true;

    setTimeout(async () => {
      try {
        const phoneNumber = "2349036106257";

        const code = await sock.requestPairingCode(phoneNumber);

        console.log("================================");
        console.log("PAIRING CODE:", code);
        console.log("================================");
      } catch (e) {
        console.log("Pairing error:", e.message);
      }
    }, 8000);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;

    if (connection === "close") {
      console.log("❌ disconnected (not restarting pairing)");
    }

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }
  });
}

startBot();
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const jid = msg.key.remoteJid;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text.startsWith(".")) return;

    if (text === ".ping") {
      await sock.sendMessage(jid, { text: "🏓 Pong from JOMS AI" });
    }

    if (text === ".menu") {
      await sock.sendMessage(jid, {
        text: "🤖 JOMS AI MENU\n\n.ping\n.menu"
      });
    }
  });
}

startBot();
