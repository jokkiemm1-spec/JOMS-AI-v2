module.exports = {
  name: "menu",
  run: async (sock, msg) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🤖 JOMS AI MENU

.ping
.menu`
    });
  }
};
