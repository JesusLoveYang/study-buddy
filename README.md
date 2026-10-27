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

## 线上地址是怎么来的

GitHub Pages 的地址规则就是「仓库路径映射」:

```
https://<用户名>.github.io/<仓库名>/<仓库里的文件路径>
```

对应关系:

| 打开这个地址 | 实际访问的仓库文件 |
|---|---|
| `https://jesusloveyang.github.io/study-buddy/` | `index.html`（手写的跳转页） |
| `https://jesusloveyang.github.io/study-buddy/web/dist/` | `web/dist/index.html`（Vite 构建生成） |
| `.../web/dist/static/index-ClhIjxdg.js` | `web/dist/static/index-ClhIjxdg.js` |
| `.../web/dist/audio/ant.mp3` | `web/dist/audio/ant.mp3` |

几个关键点:

1. **目录地址会自动补 `index.html`**，所以 `/web/dist/` 等价于 `/web/dist/index.html`。
2. **没有绑定自定义域名**，所以固定是 `用户名.github.io/仓库名/...` 这种子路径形式。
   （想改成自己的域名：仓库根放 `CNAME` 文件 + DNS 加记录，HTTPS 也能自动签发）
3. **Pages 的发布源**在 Settings → Pages → Source：`main` 分支 `/ (root)`，
   意思是「把仓库根目录当网站根目录」，仓库里有什么路径，线上就是什么路径。

### `web/dist/index.html` 是构建产物

`npm run build` 时 Vite 做三件事:

- 以 `web/index.html` 为模板，注入**带 hash**的 `<script src="./static/index-xxxx.js">` 和 `<link href="./static/index-xxxx.css">`
- 把 `public/` 整个目录原样复制到 `dist/`（所以 `dist/audio/` 来自 `web/public/audio/`）
- 因为 `base: './'`，资源路径是相对路径，放在 `/web/dist/` 这种子目录下也能正确加载

文件名带 hash 的好处:内容一变文件名就变，浏览器不会拿旧缓存跑新页面。

### 根目录的 `index.html` 不是构建的

它是我手写的静态页:显示「正在进入…」并执行

```js
location.replace('./web/dist/')
```

作用是让短链接 `.../study-buddy/` 也能直接用，不用记 `/web/dist/`。
以后若想让**根路径**直接就是应用（地址里不带 `web/dist`），可以改用 GitHub Actions
构建后把 `dist` 发布到 Pages 根，见文末「可选：Actions 部署」。


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

## 可选：Actions 部署（根路径直接是应用）

如果不想地址里带 `web/dist`，可以让 GitHub Actions 每次推送自动构建，并把 `dist` 发布到 Pages 根。

`.github/workflows/deploy.yml`:

```yaml
name: Deploy web to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd web && npm ci
      - run: cd web && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: web/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

启用方式:Settings → Pages → Source 改成 `GitHub Actions`。

效果:`https://<用户名>.github.io/<仓库名>/` 直接就是应用，`web/dist` 只作为构建产物保留在仓库里（也可以改成不提交 dist）。
