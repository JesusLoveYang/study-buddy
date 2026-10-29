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

export default {
  name: 'App',
  components: { GradeSelect, WordList, WordGame },
  data() {
    return { view: 'home', grades: GRADES, grade: null, item: null, stars: 0 }
  },
  methods: {
    openGrade(g) {
      if (!g.ready) return
      this.grade = g
      this.view = 'list'
    },
    openWord(id) {
      this.item = getWord(id)
      this.stars = 0        // 每次进入单词页，星星重新计
      this.view = 'game'
    },
    addStars(n) {
      this.stars += n
    }
  }
}
</script>
