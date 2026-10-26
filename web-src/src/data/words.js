// 年级与单词数据：新增单词 = WORDS 加一条 + public/audio/<id>.mp3 + 年级 words 里加 id
export const GRADES = [
  { id: 'kg', name: '幼儿园', emoji: '🧸', ready: true,  words: ['spider', 'robot', 'ant', 'dragonfly'] },
  { id: 'g1', name: '一年级', emoji: '📗', ready: false, words: [] },
  { id: 'g2', name: '二年级', emoji: '📘', ready: false, words: [] },
  { id: 'g3', name: '三年级', emoji: '📙', ready: false, words: [] }
]

export const WORDS = {
  spider:    { word: 'spider',    zh: '蜘蛛',   emoji: '🕷️', ph: '/ˈspaɪdər/',     odd: '🐞' },
  robot:     { word: 'robot',     zh: '机器人', emoji: '🤖', ph: '/ˈroʊbɑːt/',     odd: '👾' },
  ant:       { word: 'ant',       zh: '蚂蚁',   emoji: '🐜', ph: '/ænt/',          odd: '🐝' },
  dragonfly: { word: 'dragonfly', zh: '蜻蜓',   emoji: '🪰', ph: '/ˈdræɡənflaɪ/',  odd: '🦋' }
}

export function getWord(id) {
  return { id, ...(WORDS[id] || {}) }
}
