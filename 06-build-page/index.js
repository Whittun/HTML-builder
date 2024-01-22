const path = require('path');
const fs = require('fs').promises;

async function getModulesNames() {
  const files = await fs.readdir(path.join(__dirname, 'components'));
  return files;
}

async function createFolder(targetPath, name) {
  const folderStructure = await fs.readdir(targetPath);
  if (folderStructure.includes(name)) return;

  await fs.mkdir(path.join(targetPath, name));
}

async function createFile(targetFolder, fileName, inner) {
  fs.writeFile(path.join(__dirname, targetFolder, fileName), inner);
}

async function getModulesContent(module) {
  const moduleContent = await fs.readFile(
    path.join(__dirname, 'components', module),
    'utf-8',
  );
  return moduleContent;
}

async function buildHtml() {
  const modules = await getModulesNames();

  const htmlModules = modules.map((module) => {
    return `{{${module.split('.')[0]}}}`;
  });

  let fileContent = await fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  for (let i = 0; i < modules.length; i++) {
    if (fileContent.includes(htmlModules[i])) {
      const moduleContent = await getModulesContent(modules[i]);
      fileContent = fileContent.replaceAll(htmlModules[i], moduleContent);
    }
  }
  return fileContent;
}

async function buildCss() {
  const files = await fs.readdir(path.join(__dirname, 'styles'));
  const cssModules = files.filter((file) => file.includes('.css'));

  let cssBundle = '';
  for (let i = 0; i < cssModules.length; i++) {
    cssBundle += await fs.readFile(
      path.join(__dirname, 'styles', cssModules[i]),
      'utf-8',
    );
  }

  return cssBundle;
}

async function copyAssets(srcFolder, destFolder) {
  const folderContents = await fs.readdir(srcFolder);

  for (const name of folderContents) {
    const stats = await fs.stat(path.join(srcFolder, name));

    if (stats.isDirectory()) {
      createFolder(destFolder, name);
      await copyAssets(path.join(srcFolder, name), path.join(destFolder, name));
      continue;
    }

    await fs.copyFile(path.join(srcFolder, name), path.join(destFolder, name));
  }
}

async function createBuild(folderName) {
  createFolder(__dirname, folderName);

  const htmlContent = await buildHtml();
  createFile(folderName, 'index.html', htmlContent);

  const cssContent = await buildCss();
  createFile(folderName, 'style.css', cssContent);

  createFolder(path.join(__dirname, folderName), 'assets');
  copyAssets(
    path.join(__dirname, 'assets'),
    path.join(__dirname, folderName, 'assets'),
  );
}

createBuild('project-dist');
