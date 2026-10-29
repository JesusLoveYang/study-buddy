// 音频管理：进入单词页时预加载该词，点击时复用同一实例直接播
const cache = new Map()

// 替换 mp3 后把版本号 +1，可让浏览器丢弃旧缓存
const AUDIO_VERSION = 1

/** 预加载某个单词的发音（幂等） */
export function preloadWord(id) {
  if (!id) return null
  const hit = cache.get(id)
  if (hit) return hit
  const audio = new Audio('audio/' + id + '.mp3?v=' + AUDIO_VERSION)
  audio.preload = 'auto'
  audio.volume = 1
  try { audio.load() } catch (e) {}
  cache.set(id, audio)
  return audio
}

/** 播放：已预加载则秒播，未预加载则即时加载后播放 */
export function playWord(id) {
  const audio = preloadWord(id)
  if (!audio) return
  try { audio.pause() } catch (e) {}
  try { audio.currentTime = 0 } catch (e) {}
  const p = audio.play()
  if (p && p.catch) p.catch(() => {})
}
