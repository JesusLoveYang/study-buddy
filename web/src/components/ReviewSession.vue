<template>
  <div class="rv-page">
    <!-- 复习中 -->
    <template v-if="!finished">
      <div class="rv-top">
        <button class="rv-x" aria-label="退出复习" @click="$emit('exit')">✕</button>
        <div class="rv-prog"><i :style="{ width: progress + '%' }"></i></div>
        <span class="rv-star">⭐ {{ stars }}</span>
        <span class="rv-count">{{ index + 1 }} / {{ questions.length }}</span>
      </div>

      <div class="qbox">
        <div class="qtitle">听一听，点出对应的图</div>
        <button class="speaker" :class="{ ping: pinging }" @click="playCurrent">🔊</button>
        <button class="replay" @click="playCurrent">再听一次</button>

        <div class="opts">
          <button
            v-for="opt in current.options"
            :key="opt"
            class="opt"
            :class="optClass(opt)"
            @click="pick(opt)"
          ><WordIcon :item="wordOf(opt)" /></button>
        </div>
      </div>

      <div class="feedback" :class="[feedback.show ? 'show' : '', feedback.type]">{{ feedback.text }}</div>
    </template>

    <!-- 完成 -->
    <div v-else class="rv-done">
      <div class="em">🎉</div>
      <h2>今天复习完成</h2>
      <p>{{ doneText }}</p>

      <div class="stat">
        <div><b>{{ rightCount }}</b><span>答对</span></div>
        <div><b>{{ wrongCount }}</b><span>需加强</span></div>
        <div><b>{{ daysLater }}</b><span>天后再见</span></div>
      </div>

      <div class="next">
        📅 明天：<b>{{ summary.tomorrow }}</b> 个词要复习<br>
        📅 之后：<b>{{ summary.later }}</b> 个词在排队
      </div>

      <button class="rv-btn" @click="$emit('finish')">去学新词</button>
    </div>
  </div>
</template>

<script>
import WordIcon from './WordIcon.vue'
import { preloadWord, playWord } from '../utils/audio'
import { recordAnswer, nextSummary } from '../utils/srs'
import { WORDS, getWord } from '../data/words'

export default {
  name: 'ReviewSession',
  components: { WordIcon },
  props: {
    queue: { type: Array, required: true },   // 待复习的单词 id
    stars: { type: Number, default: 0 }
  },
  emits: ['exit', 'finish', 'add-stars'],
  data() {
    return {
      index: 0,
      questions: [],
      tries: 0,
      pickedWrong: '',
      revealed: false,
      rightCount: 0,
      wrongCount: 0,
      pinging: false,
      feedback: { show: false, type: '', text: '' },
      finished: false,
      summary: { tomorrow: 0, later: 0 }
    }
  },
  computed: {
    progress() { return (this.index / this.questions.length) * 100 },
    current() { return this.questions[this.index] || { id: '', options: [] } },
    doneText() {
      if (this.wrongCount === 0) return this.questions.length + ' 个词全部答对，太棒了！'
      return this.rightCount + ' 个答对，' + this.wrongCount + ' 个明天再考一次'
    },
    daysLater() {
      return this.wrongCount ? 1 : 2
    }
  },
  created() {
    this.buildQuestions()
  },
  mounted() {
    this.sayCurrent()
  },
  methods: {
    wordOf(id) { return getWord(id) },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const t = a[i]; a[i] = a[j]; a[j] = t
      }
      return a
    },
    buildQuestions() {
      const all = Object.keys(WORDS)
      this.questions = this.queue.slice(0, 8).map(id => {
        const others = this.shuffle(all.filter(x => x !== id)).slice(0, 3)
        return { id, options: this.shuffle([id, ...others]) }
      })
    },
    sayCurrent() {
      if (!this.current.id) return
      preloadWord(this.current.id)
      playWord(this.current.id)
      this.pinging = true
      setTimeout(() => { this.pinging = false }, 420)
    },
    playCurrent() { this.sayCurrent() },

    pick(opt) {
      if (this.revealed) return          // 已公布答案就不再响应
      const answer = this.current.id

      if (opt === answer) {
        // 答对（可能是第二次机会）
        const firstTry = this.tries === 0
        this.revealed = true
        this.rightCount++
        if (firstTry) this.$emit('add-stars', 1)
        recordAnswer(answer, true)
        this.setFeedback('ok', firstTry
          ? '✅ 对！' + answer + ' · ' + this.wordOf(answer).zh
          : '✅ 这次对了！' + answer + ' · ' + this.wordOf(answer).zh)
        setTimeout(() => this.next(), 900)
        return
      }

      // 答错
      if (this.tries === 0) {
        this.tries = 1
        this.pickedWrong = opt
        this.setFeedback('bad', '再听一次，试第二个 🙉')
        setTimeout(() => { if (this.pickedWrong === opt) this.pickedWrong = '' }, 500)
        setTimeout(() => this.playCurrent(), 500)
        return
      }

      // 两次都错 → 公布答案
      this.revealed = true
      this.wrongCount++
      recordAnswer(answer, false)
      this.setFeedback('bad', '💡 答案是 ' + answer + ' · ' + this.wordOf(answer).zh)
      setTimeout(() => this.playCurrent(), 400)
      setTimeout(() => this.next(), 2000)
    },

    optClass(opt) {
      if (this.revealed && opt === this.current.id) return 'right'
      if (this.pickedWrong === opt) return 'wrong'
      return ''
    },
    setFeedback(type, text) {
      this.feedback = { show: true, type, text }
    },
    next() {
      if (this.index + 1 >= this.questions.length) {
        this.summary = nextSummary()
        this.finished = true
        return
      }
      this.index++
      this.tries = 0
      this.pickedWrong = ''
      this.revealed = false
      this.feedback = { show: false, type: '', text: '' }
      this.sayCurrent()
    }
  }
}
</script>
