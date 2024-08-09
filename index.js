const fs = require('fs');
const path = require('path');

// 指定要扫描的目录
const directoryPath = './docs';

// 递归读取目录中的所有 Markdown 文件
function readDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log('无法扫描目录: ' + err);
    }

    files.forEach(file => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.log('无法获取文件信息: ' + err);
        }

        if (stats.isDirectory()) {
          // 如果是目录，递归读取
          readDirectory(filePath);
        } else if (path.extname(file) === '.md') {
          // 如果是 Markdown 文件，处理文件内容
          processMarkdownFile(filePath);
        }
      });
    });
  });
}

// 处理 Markdown 文件内容
function processMarkdownFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log('无法读取文件: ' + err);
    }

    // 使用正则表达式匹配 <https://ryanc.cc> 形式的链接
    const updatedData = data.replace(/<https:\/\/[^\s]+>/g, match => {
      const url = match.slice(1, -1); // 去掉尖括号
      return `[${url}](${url})`;
    });

    // 将更新后的内容写回文件
    fs.writeFile(filePath, updatedData, 'utf8', err => {
      if (err) {
        return console.log('无法写入文件: ' + err);
      }
      console.log(`已处理文件: ${filePath}`);
    });
  });
}

// 开始扫描目录
readDirectory(directoryPath);
