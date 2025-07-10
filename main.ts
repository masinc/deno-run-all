import { parse as parseJsonc } from "@std/jsonc";
import { parseArgs } from "node:util";

interface DenoConfig {
  tasks?: Record<string, string>;
}

async function loadDenoConfig(): Promise<DenoConfig> {
  const configFiles = ["deno.json", "deno.jsonc"];

  for (const configFile of configFiles) {
    try {
      const configText = await Deno.readTextFile(configFile);
      if (configFile.endsWith(".jsonc")) {
        return parseJsonc(configText) as DenoConfig;
      } else {
        return JSON.parse(configText) as DenoConfig;
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("deno.json or deno.jsonc not found");
}

function matchPattern(pattern: string, taskName: string): boolean {
  if (pattern.includes("*")) {
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(taskName);
  }
  return pattern === taskName;
}

function findMatchingTasks(
  pattern: string,
  tasks: Record<string, string>,
): string[] {
  return Object.keys(tasks).filter((taskName) =>
    matchPattern(pattern, taskName)
  );
}

async function runTask(taskName: string, _command: string): Promise<void> {
  console.log(`Running task: ${taskName}`);
  const process = new Deno.Command("deno", {
    args: ["task", taskName],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await process.output();
  if (code !== 0) {
    throw new Error(`Task ${taskName} failed with exit code ${code}`);
  }
}

async function runTasksSerial(
  tasks: string[],
  taskCommands: Record<string, string>,
): Promise<void> {
  for (const task of tasks) {
    await runTask(task, taskCommands[task]);
  }
}

async function runTasksParallel(
  tasks: string[],
  taskCommands: Record<string, string>,
): Promise<void> {
  const promises = tasks.map((task) => runTask(task, taskCommands[task]));
  await Promise.all(promises);
}

async function main() {
  try {
    const { values, positionals } = parseArgs({
      args: Deno.args,
      options: {
        parallel: {
          type: "boolean",
          short: "p",
          default: false,
        },
        help: {
          type: "boolean",
          short: "h",
          default: false,
        },
      },
      allowPositionals: true,
    });

    if (values.help) {
      console.log(`Usage: deno-run-all [options] <pattern>

Options:
  -p, --parallel    Run tasks in parallel
  -h, --help        Show this help message

Examples:
  deno-run-all 'build:*'
  deno-run-all --parallel 'test:*'
  deno-run-all -p 'lint:*'`);
      Deno.exit(0);
    }

    if (positionals.length === 0) {
      console.error("Usage: deno-run-all [--parallel] <pattern>");
      Deno.exit(1);
    }

    const parallel = values.parallel;
    const pattern = positionals[0];
    const config = await loadDenoConfig();

    if (!config.tasks) {
      console.error("No tasks found in deno.json");
      Deno.exit(1);
    }

    const matchingTasks = findMatchingTasks(pattern, config.tasks);

    if (matchingTasks.length === 0) {
      console.error(`No tasks matching pattern: ${pattern}`);
      Deno.exit(1);
    }

    console.log(
      `Found ${matchingTasks.length} matching tasks: ${
        matchingTasks.join(", ")
      }`,
    );

    if (parallel) {
      await runTasksParallel(matchingTasks, config.tasks);
    } else {
      await runTasksSerial(matchingTasks, config.tasks);
    }

    console.log("All tasks completed successfully!");
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
