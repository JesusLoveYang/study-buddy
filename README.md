# 学习伙伴 · study-buddy

儿童英语单词学习小游戏：听真人发音 → 拼单词 → 找一找，带小机器人助手。

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | Vue 3 |
| 组件库 | Element Plus |
| 构建 | Vite 5 |
| 部署 | GitHub Actions → GitHub Pages |

## 线上地址

**https://jesusloveyang.github.io/study-buddy/**

推送到 `main` 分支会自动构建并发布，地址就是仓库根路径。

## 目录结构

```
.github/
  workflows/deploy.yml   推送到 main 自动构建 + 发布 Pages
README.md
web/                     Web 端【标准 Vite 工程】
  index.html             开发入口（npm run dev 使用）
  package.json
  package-lock.json      锁定依赖版本，CI 用 npm ci
  vite.config.js         base:'./'，outDir:'dist'
  src/
    main.js
    App.vue
    components/          GradeSelect / WordList / WordGame / WordIcon / RobotHelper
    data/words.js        年级 + 单词数据（改数据只动这里）
    styles/global.css
  public/audio/          发音源文件（构建时复制到 dist/audio）
  dist/                  构建产物（CI 生成，已 gitignore）
h5/                      H5 / 小程序端【预留】
```

## 本地开发

```bash
cd web
npm install
npm run dev      # 本地调试 http://localhost:5173
npm run build    # 构建到 web/dist，可用 npm run preview 预览
```

> 注意：在**没有 package.json 的目录**执行 npm，会向上找到用户目录下的旧 lockfile，
> 导致安装异常缓慢。务必在 `web/` 内执行。

## 部署

1. 代码推到 `main`
2. GitHub Actions 执行 `.github/workflows/deploy.yml`：
   `cd web && npm ci && npm run build` → 上传 `web/dist` 作为 Pages 站点根
3. 发布后访问 `https://jesusloveyang.github.io/study-buddy/`

首次配置：仓库 Settings → Pages → Source 选择 **GitHub Actions**。
之后不需要手动 build，也不要把 `dist` 提交进仓库。

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
4. 推送到 `main`，Actions 会自动构建发布（本地验证可先 `npm run build`）

## 音频预加载策略

单词音频放在 `web/public/audio/<id>.mp3`，由 `web/src/utils/audio.js` 统一管理。

| 机制 | 说明 |
|---|---|
| 预加载 | `preloadWord(id)` 创建 `Audio` 对象并 `load()`，**复用同一实例**，点击即响 |
| 批量上限 | `preloadList(ids, { limit: 12 })`，词表再长也只加载前 12 个 |
| 进入年级 | 预加载该年级的单词（上限 12） |
| 进入单词 | 预加载当前词 + 列表中的下一个 |
| 缓存版本 | `audio/<id>.mp3?v=1`，替换音频后把 `AUDIO_VERSION` +1 即可刷新缓存 |

调整首屏开销：改 `src/App.vue` 里的 `PRELOAD_LIMIT`。
词数超过 100 时建议只预加载当前词 + 相邻词（把 `PRELOAD_LIMIT` 设成 3 即可）。

## 玩法

- **听一听**：播放真人发音（点上方大图标同样能发音）
- **拼一拼**：按顺序点字母，拼对得 3 星
- **找一找**：9 宫格里找出当前单词的图标（其余是干扰图案），答对得 2 星
- **机器人**：点它要提示；连错 2 次自动高亮正确答案
