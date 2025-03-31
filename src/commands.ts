import { exec } from "child_process";
import { saveConfig } from "./config";
import { loadTheme } from "./theme";
import { saveAlias, getAlias } from "./alias";
import { shellPrompt } from "./prompt";
import process from "process";

export const executeCommand = (line: string) => {
  let [cmd, ...args] = line.trim().split(" ");

  const aliasCmd = getAlias(cmd as string);
  if (aliasCmd) {
    cmd = aliasCmd;
  }

  if (cmd === "exit") {
    console.log("Goodbye!");
    process.exit(0);
  }

  // ✅ FIXED: Built-in `cd` command
  else if ((cmd === "cd" || cmd === "chdir") && args.length > 0) {
    const targetDir = args[0] || process.env.HOME;
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
    exec(line, (error, stdout, stderr) => {
      if (error) console.log(`Error: ${error.message}`);
      if (stderr) console.log(`stderr: ${stderr}`);
      if (stdout) console.log(stdout);
      shellPrompt(); // ✅ Always show prompt after execution
    });
  }
};
