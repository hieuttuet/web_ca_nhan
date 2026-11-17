/**
 * Đồng bộ thư mục gốc (templates/, shared/, templates-catalog.js, index.html)
 * vào public/ trước khi chạy Next.js dev/build.
 * Giúp giữ nguyên 100% cấu trúc sửa file 3D hiện tại mà vẫn chạy chuẩn Next.js App Router.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pubDir = path.join(root, 'public');

fs.mkdirSync(pubDir, { recursive: true });

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(path.join(root, 'templates'), path.join(pubDir, 'templates'));
copyRecursive(path.join(root, 'shared'), path.join(pubDir, 'shared'));
copyRecursive(path.join(root, 'templates-catalog.js'), path.join(pubDir, 'templates-catalog.js'));
copyRecursive(path.join(root, 'index.html'), path.join(pubDir, 'home.html'));

console.log('[sync-public] Synced templates/, shared/, templates-catalog.js, and index.html -> public/');
