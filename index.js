import { connectToWhatsApp } from "./src/connect.js";
import { log } from "./src/utils/logger.js";
import config from "./baileys.config.js";

async function main() {
  log(`🚀 Starting ${config.name} v${config.version}`);
  await connectToWhatsApp();
}

main();