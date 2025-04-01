import readline from "readline";
import { executeCommand } from "./commands";
import { shellPrompt } from "./prompt";
import { loadConfig } from "./config";
import { loadHistory, saveHistory, getHistory } from "./history";
import { autocomplete } from "./autocomplete";
import { loadAliases } from "./alias";

loadConfig();
loadHistory();
loadAliases();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => [autocomplete(line), line],
});

let historyIndex = -1;
const history = getHistory();

rl.on("line", (line) => {
  saveHistory(line);
  executeCommand(line);
});

rl.on("keypress", (_, key) => {
  if (key.name === "return") {
    historyIndex = -1; // Reset history index on enter
  } else if (key.name === "c" && key.ctrl) {
    rl.close();
  } else if (key.name === "up") {
    historyIndex = Math.max(historyIndex - 1, 0);
    rl.write(history[historyIndex] || "");
  } else if (key.name === "down") {
    historyIndex = Math.min(historyIndex + 1, history.length - 1);
    rl.write(history[historyIndex] || "");
  }
});

// ✅ Always start with a prompt
shellPrompt();
