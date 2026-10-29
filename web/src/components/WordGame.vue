<template>
  <div class="page game">
    <div class="bar">
      <el-button round size="small" @click="$emit('back')">← 返回</el-button>
      <div class="bar-title">{{ item.word }}</div>
      <el-tag type="warning" effect="light" class="star-tag">⭐ {{ stars }}</el-tag>
    </div>

    <el-card class="hero-card" shadow="always">
      <div class="emoji" role="button" aria-label="点图标听发音" @click="sayAndStar"><WordIcon :item="item" /></div>
      <div class="word" role="button" aria-label="点单词听发音" @click="sayAndStar">{{ item.word }}</div>
      <div class="ph">{{ item.ph }}</div>
      <span class="zh">{{ item.zh }}</span>

      <div class="actions">
        <el-button class="btn-say" @click="sayAndStar">🔊 听一听</el-button>
        <el-button class="btn-spell" @click="openSpell">🔤 拼一拼</el-button>
        <el-button class="btn-find" @click="openFind">🔍 找一找</el-button>
      </div>
      <div class="tipbox">点「听一听」听真人发音 · 卡住了点左下角小机器人 🤖</div>
    </el-card>

    <el-dialog v-model="spellVisible" width="86%" :show-close="false" :close-on-click-modal="false">
      <template #header>
        <div class="dlg-title">
          <span class="dlg-label">按顺序拼出</span>
          <b class="dlg-word">{{ item.word }}</b>
        </div>
      </template>
      <div class="slots">
        <div v-for="(s, i) in letters" :key="'s' + i" class="slot" :class="{ filled: i < index }">
          {{ i < index ? s : '' }}
        </div>
      </div>
      <div class="tiles">
        <button v-for="(t, i) in tiles" :key="'t' + i" class="tile"
                :class="{ used: t.used, hint: t.hint, shake: t.shake }" @click="pickTile(i)">{{ t.ch }}</button>
      </div>
      <div class="dialog-foot">
        <el-button round @click="resetSpell">重新来</el-button>
        <el-button round type="primary" @click="spellVisible = false">回到单词</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="findVisible" width="86%" :show-close="false" :close-on-click-modal="false">
      <template #header>
        <div class="dlg-title">
          <span class="dlg-label">找出</span>
          <b class="dlg-word">{{ item.word }}</b>
          <span class="dlg-sub">{{ item.zh }}</span>
        </div>
      </template>
      <div class="buggrid">
        <div v-for="(c, i) in findGrid" :key="'c' + i" class="cell"
             :style="{ '--d': c.delay }"
             :class="{ found: c.found, hintcell: c.hint, shake: c.shake }" @click="pickFind(i)"><WordIcon :item="c.item" /></div>
      </div>
      <div class="find-msg">{{ findMsg }}</div>
      <div class="dialog-foot">
        <el-button round type="primary" @click="findVisible = false">回到单词</el-button>
      </div>
    </el-dialog>

    <RobotHelper :tip="robotTip" :show="robotShow" @tap="robotTap" />
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import RobotHelper from './RobotHelper.vue'
import WordIcon from './WordIcon.vue'

