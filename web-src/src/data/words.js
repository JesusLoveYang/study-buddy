// 年级与单词数据：新增单词 = WORDS 加一条 + public/audio/<id>.mp3 + 年级 words 里加 id
export const GRADES = [
  { id: 'kg', name: '幼儿园', emoji: '🧸', ready: true,  words: ['spider', 'robot'] },
  { id: 'g1', name: '一年级', emoji: '📗', ready: true,  words: ['apple', 'banana', 'cat', 'dog', 'fish', 'bird'] },
  { id: 'g2', name: '二年级', emoji: '📘', ready: false, words: [] },
  { id: 'g3', name: '三年级', emoji: '📙', ready: false, words: [] }
]

export const WORDS = {
  spider: { word: 'spider', zh: '蜘蛛',   emoji: '🕷️', ph: '/ˈspaɪdər/', odd: '🐞' },
  robot:  { word: 'robot',  zh: '机器人', emoji: '🤖', ph: '/ˈroʊbɑːt/', odd: '👾' },
  apple:  { word: 'apple',  zh: '苹果',   emoji: '🍎', ph: '/ˈæpl/',     odd: '🍐' },
  banana: { word: 'banana', zh: '香蕉',   emoji: '🍌', ph: '/bəˈnɑːnə/', odd: '🍋' },
  cat:    { word: 'cat',    zh: '猫',     emoji: '🐱', ph: '/kæt/',      odd: '🐶' },
  dog:    { word: 'dog',    zh: '狗',     emoji: '🐶', ph: '/dɔːɡ/',     odd: '🐱' },
  fish:   { word: 'fish',   zh: '鱼',     emoji: '🐟', ph: '/fɪʃ/',      odd: '🐠' },
  bird:   { word: 'bird',   zh: '鸟',     emoji: '🐦', ph: '/bɜːrd/',    odd: '🦆' }
}

export function getWord(id) {
  return { id, ...(WORDS[id] || {}) }
}
