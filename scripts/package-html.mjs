import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out/", import.meta.url));
const build = fileURLToPath(new URL("../build/", import.meta.url));
const zip = fileURLToPath(new URL("../build/fov-calculator-toy.zip", import.meta.url));
mkdirSync(build, { recursive: true });
// Recreate the archive so files deleted from the export cannot survive in it.
rmSync(zip, { force: true });
execFileSync("zip", ["-q", "-r", zip, "."], { cwd: out });
execFileSync("unzip", ["-tq", zip], { stdio: "inherit" });
console.log(`HTML ZIP: ${zip} (${statSync(zip).size} bytes)`);
