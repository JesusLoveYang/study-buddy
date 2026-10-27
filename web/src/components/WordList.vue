<template>
  <div class="page">
    <div class="bar">
      <el-button round size="small" @click="$emit('back')">← 返回</el-button>
      <div class="bar-title">{{ grade.emoji }} {{ grade.name }}</div>
      <span class="bar-right">{{ grade.words.length }} 词</span>
    </div>

    <div class="words">
      <button v-for="id in grade.words" :key="id" class="word-card" @click="$emit('open', id)">
        <span class="w-emoji"><WordIcon :item="word(id)" /></span>
        <span class="w-word">{{ word(id).word }}</span>
        <span class="w-zh">{{ word(id).zh }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getWord } from '../data/words'
import WordIcon from './WordIcon.vue'
export default {
  name: 'WordList',
  components: { WordIcon },
  props: { grade: { type: Object, required: true } },
  methods: {
    word(id) { return getWord(id) }
  }
}
</script>
