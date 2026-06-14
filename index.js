const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  console.log("🤖 JOMS AI BOT STARTED");

  setTimeout(async () => {
    try {
      if (!state.creds.registered) {
        const code = await sock.requestPairingCode("2349036106257");

        console.log("================================");
        console.log("PAIRING CODE:", code);
        console.log("================================");
      }
    } catch (e) {
      console.log("Pairing error:", e.message);
    }
  }, 8000);
}

startBot();
