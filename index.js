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
  setTimeout(async () => {
    try {
      if (!state.creds.registered) {
        const phoneNumber = "2349036106257"; // change to your number

        const code = await sock.requestPairingCode(phoneNumber);

        console.log("================================");
        console.log("PAIRING CODE:", code);
        console.log("================================");
      }
    } catch (e) {
      console.log("Pairing error:", e.message);
    }
  }, 5000);

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
