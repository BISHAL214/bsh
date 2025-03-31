import os from "os";
import chalk from "chalk";
import { getTheme } from "./theme";

export const shellPrompt = () => {
  const theme = getTheme();
  const user = os.userInfo().username;
  const hostname = os.hostname();
  const cwd = process.cwd();

  process.stdout.write(
    chalk[theme.user](`${user}`) +
      "@" +
      chalk[theme.hostname](`${hostname}`) +
      ":" +
      chalk[theme.cwd](`${cwd}`) +
      chalk[theme.prompt]("$ "), // Prompt character
  );
};
