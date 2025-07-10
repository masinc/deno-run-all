# deno-run-all

A Deno version of npm-run-all. Run multiple tasks defined in `deno.json` using
pattern matching.

## Features

- Pattern matching with wildcards (`*`)
- Serial execution (default) and parallel execution
- Support for both `deno.json` and `deno.jsonc` files
- Compatible with Deno's task system

## Usage

### Direct usage from JSR

```bash
# Use latest version (recommended)
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all 'build:*'

# Use specific version
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all@0.2.2 'build:*'

# Run tasks in parallel (long form)
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all --parallel 'test:*'

# Run tasks in parallel (short form)
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all -p 'test:*'

# Show help
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all --help

# Show version
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all --version
```

### Add to your `deno.json` tasks

```json
{
  "tasks": {
    "build": "deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all 'build:*'",
    "test": "deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all 'test:*'",
    "test:parallel": "deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all -p 'test:*'"
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
    "build": "deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all 'build:*'",
    "build:lib": "echo 'Building library...'",
    "build:docs": "echo 'Building documentation...'",
    "test": "deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all 'test:*'",
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

### Direct usage from JSR (Recommended)

No installation needed, use directly:

```bash
deno run --allow-read --allow-run=deno jsr:@masinc/deno-run-all 'build:*'
```

### Install as global command

```bash
# Install latest version globally
deno install --allow-read --allow-run=deno --name deno-run-all jsr:@masinc/deno-run-all

# Install specific version
deno install --allow-read --allow-run=deno --name deno-run-all jsr:@masinc/deno-run-all@0.2.2

# Or with a shorter name
deno install --allow-read --allow-run=deno --name dna jsr:@masinc/deno-run-all

# Then use anywhere
deno-run-all 'build:*'
dna -p 'test:*'

# To uninstall
deno uninstall deno-run-all
deno uninstall dna
```

### Compile to binary from JSR

```bash
# Compile directly from JSR
deno compile --allow-read --allow-run=deno --output deno-run-all jsr:@masinc/deno-run-all

# Or with a shorter name
deno compile --allow-read --allow-run=deno --output dna jsr:@masinc/deno-run-all

# Then use the binary
./deno-run-all 'build:*'
./dna -p 'test:*'
```

### Development builds

```bash
# Clone this repository first, then:
deno task build:deno-run-all
deno task build:dna
```

### Local development usage

```bash
# With minimal permissions
deno run --allow-read=deno.json,deno.jsonc --allow-run=deno main.ts "test:*"

# Or with all permissions (quick testing)
deno run -A main.ts "test:*"
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

## Command Line Options

```
Usage: deno-run-all [options] <pattern>

Options:
  -p, --parallel    Run tasks in parallel
  -h, --help        Show help message
  -v, --version     Show version information

Examples:
  deno-run-all 'build:*'
  deno-run-all --parallel 'test:*'
  deno-run-all -p 'lint:*'
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
