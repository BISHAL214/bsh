import fs from "fs";

const historyFile = "./history.json";
let history: string[] = [];

export const loadHistory = () => {
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
  }
};

export const saveHistory = (command: string) => {
  history.push(command);
  if (history.length > 50) history.shift();
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
};

export const getHistory = () => history;
