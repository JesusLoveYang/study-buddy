// 间隔复习（Leitner 盒子）—— 数据存 localStorage
const KEY = 'study-buddy:srs'

// 连续答对 1/2/3 次后，下次间隔（天）
const INTERVALS = { 1: 1, 2: 3, 3: 7 }
const MAX_BOX = 3

function pad(n) { return n < 10 ? '0' + n : '' + n }

export function todayStr(d) {
  const t = d || new Date()
  return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate())
}

function addDays(dateStr, days) {
  const p = dateStr.split('-').map(Number)
  const d = new Date(p[0], p[1] - 1, p[2])
  d.setDate(d.getDate() + days)
  return todayStr(d)
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) { return {} }
}

function save(state) {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) {}
}

/** 孩子第一次学某个词：建档，明天开始复习 */
export function touchWord(id) {
  if (!id) return
  const s = loadState()
  if (!s[id]) {
    s[id] = { box: 0, due: addDays(todayStr(), 1), right: 0, wrong: 0, learned: todayStr() }
    save(s)
  }
}

/** 今天到期的词 id 列表 */
export function dueIds() {
  const s = loadState()
  const t = todayStr()
  return Object.keys(s).filter(id => s[id].due <= t)
}

/** 已掌握（box 到顶）的数量 */
export function masteredCount() {
  const s = loadState()
  return Object.keys(s).filter(id => s[id].box >= MAX_BOX).length
}

/** 记录一次复习结果，返回该词的新状态 */
export function recordAnswer(id, correct) {
  const s = loadState()
  const t = todayStr()
  const rec = s[id] || { box: 0, due: t, right: 0, wrong: 0, learned: t }
  if (correct) {
    rec.right += 1
    rec.box = Math.min(rec.box + 1, MAX_BOX)
    rec.due = addDays(t, INTERVALS[rec.box] || 7)
  } else {
    rec.wrong += 1
    rec.box = 0
    rec.due = addDays(t, 1)
  }
  rec.last = t
  s[id] = rec
  save(s)
  return rec
}

/** 下次复习概览：{ tomorrow: n, later: n } */
export function nextSummary() {
  const s = loadState()
  const t = todayStr()
  const tomorrow = addDays(t, 1)
  let next = 0
  let later = 0
  Object.keys(s).forEach(id => {
    const d = s[id].due
    if (d === tomorrow) next += 1
    else if (d > tomorrow) later += 1
  })
  return { tomorrow: next, later }
}

/** 清空（调试用） */
export function resetSrs() {
  try { window.localStorage.removeItem(KEY) } catch (e) {}
}
