import { assert, assertEquals } from "@std/assert";
import { parse as parseJsonc } from "@std/jsonc";

// Import the functions we want to test
// Since they're not exported, we'll need to copy them or make them testable
interface DenoConfig {
  tasks?: Record<string, string>;
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

Deno.test("matchPattern - exact match", () => {
  assert(matchPattern("build", "build"));
  assert(!matchPattern("build", "test"));
});

Deno.test("matchPattern - wildcard at end", () => {
  assert(matchPattern("build:*", "build:lib"));
  assert(matchPattern("build:*", "build:docs"));
  assert(!matchPattern("build:*", "test:unit"));
});

Deno.test("matchPattern - wildcard at start", () => {
  assert(matchPattern("*:test", "unit:test"));
  assert(matchPattern("*:test", "integration:test"));
  assert(!matchPattern("*:test", "build:lib"));
});

Deno.test("matchPattern - multiple wildcards", () => {
  assert(matchPattern("*:*:*", "test:unit:main"));
  assert(matchPattern("test:*:main", "test:unit:main"));
  assert(!matchPattern("test:*:main", "test:unit:lib"));
});

Deno.test("findMatchingTasks - find build tasks", () => {
  const tasks = {
    "build:lib": "echo lib",
    "build:docs": "echo docs",
    "test:unit": "echo test",
    "lint": "echo lint",
  };

  const result = findMatchingTasks("build:*", tasks);
  assertEquals(result.sort(), ["build:docs", "build:lib"]);
});

Deno.test("findMatchingTasks - find test tasks", () => {
  const tasks = {
    "test:unit": "echo unit",
    "test:integration": "echo integration",
    "build:lib": "echo lib",
  };

  const result = findMatchingTasks("test:*", tasks);
  assertEquals(result.sort(), ["test:integration", "test:unit"]);
});

Deno.test("findMatchingTasks - no matches", () => {
  const tasks = {
    "build:lib": "echo lib",
    "test:unit": "echo test",
  };

  const result = findMatchingTasks("deploy:*", tasks);
  assertEquals(result, []);
});

Deno.test("findMatchingTasks - exact match", () => {
  const tasks = {
    "build": "echo build",
    "build:lib": "echo lib",
    "test": "echo test",
  };

  const result = findMatchingTasks("build", tasks);
  assertEquals(result, ["build"]);
});

Deno.test("parseJsonc - handles comments", () => {
  const jsonc = `{
    // This is a comment
    "tasks": {
      "build": "echo build", // Another comment
      "test": "echo test"
    }
  }`;

  const result = parseJsonc(jsonc) as DenoConfig;
  assertEquals(result.tasks?.build, "echo build");
  assertEquals(result.tasks?.test, "echo test");
});

Deno.test("JSON.parse - handles regular JSON", () => {
  const json = `{
    "tasks": {
      "build": "echo build",
      "test": "echo test"
    }
  }`;

  const result = JSON.parse(json) as DenoConfig;
  assertEquals(result.tasks?.build, "echo build");
  assertEquals(result.tasks?.test, "echo test");
});
