import fs from "fs";

const aliasFile = "./aliases.json";
let aliases: Record<string, string> = {};

export const loadAliases = () => {
  if (fs.existsSync(aliasFile)) {
    aliases = JSON.parse(fs.readFileSync(aliasFile, "utf-8"));
  }
};

export const saveAlias = (key: string, command: string) => {
  aliases[key] = command;
  fs.writeFileSync(aliasFile, JSON.stringify(aliases, null, 2));
};

export const getAlias = (key: string) => aliases[key] || null;
