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

export const resolveAlias = (cmd: string): string => {
  const visited = new Set<string>();
  let parts = cmd.split(/\s+/);

  for (let i = 0; i < parts.length; i++) {
    while (aliases[parts[i]] && !visited.has(parts[i])) {
      visited.add(parts[i]);
      const aliasValue = aliases[parts[i]];
      if (aliasValue) {
        const aliasParts = aliasValue.trim().split(/\s+/);
        parts.splice(i, 1, ...aliasParts);
      }
    }
  }

  return parts.join(" ").trim();
};
