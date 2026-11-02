<template>
  <div class="app-root">
    <GradeSelect
      v-if="view === 'home'"
      :grades="grades"
      :due="dueCount"
      :mastered="mastered"
      @pick="openGrade"
      @start-review="startReview"
      @learn-new="scrollToGrades"
    />
    <WordList v-else-if="view === 'list'" :grade="grade" @back="view = 'home'" @open="openWord" />
    <WordGame v-else-if="view === 'game'" :item="item" :stars="stars" @back="view = 'list'" @add-stars="addStars" />
    <ReviewSession
      v-else-if="view === 'review'"
      :queue="reviewQueue"
      :stars="stars"
      @exit="view = 'home'"
      @finish="finishReview"
      @add-stars="addStars"
    />
  </div>
</template>

<script>
import GradeSelect from './components/GradeSelect.vue'
import WordList from './components/WordList.vue'
import WordGame from './components/WordGame.vue'
import ReviewSession from './components/ReviewSession.vue'
import { GRADES, getWord } from './data/words'
import { touchWord, dueIds, masteredCount } from './utils/srs'

export default {
  name: 'App',
  components: { GradeSelect, WordList, WordGame, ReviewSession },
  data() {
    return {
      view: 'home',
      grades: GRADES,
      grade: null,
      item: null,
      stars: 0,
      dueCount: 0,
      mastered: 0,
      reviewQueue: []
    }
  },
  mounted() {
    this.refreshDue()
  },
  methods: {
    refreshDue() {
      this.dueCount = dueIds().length
      this.mastered = masteredCount()
    },
    openGrade(g) {
      if (!g.ready) return
      this.grade = g
      this.view = 'list'
    },
    openWord(id) {
      this.item = getWord(id)
      this.stars = 0
      this.view = 'game'
      touchWord(id)          // 第一次学的词，明天进复习队列
      this.refreshDue()
    },
    addStars(n) {
      this.stars += n
    },
    startReview() {
      const ids = dueIds()
      if (!ids.length) return
      this.reviewQueue = ids
      this.stars = 0
      this.view = 'review'
    },
    finishReview() {
      this.view = 'home'
      this.refreshDue()
    },
    scrollToGrades() {
      const el = document.querySelector('.grades')
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
</script>
