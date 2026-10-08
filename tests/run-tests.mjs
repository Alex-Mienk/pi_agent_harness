import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import Module from "node:module";

const root = resolve(new URL("..", import.meta.url).pathname);
const piRoot = "/opt/homebrew/lib/node_modules/@earendil-works/pi-coding-agent";
process.env.NODE_PATH = [join(piRoot, "node_modules"), "/opt/homebrew/lib/node_modules", process.env.NODE_PATH].filter(Boolean).join(":");
Module._initPaths();

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function parseFrontmatter(text) {
  assert.ok(text.startsWith("---\n"), "frontmatter starts file");
  const end = text.indexOf("\n---\n", 4);
  assert.ok(end > 0, "frontmatter closes");
  const data = {};
  for (const line of text.slice(4, end).split("\n")) {
    const match = line.match(/^([^:]+):\s*"?(.+?)"?$/);
    if (match) data[match[1]] = match[2];
  }
  return data;
}

function testPackageResources() {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.name, "pi-engineering-harness");
  assert.deepEqual(pkg.pi.extensions, ["./extensions/engineering-harness.ts"]);
  assert.deepEqual(pkg.pi.skills, ["./skills"]);
  assert.deepEqual(pkg.pi.prompts, ["./prompts/*.md"]);
  for (const file of [
    "README.md", "USAGE.md", "DISTRIBUTION.md", "PLAN.md",
    "extensions/engineering-harness.ts", "examples/pi-harness.example.json",
    "prompts/feature.md", "prompts/review.md", "prompts/debug.md", "prompts/explain.md",
    "skills/frontend-engineering/SKILL.md", "skills/backend-engineering/SKILL.md", "skills/fullstack-contracts/SKILL.md",
  ]) assert.ok(existsSync(join(root, file)), `${file} exists`);
}

function testPrompts() {
  const prompts = ["feature", "review", "debug", "explain"];
  for (const name of prompts) {
    const text = read(`prompts/${name}.md`);
    const fm = parseFrontmatter(text);
    assert.ok(fm.description, `${name} has description`);
    assert.ok(fm["argument-hint"], `${name} has argument hint`);
    assert.match(text, /Inspect|inspect/, `${name} says inspect`);
    assert.match(text, /Never invent|Do not claim|Do not invent|honest/i, `${name} prevents hallucinated state`);
  }
  assert.match(read("prompts/review.md"), /read-only/i);
  assert.match(read("prompts/explain.md"), /read-only/i);
  assert.match(read("prompts/debug.md"), /--diagnose-only[\s\S]*read-only/i);
  assert.match(read("prompts/debug.md"), /symptom -> evidence -> reproduction -> hypotheses -> narrowing -> root cause -> fix -> regression verification/);
  assert.match(read("prompts/feature.md"), /confirmation[\s\S]*destructive/i);
}

function testSkills() {
  const expected = ["frontend-engineering", "backend-engineering", "fullstack-contracts"];
  for (const name of expected) {
    const text = read(`skills/${name}/SKILL.md`);
    const fm = parseFrontmatter(text);
    assert.equal(fm.name, name);
    assert.ok(fm.description && fm.description.length > 40, `${name} has specific description`);
    assert.match(text, /evidence|Do not assume|Never invent/i);
  }
}

async function testExtensionHelpers() {
  const requireFromPi = createRequire(join(piRoot, "package.json"));
  const { createJiti } = requireFromPi("jiti");
  const jiti = createJiti(import.meta.url, { moduleCache: false });
  const extension = jiti(join(root, "extensions/engineering-harness.ts"));
  assert.equal(typeof extension.default, "function", "extension default factory loads");
  assert.equal(typeof extension.discoverValidationChecks, "function");
  assert.equal(typeof extension.runValidationCheck, "function");

  const tmp = mkdtempSync(join(tmpdir(), "pi-harness-test-"));
  try {
    writeFileSync(join(tmp, "package.json"), JSON.stringify({ scripts: { lint: "echo should-not-win", test: "echo test" } }));
    writeFileSync(join(tmp, ".pi-harness.json"), JSON.stringify({ checks: { lint: "node -e \"process.exit(0)\"", unit: "node -e \"process.exit(1)\"" } }));
    let checks = extension.discoverValidationChecks(tmp);
    assert.deepEqual(checks.map((c) => [c.name, c.command, c.source]), [
      ["lint", "node -e \"process.exit(0)\"", "config"],
      ["unit", "node -e \"process.exit(1)\"", "config"],
    ]);
    let result = await extension.runValidationCheck(tmp, "lint", { timeoutMs: 10000 });
    assert.equal(result.status, "passed");
    assert.equal(result.exitCode, 0);
    result = await extension.runValidationCheck(tmp, "unit", { timeoutMs: 10000 });
    assert.equal(result.status, "failed");
    assert.equal(result.exitCode, 1);
    result = await extension.runValidationCheck(tmp, "missing", { timeoutMs: 10000 });
    assert.equal(result.status, "unavailable");
    result = await extension.runValidationCheck(tmp, "lint", { skip: true });
    assert.equal(result.status, "skipped");

    rmSync(join(tmp, ".pi-harness.json"));
    checks = extension.discoverValidationChecks(tmp);
    assert.deepEqual(checks.map((c) => [c.name, c.command, c.source]), [
      ["lint", "npm run lint", "package.json"],
      ["unit", "npm test", "package.json"],
    ]);

    writeFileSync(join(tmp, "package.json"), JSON.stringify({ scripts: { start: "node server.js" } }));
    checks = extension.discoverValidationChecks(tmp);
    assert.deepEqual(checks, [], "missing config discovery is conservative");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function testDocs() {
  for (const file of ["README.md", "USAGE.md"]) {
    const text = read(file);
    assert.match(text, /\/feature/);
    assert.match(text, /\/review/);
    assert.match(text, /\/debug/);
    assert.match(text, /\/explain/);
  }
  assert.match(read("DISTRIBUTION.md"), /pi install \/absolute\/path/);
  assert.match(read("DISTRIBUTION.md"), /pi install git:/);
  assert.match(read("DISTRIBUTION.md"), /pi install npm:/);
}

async function main() {
  testPackageResources();
  testPrompts();
  testSkills();
  await testExtensionHelpers();
  testDocs();
  console.log("All tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
