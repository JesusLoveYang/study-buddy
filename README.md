# 学习伙伴 · study-buddy

儿童英语单词学习小游戏：听真人发音 → 拼单词 → 找一找，带小机器人助手。

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | Vue 3 |
| 组件库 | Element Plus |
| 构建 | Vite 5 |
| 部署 | 纯静态（GitHub Pages） |

## 目录结构

```
index.html        入口，自动跳转 web/dist/
web/              Web 端【标准 Vite 工程】
  index.html      开发入口（npm run dev 使用，线上不要直接访问）
  package.json
  vite.config.js  base:'./'，outDir:'dist'
  src/
    main.js
    App.vue
    components/   GradeSelect / WordList / WordGame / WordIcon / RobotHelper
    data/words.js 年级 + 单词数据（改数据只动这里）
    styles/global.css
  public/audio/   发音源文件（构建时复制到 dist/audio）
  dist/           【构建产物 · GitHub Pages 部署目录】
    index.html
    static/       js / css
    audio/        单词发音 mp3
h5/               H5 / 小程序端【预留】
```

**线上地址**:`/web/dist/`(根路径 `/` 会自动跳过去)。
`/web/` 是 Vite 开发入口,里面引用的是 `/src/main.js`,只在本地 `npm run dev` 时有效。

## 本地开发

```bash
cd web
npm install
npm run dev      # 本地调试 http://localhost:5173
npm run build    # 构建到 web/dist（部署目录）
```

> 注意：在**没有 package.json 的目录**执行 npm，会向上找到用户目录下的旧 lockfile，
> 导致安装异常缓慢。务必在 `web/` 内执行。

## 已开放年级

| 年级 | 单词 |
|---|---|
| 🧸 幼儿园 | **spider, robot, ant, dragonfly** |
| 📗 一年级 | 预留（`ready: false`） |
| 📘 二年级 | 预留（`ready: false`） |
| 📙 三年级 | 预留（`ready: false`） |

> 当前只开放幼儿园 4 个单词。开放其他年级：在 `GRADES` 里把 `ready` 改 `true`，并在 `words` 里填单词 id。

## 新增单词

1. 放入音频：`web/public/audio/<id>.mp3`
2. 加数据：`web/src/data/words.js` 的 `WORDS` 追加一条
   ```js
   plane: { word: 'plane', zh: '飞机', emoji: '✈️', ph: '/pleɪn/', distract: '🚁' }
   ```
3. 加到年级：对应 `GRADES[].words` 数组里加 `'plane'`
4. 重新构建：`cd web && npm run build`

## 玩法

- **听一听**：播放真人发音
- **拼一拼**：按顺序点字母，拼对得 3 星
- **找一找**：9 宫格里找出当前单词的图标（其余是干扰图案），答对得 2 星
- **机器人**：点它要提示；连错 2 次自动高亮正确答案
