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
import { GRADES, WORDS, getWord } from './data/words'
import { preloadAll } from './utils/audio'

export default {
  name: 'App',
  components: { GradeSelect, WordList, WordGame },
  data() {
    return { view: 'home', grades: GRADES, grade: null, item: null, stars: 0 }
  },
  mounted() {
    // 进入页面就把所有单词发音预加载好，点下去即响
    preloadAll(Object.keys(WORDS))
  },
  methods: {
    openGrade(g) {
      if (!g.ready) return
      this.grade = g
      this.view = 'list'
    },
    openWord(id) {
      this.item = getWord(id)
      this.view = 'game'
    },
    addStars(n) {
      this.stars += n
    }
  }
}
</script>
