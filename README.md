# deno-run-all

A Deno version of npm-run-all. Run multiple tasks defined in `deno.json` using pattern matching.

## Features

- Pattern matching with wildcards (`*`)
- Serial execution (default) and parallel execution
- Support for both `deno.json` and `deno.jsonc` files
- Compatible with Deno's task system

## Usage

Add deno-run-all to your `deno.json` tasks:

```json
{
  "tasks": {
    "build": "deno run -A main.ts 'build:*'",
    "test": "deno run -A main.ts 'test:*'",
    "test:parallel": "deno run -A main.ts --parallel 'test:*'"
  }
}
```

Then run with:

```bash
# Run all build tasks
deno task build

# Run all test tasks  
deno task test

# Run test tasks in parallel
deno task test:parallel
```

## Examples

Given this `deno.json`:

```json
{
  "tasks": {
    "build:lib": "echo 'Building library...'",
    "build:docs": "echo 'Building documentation...'",
    "test:unit": "echo 'Running unit tests...'",
    "test:integration": "echo 'Running integration tests...'",
    "lint": "deno lint"
  }
}
```

### Run all build tasks (serial)
```bash
deno task build
```

### Run all test tasks (parallel)
```bash
deno task test:parallel
```

## Installation

### Compile to binary

```bash
# Build as deno-run-all
deno task build:deno-run-all

# Build as dna (short alias)
deno task build:dna
```

### Use directly (for development)

```bash
deno run -A main.ts "pattern"
```

## Development

### Run tests
```bash
deno task test
```

### Lint
```bash
deno task lint
```

### Format
```bash
deno task format
```

## Pattern Matching

- `*` matches any characters
- `build:*` matches `build:lib`, `build:docs`, etc.
- `*:test` matches `unit:test`, `integration:test`, etc.
- `test:*:main` matches `test:unit:main`, `test:integration:main`, etc.

## Configuration Files

Supports both:
- `deno.json` (parsed with `JSON.parse`)
- `deno.jsonc` (parsed with `@std/jsonc` to handle comments)

## License

MIT