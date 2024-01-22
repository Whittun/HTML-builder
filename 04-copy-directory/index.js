const path = require('path');
const fs = require('fs').promises;

async function createFolder(targetPath, name) {
  const folderStructure = await fs.readdir(targetPath);
  if (folderStructure.includes(name)) {
    deleteFiles(path.join(targetPath, name));
    return;
  }

  await fs.mkdir(path.join(targetPath, name));
}

async function deleteFiles(destFolder) {
  const files = await fs.readdir(destFolder);
  const deletePromises = files.map((file) => {
    const filePath = path.join(destFolder, file);
    return fs.unlink(filePath);
  });
  await Promise.all(deletePromises);
}

async function copyDir(srcFolder, destFolder) {
  createFolder(__dirname, 'files-copy');

  const folderContents = await fs.readdir(srcFolder);

  for (const name of folderContents) {
    const stats = await fs.stat(path.join(srcFolder, name));

    if (stats.isDirectory()) {
      createFolder(destFolder, name);
      await copyDir(path.join(srcFolder, name), path.join(destFolder, name));
      continue;
    }

    await fs.copyFile(path.join(srcFolder, name), path.join(destFolder, name));
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
