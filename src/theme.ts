import fs from "fs";
import chalk from "chalk";

export type Theme = {
  user: string;
  hostname: string;
  cwd: string;
  prompt: string;
};

let currentTheme: Theme = {
  user: "green",
  hostname: "cyan",
  cwd: "blue",
  prompt: "yellow",
};

export const loadTheme = (themeName: string) => {
  const themeFile = `./themes/${themeName}.json`;
  if (fs.existsSync(themeFile)) {
    currentTheme = JSON.parse(fs.readFileSync(themeFile, "utf-8"));
  } else {
    console.log(chalk.red(`Theme file ${themeFile} not found.`));
    process.exit(1);
  }
};

export const getTheme = () => currentTheme;
