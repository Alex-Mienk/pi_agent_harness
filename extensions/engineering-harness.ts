import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { Type } from "typebox";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export type ValidationStatus = "passed" | "failed" | "unavailable" | "skipped";

export interface DiscoveredCheck {
	name: string;
	command: string;
	source: "config" | "package.json";
}

export interface ValidationResult {
	status: ValidationStatus;
	check?: string;
	command?: string;
	exitCode?: number | null;
	stdout?: string;
	stderr?: string;
	checks?: DiscoveredCheck[];
	message?: string;
}

const KNOWN_SCRIPT_CHECKS: Record<string, string[]> = {
	lint: ["lint"],
	typecheck: ["typecheck", "type-check", "tsc"],
	unit: ["test:unit", "unit", "test"],
	integration: ["test:integration", "integration"],
	build: ["build"],
};

function readJsonFile(path: string): any | undefined {
	try {
		return JSON.parse(readFileSync(path, "utf8"));
	} catch {
		return undefined;
	}
}

export function discoverValidationChecks(cwd: string): DiscoveredCheck[] {
	const configPath = join(cwd, ".pi-harness.json");
	if (existsSync(configPath)) {
		const config = readJsonFile(configPath);
		const checks = config?.checks;
		if (!checks || typeof checks !== "object" || Array.isArray(checks)) return [];
		return Object.entries(checks)
			.filter(([name, command]) => typeof name === "string" && typeof command === "string" && command.trim())
			.map(([name, command]) => ({ name, command: (command as string).trim(), source: "config" as const }));
	}

	const packageJson = readJsonFile(join(cwd, "package.json"));
	const scripts = packageJson?.scripts;
	if (!scripts || typeof scripts !== "object" || Array.isArray(scripts)) return [];

	const discovered: DiscoveredCheck[] = [];
	for (const [checkName, scriptNames] of Object.entries(KNOWN_SCRIPT_CHECKS)) {
		const scriptName = scriptNames.find((candidate) => typeof scripts[candidate] === "string");
		if (!scriptName) continue;
		discovered.push({
			name: checkName,
			command: scriptName === "test" ? "npm test" : `npm run ${scriptName}`,
			source: "package.json",
		});
	}
	return discovered;
}

function truncate(text: string, max = 12000): string {
	if (text.length <= max) return text;
	return `${text.slice(0, max)}\n[truncated ${text.length - max} characters]`;
}

function executeShellCommand(cwd: string, command: string, timeoutMs: number): Promise<Pick<ValidationResult, "status" | "exitCode" | "stdout" | "stderr">> {
	return new Promise((resolve) => {
		const child = spawn(command, { cwd, shell: true, stdio: ["ignore", "pipe", "pipe"] });
		let stdout = "";
		let stderr = "";
		let settled = false;

		const timeout = setTimeout(() => {
			if (settled) return;
			settled = true;
			child.kill("SIGTERM");
			resolve({ status: "failed", exitCode: null, stdout: truncate(stdout), stderr: truncate(`${stderr}\nTimed out after ${timeoutMs}ms`.trim()) });
		}, timeoutMs);

		child.stdout?.on("data", (chunk) => {
			stdout += String(chunk);
		});
		child.stderr?.on("data", (chunk) => {
			stderr += String(chunk);
		});
		child.on("close", (code) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			resolve({ status: code === 0 ? "passed" : "failed", exitCode: code, stdout: truncate(stdout), stderr: truncate(stderr) });
		});
		child.on("error", (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			resolve({ status: "failed", exitCode: null, stdout: truncate(stdout), stderr: truncate(`${stderr}\n${error.message}`.trim()) });
		});
	});
}

export async function runValidationCheck(cwd: string, checkName: string, options: { skip?: boolean; timeoutMs?: number } = {}): Promise<ValidationResult> {
	const checks = discoverValidationChecks(cwd);
	const check = checks.find((candidate) => candidate.name === checkName);
	if (!check) {
		return { status: "unavailable", check: checkName, checks, message: `No discovered validation check named '${checkName}'.` };
	}
	if (options.skip) {
		return { status: "skipped", check: check.name, command: check.command, message: "Execution skipped by request." };
	}
	const execution = await executeShellCommand(cwd, check.command, options.timeoutMs ?? 120000);
	return { check: check.name, command: check.command, ...execution };
}

const ValidationParams = Type.Object({
	action: Type.Union([Type.Literal("discover"), Type.Literal("run")], { description: "Discover configured validation checks or run one selected check." }),
	check: Type.Optional(Type.String({ description: "Check name to run, such as lint, typecheck, unit, integration, or build." })),
	skip: Type.Optional(Type.Boolean({ description: "Return a skipped result instead of executing the selected check." })),
	timeoutMs: Type.Optional(Type.Number({ description: "Maximum runtime for a check command in milliseconds." })),
});

export default function engineeringHarnessExtension(pi: ExtensionAPI) {
	pi.registerTool({
		name: "engineering_validation",
		label: "Engineering validation",
		description: "Discover conservative repository validation checks or run one discovered check. Uses .pi-harness.json when present, otherwise only declared package.json scripts.",
		parameters: ValidationParams,
		outputSchema: Type.Any(),
		annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			let result: ValidationResult;
			if (params.action === "discover") {
				result = { status: "passed", checks: discoverValidationChecks(ctx.cwd) };
			} else {
				if (!params.check) {
					result = { status: "unavailable", message: "A check name is required for action=run." };
				} else {
					result = await runValidationCheck(ctx.cwd, params.check, { skip: params.skip, timeoutMs: params.timeoutMs });
				}
			}
			return {
				content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
				details: result,
				structuredContent: result,
			};
		},
	});
}
