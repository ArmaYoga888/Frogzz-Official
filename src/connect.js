import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import { log } from "./utils/logger.js";
import config from "../baileys.config.js";
import readline from "readline";

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    browser: ["FrogzzOfficial", "Chrome", "20.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Masukkan nomor WhatsApp (contoh: 62xxxx): ", async (phoneNumber) => {
      try {
        const code = await sock.requestPairingCode(phoneNumber);
        log(`📱 Kode pairing untuk ${phoneNumber}: ${code}`);
      } catch (err) {
        log("❌ Gagal membuat kode pairing:", err.message);
      }
      rl.close();
    });
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") log("✅ Terhubung ke WhatsApp!");
    else if (connection === "close") log("❌ Koneksi terputus.", lastDisconnect?.error);
  });

  sock.ev.on("messages.upsert", ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message) return;
    const sender = msg.key.remoteJid;
    log(`💬 Pesan baru dari ${sender}`);
  });
}