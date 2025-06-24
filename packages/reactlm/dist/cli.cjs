#!/usr/bin/env node
#!/usr/bin/env node
"use strict";

// src/cli.ts
var { execSync } = require("child_process");
var fs = require("fs");
var path = require("path");
var command = process.argv[2];
if (!command || !["install", "generate"].includes(command)) {
  console.log("Usage: reactlm <command>");
  console.log("\nCommands:");
  console.log("  install   Add reactlm to your project");
  console.log("  generate  Generate codebase context");
  process.exit(1);
}
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
function detectFramework() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  if (deps["next"]) return "next";
  if (deps["react"]) return "react";
  return null;
}
function addScriptToPackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  if (!packageJson.scripts) packageJson.scripts = {};
  packageJson.scripts["reactlm"] = "reactlm generate";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
}
function addScriptToLayout(framework) {
  const scriptTag = `<script src="/reactlm.js"></script>`;
  if (framework === "next") {
    const appLayoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    const altAppLayoutPath = path.join(process.cwd(), "app", "layout.tsx");
    const pagesLayoutPath = path.join(process.cwd(), "src", "pages", "_app.tsx");
    const altPagesLayoutPath = path.join(process.cwd(), "pages", "_app.tsx");
    let layoutFile = null;
    let layoutContent = null;
    if (fs.existsSync(appLayoutPath)) {
      layoutFile = appLayoutPath;
      layoutContent = fs.readFileSync(appLayoutPath, "utf8");
    } else if (fs.existsSync(altAppLayoutPath)) {
      layoutFile = altAppLayoutPath;
      layoutContent = fs.readFileSync(altAppLayoutPath, "utf8");
    } else if (fs.existsSync(pagesLayoutPath)) {
      layoutFile = pagesLayoutPath;
      layoutContent = fs.readFileSync(pagesLayoutPath, "utf8");
    } else if (fs.existsSync(altPagesLayoutPath)) {
      layoutFile = altPagesLayoutPath;
      layoutContent = fs.readFileSync(altPagesLayoutPath, "utf8");
    }
    if (layoutFile && layoutContent) {
      if (!layoutContent.includes("react-llm.js")) {
        if (layoutFile.includes("app/layout")) {
          layoutContent = layoutContent.replace(
            /export default function/,
            `import Script from 'next/script';

export default function`
          );
          layoutContent = layoutContent.replace(
            /<body[^>]*>/,
            `$&
        <Script src="/react-llm.js" />`
          );
        } else {
          layoutContent = layoutContent.replace(
            /export default function/,
            `import Script from 'next/script';

export default function`
          );
          layoutContent = layoutContent.replace(
            /<Component[^>]*>/,
            `<Script src="/react-llm.js" />
          $&`
          );
        }
        fs.writeFileSync(layoutFile, layoutContent);
        console.log(`\u2705 Added script tag to ${path.relative(process.cwd(), layoutFile)}`);
      }
    } else {
      console.log("\u26A0\uFE0F  Could not find layout file. Please add the following to your layout:");
      console.log('   import Script from "next/script"');
      console.log(`   <Script src="/react-llm.js" />`);
    }
  } else {
    const indexPath = path.join(process.cwd(), "public", "index.html");
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, "utf8");
      if (!content.includes("react-llm.js")) {
        content = content.replace(
          /<body[^>]*>/,
          `$&
    ${scriptTag}`
        );
        fs.writeFileSync(indexPath, content);
        console.log("\u2705 Added script tag to public/index.html");
      }
    } else {
      console.log("\u26A0\uFE0F  Could not find index.html. Please add the following script tag manually:");
      console.log(`   ${scriptTag}`);
    }
  }
}
function setupEnvironmentVariables(framework, apiKey) {
  if (framework === "next") {
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
      if (!envContent.includes("NEXT_PUBLIC_GEMINI_API_KEY")) {
        envContent += `
NEXT_PUBLIC_GEMINI_API_KEY=${apiKey}
`;
      }
    } else {
      envContent = `NEXT_PUBLIC_GEMINI_API_KEY=${apiKey}
`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("\u2705 Added API key to .env.local");
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, "utf8");
      if (!gitignore.includes(".env.local")) {
        fs.appendFileSync(gitignorePath, "\n.env.local\n");
        console.log("\u2705 Added .env.local to .gitignore");
      }
    }
  } else {
    console.log("\nTo use react-llm, add this to your app:");
    console.log('window.GEMINI_API_KEY = "YOUR_API_KEY";');
    console.log("\nMake sure to set this before the react-llm.js script loads.");
  }
}
async function copySqliteWasm(publicDir) {
  const possibleSources = [
    // Try package's own dist directory first
    path.join(__dirname, "..", "dist", "sqlite3.wasm"),
    // Try node_modules as fallback
    path.join(process.cwd(), "node_modules", "@sqlite.org", "sqlite-wasm", "sqlite-wasm", "jswasm", "sqlite3.wasm")
  ];
  const sqliteWasmDest = path.join(publicDir, "sqlite3.wasm");
  for (const src of possibleSources) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, sqliteWasmDest);
      console.log("\u2705 Copied sqlite3.wasm to public directory");
      return true;
    }
  }
  console.error("\u274C Could not find sqlite3.wasm in any expected location.");
  console.error("This is likely a bug in react-llm. Please report it at:");
  console.error("https://github.com/yourusername/react-llm/issues");
  return false;
}
async function install(apiKey) {
  try {
    const framework = detectFramework();
    const publicDir = path.join(process.cwd(), "public");
    ensureDir(publicDir);
    const success = await copySqliteWasm(publicDir);
    if (!success) {
      process.exit(1);
    }
    addScriptToPackageJson();
    await addScriptToLayout(framework);
    await setupEnvironmentVariables(framework, apiKey);
    console.log("\u2728 react-llm installation complete!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Start your development server");
    console.log("2. Visit your app and look for the react-llm chat widget");
    console.log("");
    console.log("For more information, visit: https://github.com/yourusername/react-llm");
  } catch (error) {
    console.error("\u274C Installation failed:", error.message);
    process.exit(1);
  }
}
if (command === "install") {
  try {
    console.log("\u{1F527} Setting up react-llm...");
    const apiKey = process.argv[3];
    if (!apiKey) {
      console.error("\u274C Please provide your Gemini API key:");
      console.error("   pnpm react-llm install YOUR_API_KEY");
      process.exit(1);
    }
    install(apiKey);
  } catch (error) {
    console.error("\u274C Failed to install react-llm:", error.message);
    process.exit(1);
  }
}
if (command === "generate") {
  try {
    console.log("\u{1F50D} Running RepoMix to generate codebase context...");
    const publicDir = path.join(process.cwd(), "public");
    ensureDir(publicDir);
    const output = execSync("repomix", {
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: 10 * 1024 * 1024
      // 10MB buffer
    });
    const contextFile = path.join(publicDir, "codebase-context.json");
    fs.writeFileSync(
      contextFile,
      JSON.stringify({ context: output.toString() })
    );
    const sqliteWasmPath = path.join(publicDir, "sqlite3.wasm");
    if (!fs.existsSync(sqliteWasmPath)) {
      console.warn("\u26A0\uFE0F  sqlite3.wasm not found in public directory. Please run `pnpm react-llm install` again");
    }
    console.log("\u2705 Codebase context generated successfully!");
    console.log("\u{1F4DD} Saved to public/codebase-context.json");
  } catch (error) {
    console.error("\u274C Failed to generate codebase context:", error.message);
    process.exit(1);
  }
}