export default {
  name: 'WordGame',
  components: { RobotHelper, WordIcon },
  props: {
    item: { type: Object, required: true },
    stars: { type: Number, default: 0 }
  },
  emits: ['back', 'add-stars'],
  data() {
    return {
      spellVisible: false,
      findVisible: false,
      index: 0,
      tiles: [],
      spellWrong: 0,
      findGrid: [],
      findTarget: -1,
      findWrong: 0,
      findMsg: '',
      robotTip: '',
      robotShow: false,
      audio: null,
      timer: null
    }
  },
  computed: {
    letters() { return this.item.word.split('') }
  },
  mounted() {
    this.robotSay('嗨！我是小机器人，点我可以要提示 🤖', 4200)
  },
  beforeUnmount() {
    clearTimeout(this.timer)
    if (this.audio) { try { this.audio.pause() } catch (e) {} }
  },
  watch: {
    item() {
      this.index = 0
      this.tiles = []
      this.spellWrong = 0
      this.robotSay('现在学 ' + this.item.word + '（' + this.item.zh + '）', 3000)
    }
  },
  methods: {
    say() {
      try {
        if (this.audio) { try { this.audio.pause() } catch (e) {} }
        this.audio = new Audio('audio/' + this.item.id + '.mp3')
        this.audio.volume = 1
        const p = this.audio.play()
        if (p && p.catch) p.catch(() => {})
      } catch (e) {}
    },
    // 用户主动点发音：播放 + 星星 +1（程序内自动播放仍用 say，不计星）
    sayAndStar() {
      this.say()
      this.$emit('add-stars', 1)
    },
    robotSay(t, ms) {
      this.robotTip = t
      this.robotShow = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => { this.robotShow = false }, ms || 3000)
    },
    robotTap() {
      if (this.findVisible) return this.findHint()
      if (this.spellVisible) return this.spellHint()
      this.robotSay('点「听一听」听 ' + this.item.word + ' 的发音，或点「拼一拼」练拼写')
    },

    resetSpell() {
      this.index = 0
      this.spellWrong = 0
      const pool = this.item.word.split('').concat(['a', 'o', 'm'])
        .map(ch => ({ ch, used: false, hint: false, shake: false }))
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp
      }
      this.tiles = pool
    },
    openSpell() {
      this.resetSpell()
      this.spellVisible = true
      this.say()
      this.robotSay('按 ' + this.item.word.split('').join('-') + ' 的顺序点字母')
    },
    pickTile(i) {
      const t = this.tiles[i]
      if (!t || t.used) return
      const need = this.item.word[this.index]
      if (t.ch === need) {
        t.used = true
        this.index++
        if (this.index === this.item.word.length) {
          this.$emit('add-stars', 3)
          this.robotSay('拼对啦！你拼出了 ' + this.item.word + ' 🎉', 3200)
          ElMessage({ message: '太棒了！' + this.item.word + ' 🎉', type: 'success', duration: 1200 })
          this.say()
          setTimeout(() => { if (this.spellVisible) this.resetSpell() }, 1600)
        }
      } else {
        t.shake = true
        setTimeout(() => { t.shake = false }, 420)
        this.spellWrong++
        if (this.spellWrong >= 2) { this.spellWrong = 0; setTimeout(() => this.spellHint(), 420) }
      }
    },
    spellHint() {
      if (!this.spellVisible) return
      const need = this.item.word[this.index]
      if (!need) { this.robotSay('已经拼完啦，点「重新来」再练一次'); return }
      this.robotSay('小提示：下一位是「' + need + '」')
      const t = this.tiles.find(x => x.ch === need && !x.used)
      if (t) { t.hint = true; setTimeout(() => { t.hint = false }, 2400) }
    },

    openFind() {
      this.buildFind()
      this.findVisible = true
      this.robotSay('找一找：哪一个才是「' + this.item.word + ' ' + this.item.zh + '」？')
    },
    buildFind() {
      this.findWrong = 0
      this.findMsg = ''
      const n = 9
      const target = Math.floor(Math.random() * n)
      this.findTarget = target
      this.findGrid = Array.from({ length: n }, (_, i) => ({
        item: i === target ? this.item : { emoji: this.item.distract },
        isTarget: i === target,
        found: false, hint: false, shake: false,
        delay: (i * 0.17).toFixed(2) + 's'
      }))
    },
    pickFind(i) {
      const c = this.findGrid[i]
      if (!c || c.found) return
      if (c.isTarget) {
        c.found = true
        this.$emit('add-stars', 2)
        this.findMsg = '✅ 正确！再来一局…'
        this.robotSay('找到 ' + this.item.word + ' 啦！🎯', 2600)
        this.say()
        setTimeout(() => { if (this.findVisible) this.buildFind() }, 1300)
      } else {
        c.shake = true
        setTimeout(() => { c.shake = false }, 420)
        this.findMsg = '那不是' + this.item.word + '，再看看～'
        this.findWrong++
        if (this.findWrong >= 2) { this.findWrong = 0; setTimeout(() => this.findHint(), 420) }
      }
    },
    findHint() {
      if (!this.findVisible) return
      const c = this.findGrid[this.findTarget]
      if (c) { c.hint = true; setTimeout(() => { c.hint = false }, 2400) }
      this.robotSay('看仔细，找 ' + this.item.word + '（' + this.item.zh + '）')
    }
  }
}
</script>
