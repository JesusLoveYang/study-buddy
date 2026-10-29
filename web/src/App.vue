<template>
  <div class="app-root">
    <GradeSelect v-if="view === 'home'" :grades="grades" @pick="openGrade" />
    <WordList v-else-if="view === 'list'" :grade="grade" @back="view = 'home'" @open="openWord" />
    <WordGame v-else :item="item" :stars="stars" @back="view = 'list'" @add-stars="addStars" />
  </div>
</template>

<script>
import GradeSelect from './components/GradeSelect.vue'
import WordList from './components/WordList.vue'
import WordGame from './components/WordGame.vue'
import { GRADES, getWord } from './data/words'
import { preloadList, preloadWord } from './utils/audio'

// 首屏最多预加载多少个词的音频（词多了自动截断，不会拖慢打开速度）
const PRELOAD_LIMIT = 12

export default {
  name: 'App',
  components: { GradeSelect, WordList, WordGame },
  data() {
    return { view: 'home', grades: GRADES, grade: null, item: null, stars: 0 }
  },
  mounted() {
    // 只预加载第一个已开放年级的单词（有上限），不再全量拉
    const first = GRADES.find(g => g.ready)
    if (first) preloadList(first.words, { limit: PRELOAD_LIMIT })
  },
  methods: {
    openGrade(g) {
      if (!g.ready) return
      this.grade = g
      this.view = 'list'
      // 进入年级：预加载该年级的单词（最多 PRELOAD_LIMIT 个）
      preloadList(g.words, { limit: PRELOAD_LIMIT })
    },
    openWord(id) {
      this.item = getWord(id)
      this.view = 'game'
      // 进入单词：预加载当前词 + 列表中的下一个，翻词也秒响
      preloadWord(id)
      const list = (this.grade && this.grade.words) || []
      const i = list.indexOf(id)
      if (i >= 0 && list[i + 1]) preloadWord(list[i + 1])
    },
    addStars(n) {
      this.stars += n
    }
  }
}
</script>
