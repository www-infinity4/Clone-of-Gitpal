import chalk from "chalk";
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "../ai.js";

const DEFAULT_ROGERS_URL = "https://infinity-rogers.marvaseater.workers.dev/v1/chat";

export async function configCommand() {
  const existing = loadConfig();

  console.log(chalk.bold("\n⚙️  GitPal Configuration\n"));
  console.log(chalk.dim("GitPal uses Rogers AI. No external AI provider key, signup, credit card, or paid API is required.\n"));

  const { rogersUrl } = await inquirer.prompt([
    {
      type: "input",
      name: "rogersUrl",
      message: "Rogers AI gateway:",
      default: existing.rogersUrl || DEFAULT_ROGERS_URL,
      validate: (val) => /^https?:\/\//i.test(String(val || "").trim()) || "Enter a valid http(s) URL",
    },
  ]);

  saveConfig({ provider: "rogers", rogersUrl: rogersUrl.trim() });

  console.log(chalk.green.bold("\n✅ Rogers AI configuration saved!"));
  console.log(chalk.dim("Config stored at: ~/.gitpal.json\n"));
  console.log(chalk.white("You can now run:"));
  console.log(chalk.cyan("  gitpal commit     ") + chalk.dim("— auto commit message"));
  console.log(chalk.cyan("  gitpal summary    ") + chalk.dim("— summarize recent commits"));
  console.log(chalk.cyan("  gitpal pr         ") + chalk.dim("— generate PR description"));
  console.log(chalk.cyan("  gitpal changelog  ") + chalk.dim("— generate changelog"));
  console.log("");
}
