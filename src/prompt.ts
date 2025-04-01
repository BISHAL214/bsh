import os from "os";
import chalk from "chalk";
import { getTheme } from "./theme";
import dayjs from "dayjs";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function getGitBranch(): Promise<string> {
  try {
    const git = simpleGit();
    const branch = await git.revparse(["--abbrev-ref", "HEAD"]);
    return branch ? ` ${branch.trim()}` : "";
  } catch {
    return ""; // Not a git repo
  }
}

export async function detectEnvironments(): Promise<string> {
  let envs: string[] = [];

  if (process.env.VIRTUAL_ENV) {
    envs.push(chalk.blueBright("🐍 venv"));
  }

  if (fs.existsSync(path.join(process.cwd(), "node_modules"))) {
    const nodeVersion = getCommandOutput("node -v");
    envs.push(chalk.greenBright(`⬢ ${nodeVersion}`));
  }

  if (fs.existsSync(path.join(process.cwd(), "bun.lock"))) {
    const bunVersion = getCommandOutput("bun -v");
    envs.push(chalk.yellowBright(`🐰 ${bunVersion}`));
  }

  if (fs.existsSync(path.join(process.cwd(), "Cargo.toml"))) {
    const rustVersion = getCommandOutput("rustc --version");
    envs.push(chalk.redBright(`🦀 ${rustVersion}`));
  }

  if (fs.existsSync(path.join(process.cwd(), "go.mod"))) {
    const goVersion = getCommandOutput("go version");
    envs.push(chalk.cyanBright(` ${goVersion}`));
  }

  return envs.length ? envs.join(" ") : "";
}

// Function to execute shell commands safely and return output
function getCommandOutput(command: string): string {
  try {
    return execSync(command).toString().trim();
  } catch {
    return ""; // Return empty string if command fails
  }
}

export async function shellPrompt(): Promise<void> {
  const theme = getTheme();
  const user = os.userInfo().username;
  const cwd = process.cwd(); // Full path
  const folder = cwd.split(path.sep).pop() || "/"; // Get last folder
  const gitBranch = await getGitBranch();
  const envs = await detectEnvironments();
  const time = dayjs().format("HH:mm:ss");

  const prompt = `${chalk.bold.greenBright("->")} ${chalk.bold[theme.cwd](folder)} git:(${chalk.italic.magentaBright(gitBranch)}) via ${envs} `;

  // // Terminal width
  // const termWidth = process.stdout.columns || 80;

  // Calculate padding to push Git & Env to the right
  // const paddingLength = Math.max(
  //   termWidth - leftPrompt.length - rightPrompt.length - 3,
  //   1,
  // );
  // const padding = " ".repeat(paddingLength);

  process.stdout.write(prompt);
}
