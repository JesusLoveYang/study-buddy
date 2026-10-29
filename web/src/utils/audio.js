// 音频管理器：预加载 + 复用，避免每次点击都重新下载 mp3
// 词数一多时用 preloadList 的 limit 控制首屏开销
const cache = new Map()

// 音频版本号：替换 mp3 后 +1，可让浏览器丢弃旧缓存
const AUDIO_VERSION = 1

function audioUrl(id) {
  return 'audio/' + id + '.mp3?v=' + AUDIO_VERSION
}

/** 预加载某个单词的发音（幂等，重复调用直接返回已有实例） */
export function preloadWord(id) {
  if (!id) return null
  const hit = cache.get(id)
  if (hit) return hit
  const audio = new Audio(audioUrl(id))
  audio.preload = 'auto'
  audio.volume = 1
  try { audio.load() } catch (e) {}
  cache.set(id, audio)
  return audio
}

/**
 * 批量预加载（带上限）
 * 词表很长时只加载前 limit 个，避免首屏一次拉几百个文件
 */
export function preloadList(ids, { limit = 12 } = {}) {
  const list = (ids || []).slice(0, limit)
  list.forEach(preloadWord)
  return list
}

/** 播放（已预加载则秒播；未预加载则即时加载并播放） */
export function playWord(id) {
  const audio = preloadWord(id)
  if (!audio) return
  try { audio.pause() } catch (e) {}
  try { audio.currentTime = 0 } catch (e) {}
  const p = audio.play()
  if (p && p.catch) p.catch(() => {})
}

/** 是否已预加载（调试用） */
export function isPreloaded(id) {
  return cache.has(id)
}

/** 已缓存数量（调试用） */
export function cachedCount() {
  return cache.size
}
