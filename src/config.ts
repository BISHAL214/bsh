import fs from "fs";
import { loadTheme } from "./theme.ts";

const configFilePath = "./config.json";

export const saveConfig = (key: string, value: string) => {
  let config: Record<string, string> = {};
  if (fs.existsSync(configFilePath)) {
    config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  } else {
    config[key] = value;
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  }
};

export const loadConfig = () => {
  if (fs.existsSync(configFilePath)) {
    const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    if (config.theme) {
      loadTheme(config.theme);
    }
  } else {
    console.log("No config file found. Using default settings.");
  }
};
