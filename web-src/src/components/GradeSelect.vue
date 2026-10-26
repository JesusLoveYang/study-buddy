<template>
  <div class="page home">
    <div class="hero">
      <div class="logo">📚</div>
      <h1>单词小课堂</h1>
      <p>选一个年级，开始今天的单词冒险</p>
    </div>

    <div class="grades">
      <button
        v-for="g in grades" :key="g.id"
        class="grade-card" :class="{ locked: !g.ready }"
        :disabled="!g.ready" @click="$emit('pick', g)">
        <span class="g-emoji">{{ g.emoji }}</span>
        <span class="g-name">{{ g.name }}</span>
        <span v-if="g.ready" class="g-meta">{{ g.words.length }} 个单词</span>
        <span v-else class="g-meta soon">即将上线</span>
      </button>
    </div>

    <p class="foot">声音为真实发音 · 手机/平板打开效果最佳</p>
  </div>
</template>

<script>
export default {
  name: 'GradeSelect',
  props: { grades: { type: Array, required: true } }
}
</script>
