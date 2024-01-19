const { stdin } = process;

const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Привет! Введите текст для файла text.txt');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();
  output.write(data);
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => console.log('До свидания!'));
