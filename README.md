# Vercel 移动端可用的 3D 手办站点方案

## 目录结构

```text
project/
├─ index.html
├─ package.json
├─ vercel.json
├─ src/
│  ├─ main.js
│  └─ style.css
└─ public/
   ├─ model-source.glb   # 你的原始模型
   ├─ model.glb          # 优化后的正式模型（桌面）
   └─ model-mobile.glb   # 可选：进一步压缩后的移动端模型
```

## 安装

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

## 优化模型

先把你的原始 GLB 重命名为 `public/model-source.glb`，然后执行：

```bash
npm run inspect:model
npm run optimize:model
```

默认方案只做 `WebP` 纹理压缩，不启用 Draco，这样不会额外依赖 Draco 解码器。
如果你确认网络环境稳定，才建议再试：

```bash
npm run optimize:model:draco
```

如果你还需要一个更小的移动端模型，可以在 `model.glb` 基础上再做一次人工减面，或单独导出一个低模版本命名为 `public/model-mobile.glb`。

## 部署到 Vercel

1. 把仓库推到 GitHub
2. Vercel 里导入该仓库
3. Framework Preset 选择 `Vite`
4. 直接部署

## 为什么这套方案比你现在的页面更稳

- 不再在浏览器里轮流尝试多个外部 CDN
- `@google/model-viewer` 通过 Vite 打包进你的站点资源
- 首屏先显示轻量封面，不急着在手机弱网下拉大模型
- 手机和弱网优先手动进入 3D，桌面端自动加载
- `vercel.json` 给 `.glb` 和构建产物加了长缓存
