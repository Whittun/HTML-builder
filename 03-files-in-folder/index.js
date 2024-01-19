const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].isDirectory()) continue;
      const filePath = path.join(files[i].path, files[i].name);
      fs.stat(filePath, (err, stat) => {
        const fileName = path.basename(filePath).split('.')[0];
        const extname = path.basename(filePath).split('.')[1];
        const sizeFile = Math.ceil(stat.size / 1024);

        console.log(`${fileName} - ${extname} - ${sizeFile}kb`);
      });
    }
  },
);
