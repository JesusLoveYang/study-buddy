// 年级与单词数据：新增单词 = WORDS 加一条 + public/audio/<id>.mp3 + 年级 words 里加 id
// emoji 用于卡片/找一找；svg 可选（emoji 库里没有的形象，如蜻蜓）
// distract = 「找一找」里的干扰图标（其他格子都用它）
export const GRADES = [
  { id: 'kg', name: '幼儿园', emoji: '🧸', ready: true,  words: ['spider', 'robot', 'ant', 'dragonfly'] },
  { id: 'g1', name: '一年级', emoji: '📗', ready: false, words: [] },
  { id: 'g2', name: '二年级', emoji: '📘', ready: false, words: [] },
  { id: 'g3', name: '三年级', emoji: '📙', ready: false, words: [] }
]

// 手绘蜻蜓（Unicode 没有蜻蜓 emoji）
const DRAGONFLY_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="rgba(160,215,255,.72)" stroke="#5fa8d8" stroke-width="2.2">
    <ellipse cx="70" cy="33" rx="21" ry="7.5" transform="rotate(-18 70 33)"/>
    <ellipse cx="30" cy="33" rx="21" ry="7.5" transform="rotate(18 30 33)"/>
    <ellipse cx="68" cy="50" rx="17" ry="6" transform="rotate(12 68 50)"/>
    <ellipse cx="32" cy="50" rx="17" ry="6" transform="rotate(-12 32 50)"/>
  </g>
  <g stroke="#3f6b96" stroke-width="2" stroke-linecap="round">
    <line x1="45" y1="15" x2="38" y2="6"/>
    <line x1="55" y1="15" x2="62" y2="6"/>
  </g>
  <path d="M50 44 C57 54 55 70 52 84 L50 92 L48 84 C45 70 43 54 50 44 Z" fill="#4f8dc4"/>
  <path d="M50 50 C54 60 53 72 51 84" stroke="#3c76a9" stroke-width="1.6" fill="none" opacity=".7"/>
  <ellipse cx="50" cy="41" rx="8.5" ry="9.5" fill="#5fa2da"/>
  <circle cx="50" cy="23" r="10" fill="#67aee6"/>
  <circle cx="45" cy="20" r="5.6" fill="#1f3550"/>
  <circle cx="55" cy="20" r="5.6" fill="#1f3550"/>
  <circle cx="43.2" cy="18.2" r="1.7" fill="#ffffff"/>
  <circle cx="53.2" cy="18.2" r="1.7" fill="#ffffff"/>
</svg>`

export const WORDS = {
  spider:    { word: 'spider',    zh: '蜘蛛',   emoji: '🕷️', ph: '/ˈspaɪdər/',    distract: '🐞' },
  robot:     { word: 'robot',     zh: '机器人', emoji: '🤖', ph: '/ˈroʊbɑːt/',    distract: '👾' },
  ant:       { word: 'ant',       zh: '蚂蚁',   emoji: '🐜', ph: '/ænt/',         distract: '🐝' },
  dragonfly: { word: 'dragonfly', zh: '蜻蜓',   emoji: '🪰', ph: '/ˈdræɡənflaɪ/', distract: '🦋', svg: DRAGONFLY_SVG }
}

export function getWord(id) {
  return { id, ...(WORDS[id] || {}) }
}
