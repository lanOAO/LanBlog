/**
 * 自动提取 Hexo 文章中出现的字符，并使用 Fontmin 生成最小字体集
 * 使用方式： node scripts/fontmin-auto.js
 */

import fs from 'fs';
import path from 'path';
import Fontmin from 'fontmin';

// 1️⃣ 扫描博客 所有 .md 文件
const postsDir = path.join(process.cwd(),'..','..','source');
const fontSrcDir = path.join(process.cwd(),'..', 'fonts');
const fontDestDir = path.join(fontSrcDir, 'build');

// 提取文本的正则（中英文、数字、常见标点）
const CHAR_FILTER = /[\u4e00-\u9fa5a-zA-Z0-9.,;:!?'"“”‘’—\-_=+()/\\[\]{}<>@#￥%……&*·、。\s]/g;

// 读取目录下所有 md 文件内容
function readAllText(dir) {
  let text = '';
  if (!fs.existsSync(dir)) return text;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      text += readAllText(filePath);
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      text += content;
    }
  }
  return text;
}

// 提取出现的字符集合
function extractCharacters(text) {
  const matches = text.match(CHAR_FILTER) || [];
  const uniqueChars = Array.from(new Set(matches));
  return uniqueChars.join('');
}

// 2️⃣ 主函数
(async () => {
  console.log('🔍 正在扫描 Markdown 文件...');
  const text = readAllText(postsDir);
  const subset = extractCharacters(text);

  console.log(`✅ 提取到 ${subset.length} 个独特字符`);
  if (!fs.existsSync(fontDestDir)) fs.mkdirSync(fontDestDir, { recursive: true });

  // 3️⃣ 运行 Fontmin
  const fontmin = new Fontmin()
    .src(path.join(fontSrcDir, '*.ttf'))
    .use(Fontmin.glyph({ text: subset }))
    .use(Fontmin.ttf2woff())
    .use(Fontmin.ttf2woff2())
    .dest(fontDestDir);

  fontmin.run(err => {
    if (err) throw err;
    console.log('🎉 字体子集化与压缩完成！输出目录：', fontDestDir);
  });
})();
