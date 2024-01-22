const path = require('path');
const fs = require('fs');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
  if (err) throw err;
});

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  const filteredFiles = files.filter((file) => file.includes('.css'));

  filteredFiles.forEach((file) => {
    fs.readFile(path.join(__dirname, 'styles', file), 'utf-8', (err, data) => {
      writeStream.write(data);
    });
  });
});
