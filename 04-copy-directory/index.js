const path = require('path');
const fs = require('fs');

function copyDir(src, dist) {
  fs.mkdir(path.join(__dirname, dist), () => {
    console.log('Папка-клон создана');
  });

  fs.readdir(path.join(__dirname, src), (err, files) => {
    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, src, file),
        path.join(__dirname, dist, file),
        () => {
          console.log('Файл скопирован');
        },
      );
    });
  });
}

copyDir('files', 'files-copy');
