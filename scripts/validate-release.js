#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating Release Setup...\n');

let errors = 0;
let warnings = 0;

function check(condition, message, isError = true) {
  if (condition) {
    console.log(`✅ ${message}`);
  } else {
    if (isError) {
      console.log(`❌ ${message}`);
      errors++;
    } else {
      console.log(`⚠️  ${message}`);
      warnings++;
    }
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function hasPackageField(packagePath, field) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), packagePath), 'utf8'));
    return field.split('.').reduce((obj, key) => obj?.[key], pkg) !== undefined;
  } catch {
    return false;
  }
}

console.log('📦 Checking package.json configuration...');
check(fileExists('package.json'), 'Root package.json exists');
check(hasPackageField('package.json', 'workspaces'), 'Workspaces configured');
check(hasPackageField('package.json', 'scripts.changeset'), 'Changeset script exists');
check(hasPackageField('package.json', 'scripts.version'), 'Version script exists');
check(hasPackageField('package.json', 'scripts.release'), 'Release script exists');

console.log('\n📋 Checking changeset configuration...');
check(fileExists('.changeset/config.json'), 'Changeset config exists');
check(fileExists('.changeset/README.md'), 'Changeset README exists');

console.log('\n🚀 Checking react-llm package...');
check(fileExists('packages/react-llm/package.json'), 'Package exists');
check(hasPackageField('packages/react-llm/package.json', 'name'), 'Package name defined');
check(hasPackageField('packages/react-llm/package.json', 'version'), 'Package version defined');
check(hasPackageField('packages/react-llm/package.json', 'main'), 'Main entry point defined');
check(hasPackageField('packages/react-llm/package.json', 'module'), 'Module entry point defined');
check(hasPackageField('packages/react-llm/package.json', 'types'), 'TypeScript types defined');
check(hasPackageField('packages/react-llm/package.json', 'files'), 'Files array defined');
check(hasPackageField('packages/react-llm/package.json', 'publishConfig.access'), 'Public access configured');
check(fileExists('packages/react-llm/.npmignore'), '.npmignore exists');

console.log('\n🔧 Checking GitHub Actions...');
check(fileExists('.github/workflows/ci.yml'), 'CI workflow exists');
check(fileExists('.github/workflows/release.yml'), 'Release workflow exists');
check(fileExists('.github/workflows/docs.yml'), 'Documentation workflow exists');

console.log('\n📝 Checking documentation...');
check(fileExists('README.md'), 'Root README exists');
check(fileExists('RELEASE.md'), 'Release documentation exists');
check(fileExists('packages/react-llm/README.md'), 'Package README exists', false);

console.log('\n🔐 Checking environment...');
const hasNpmToken = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN;
check(hasNpmToken, 'NPM_TOKEN available', false);

console.log('\n🏗️  Checking build...');
try {
  console.log('  Building packages...');
  execSync('pnpm build --filter=react-llm', { stdio: 'pipe' });
  check(true, 'Build successful');
  
  check(fileExists('packages/react-llm/dist/index.js'), 'ESM build exists');
  check(fileExists('packages/react-llm/dist/index.cjs'), 'CJS build exists');
  check(fileExists('packages/react-llm/dist/react-llm.global.global.js'), 'IIFE build exists');
  check(fileExists('packages/react-llm/dist/index.d.ts'), 'TypeScript declarations exist', false);
} catch (error) {
  check(false, 'Build failed: ' + error.message);
}

console.log('\n📊 Summary:');
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\n❌ Release setup has errors that must be fixed.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Release setup is functional but has warnings.');
  process.exit(0);
} else {
  console.log('\n✅ Release setup is ready!');
  console.log('\n📚 Next steps:');
  console.log('  1. Run `pnpm changeset` to create a changeset');
  console.log('  2. Commit and push your changes');
  console.log('  3. Merge the Version Packages PR when ready');
  console.log('  4. Packages will be automatically published');
  process.exit(0);
}