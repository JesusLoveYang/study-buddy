// 音频管理器：预加载 + 复用，避免每次点击都重新下载 mp3
const cache = new Map()

/** 预加载某个单词的发音（幂等） */
export function preloadWord(id) {
  if (!id) return null
  const hit = cache.get(id)
  if (hit) return hit
  const audio = new Audio('audio/' + id + '.mp3')
  audio.preload = 'auto'
  audio.volume = 1
  // 触发浏览器开始下载，但不播放
  try { audio.load() } catch (e) {}
  cache.set(id, audio)
  return audio
}

/** 预加载一组单词 */
export function preloadAll(ids) {
  (ids || []).forEach(preloadWord)
}

/** 播放（已预加载则秒播） */
export function playWord(id) {
  const audio = preloadWord(id)
  if (!audio) return
  try { audio.pause() } catch (e) {}
  try { audio.currentTime = 0 } catch (e) {}
  const p = audio.play()
  if (p && p.catch) p.catch(() => {})
}
