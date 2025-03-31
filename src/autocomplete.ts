import fs from "fs";
import path from "path";

export const autocomplete = (line: string) => {
  const files = fs.readdirSync(process.cwd());
  return files.filter((f) => f.startsWith(line));
};
