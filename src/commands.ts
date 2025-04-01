import { exec, spawn } from "child_process";
import { saveConfig } from "./config";
import { loadTheme } from "./theme";
import { resolveAlias, saveAlias } from "./alias";
import { shellPrompt } from "./prompt";
import process from "process";

export const executeCommand = (line: string) => {
  let [cmd, ...args] = line.trim().split(/\s+/);

  // Resolve the alias dynamically at runtime
  try {
    cmd = resolveAlias(cmd as string); // Resolves the alias chain at runtime
  } catch (error: any) {
    console.error(error.message);
    shellPrompt();
    return;
  }

  if (cmd === "exit") {
    console.log("Goodbye!");
    process.exit(0);
  }

  // ✅ FIXED: Built-in `cd` command
  else if ((cmd === "cd" || cmd === "chdir") && args.length > 0) {
    const targetDir = args.join(" ") || process.env.HOME;
    try {
      process.chdir(targetDir as string);
    } catch (error) {
      console.log(`cd: No such file or directory: ${targetDir}`);
    }
    shellPrompt();
  }

  // ✅ Built-in `theme` command
  else if (cmd === "theme" && args.length > 0) {
    saveConfig("theme", args[0] as string);
    loadTheme(args[0] as string);
    console.log(`Switched to theme: ${args[0]}`);
    shellPrompt();
  }

  // ✅ Built-in `alias` command
  else if (cmd === "alias" && args.length > 1) {
    saveAlias(args[0] as string, args.slice(1).join(" "));
    console.log(`Alias saved: ${args[0]} → ${args.slice(1).join(" ")}`);
    shellPrompt();
  }

  // ✅ Execute external commands
  else {
    const child = spawn(cmd as string, args, {
      stdio: "inherit",
      shell: true,
    });
    child.on("error", (error) => {
      console.error(`Error executing command: ${error.message}`);
    });
    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`Command closed with code: ${code}`);
      }
      shellPrompt();
    });
  }
};
