# 单词小课堂

儿童英语单词学习小游戏：听发音 → 拼单词 → 找不同，带小机器人助手。

## 目录

```
index.html      入口（自动跳转 web/）
web/            Web 端（Vue 2 + Element-UI，vue-cli 工程 + 构建产物）
  src/          源码
  dist 产物      index.html / static / audio
h5/             H5 / 小程序端（预留）
```

## Web 端开发

```bash
cd web
npm install
npm run dev      # 本地开发
npm run build    # 构建到 dist/
```

构建后把 `web/dist/*` 复制到 `web/` 根，即为线上版本（GitHub Pages 直接托管）。

## 已开放年级

| 年级 | 单词 |
|---|---|
| 幼儿园 | spider, robot |
| 一年级 | apple, banana, cat, dog, fish, bird |
| 二年级 / 三年级 | 预留（`ready:false`） |

## 新增单词

1. `web/public/audio/<id>.mp3` 放入发音
2. `web/src/data/words.js` 的 `WORDS` 加一条
3. 对应年级的 `words` 数组加 id
