import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_PATH = path.join(os.homedir(), '.gitpal.json');
const DEFAULT_ROGERS_URL = 'https://infinity-rogers.marvaseater.workers.dev/v1/chat';

export function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')); }
  catch { return {}; }
}

export function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

async function callRogers(prompt, endpoint = DEFAULT_ROGERS_URL) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      input: String(prompt || ''),
      context: {
        application: 'GitPal',
        task: 'git-assistant'
      }
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || `Rogers AI request failed (${res.status})`);
  return String(data.output || data.output_text || data.answer || '').trim();
}

export async function askAI(prompt) {
  const config = loadConfig();
  return callRogers(prompt, config.rogersUrl || DEFAULT_ROGERS_URL);
}
