const fs = require('fs');
const path = require('path');

module.exports = dir => {
  const root = path.join(process.cwd(), dir)

  return fs.readdirSync(root)
  .filter(filename => path.extname(filename).slice(1) === 'js')
  .map(filename => {
    return {
      filename,
      name: path.basename(filename, path.extname(filename)),
      content: fs.readFileSync(path.join(root, filename)).toString(),
      createdAt: new Date()
    };
  });
}