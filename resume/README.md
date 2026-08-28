# 杨力诚 · 个人简历

一份带有粒子背景、光线撕裂开场、打字机、滚动动画、技能环形图、图片轮播等动态效果的个人简历。

纯静态站点（HTML + CSS + 原生 JS，无构建步骤），可直接托管在 GitHub Pages、Netlify、Vercel、Cloudflare Pages 等任何静态托管平台。

---

## 一、目录结构

```
.
├── index.html          # 入口页面
├── css/                # 样式
│   ├── variables.css   # 主题变量
│   ├── reset.css       # 重置
│   ├── layout.css      # 布局
│   ├── animations.css  # 动画关键帧
│   └── components.css  # 组件样式
├── js/                 # 脚本（按顺序在 index.html 中加载）
│   ├── config.js          # 个人信息数据
│   ├── utils.js           # 工具函数
│   ├── particles.js       # 粒子背景
│   ├── typing.js          # 打字机
│   ├── scroll.js          # 滚动动画 / 视差
│   ├── ring-chart.js      # 技能环形图
│   ├── card-tilt.js       # 卡片倾斜
│   ├── carousel.js        # 图片轮播
│   ├── tear-animation.js  # 光线撕裂开场
│   ├── theme.js           # 主题切换
│   ├── nav.js             # 导航
│   └── main.js            # 入口编排
├── assets/             # 图片
│   └── 1.jpg … 6.jpg
├── .nojekyll           # 告诉 GitHub Pages 不要用 Jekyll 处理
├── .gitattributes      # 强制 git 大小写敏感
├── .gitignore
└── netlify.toml        # Netlify 配置（可选）
```

---

## 二、本地预览

直接双击 `index.html` 用浏览器打开即可（用 `file://` 协议也能跑）。
更推荐用本地服务器，避免个别浏览器对 `file://` 的限制：

```bash
# 任选其一
python -m http.server 8000
npx serve .
```

然后访问 <http://localhost:8000>。

---

## 三、部署到 GitHub Pages

### 方式 A：通过网页上传（最简单）

1. 在 GitHub 新建一个仓库，比如 `resume`。
2. 把本目录下**所有文件和文件夹**（含 `.nojekyll`）上传到仓库根目录。
   - 注意：网页上传时点不到点开头的隐藏文件，请用下面的 git 命令方式，或者上传压缩包后用 GitHub Actions 解压。
3. 进入仓库 `Settings → Pages`。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main` / `master`，文件夹选 `/ (root)`，点 `Save`。
6. 等 1~2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/` 即可。

> 如果你的仓库名正好是 `<用户名>.github.io`，则地址为 `https://<用户名>.github.io/`。

### 方式 B：通过 git 命令（推荐）

```bash
cd 项目目录
git init
git config core.ignorecase false          # 关键：让 git 大小写敏感
git add .
git commit -m "init: resume site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 排错：如果打开后只有文字、没有动态效果

几乎都是以下三种原因之一：

1. **`.nojekyll` 没传上去**
   - 现象：GitHub Pages 默认用 Jekyll，可能忽略或重写某些资源。
   - 解决：把根目录的 `.nojekyll`（空文件即可）一起 push。本项目已经包含。

2. **文件名大小写不一致**
   - 现象：Windows / macOS 不区分大小写，本地能跑；GitHub Pages 跑在 Linux 上区分大小写，于是 `css/Variables.css` 和 `css/variables.css` 是两个文件，路径 404 → CSS/JS 加载失败 → 只有文字。
   - 解决：
     ```bash
     git config core.ignorecase false
     # 如果之前已经传错过，强制让 git 重新认识大小写：
     git mv -f css/Wrong.css css/right.css
     git commit -m "fix: 大小写"
     git push
     ```
   - 项目里的 `.gitattributes` 已经做了显式声明，可以预防。

3. **GitHub Pages 没启用 / 源选错了**
   - 现象：访问 `https://<用户名>.github.io/<仓库名>/` 出 404。
   - 解决：去 `Settings → Pages`，确认 `Branch` 选了正确的分支、文件夹是 `/ (root)`。

### 调试技巧

在 GitHub Pages 打开页面后按 `F12` 打开开发者工具：
- `Console` 看是否有红色报错（脚本加载失败 / 运行时错误）。
- `Network` 看 `css/`、`js/`、`assets/` 下文件是否 200 OK。
  - 如果有 404，对照浏览器地址栏的子路径检查文件名大小写。

---

## 四、部署到 Netlify（推荐：拖拽即用）

1. 打开 <https://app.netlify.com/drop>。
2. 把**整个项目文件夹**直接拖进去。
3. 几秒后就能拿到一个 `https://xxx.netlify.app` 的网址，直接可用。

如果想绑定到自己的 Netlify 站点：

1. 在 Netlify `Add new site → Import an existing project`，授权 GitHub 仓库。
2. 构建配置：
   - `Build command`：留空
   - `Publish directory`：`.`
3. `Deploy site`。

---

## 五、修改个人信息

所有文字内容集中在 [js/config.js](js/config.js) 的 `resumeData` 对象里，
图片在 [assets/](assets/) 目录里，HTML 中的图片引用对应 [index.html](index.html)。

替换图片时请保持文件名一致（`1.jpg` … `6.jpg`），否则需同步修改 HTML 中的 `src`。
