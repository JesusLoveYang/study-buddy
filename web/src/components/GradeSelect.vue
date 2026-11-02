<template>
  <div class="page home">
    <div class="hero">
      <div class="logo">📚</div>
      <h1>单词小课堂</h1>
      <p>选一个年级，开始今天的单词冒险</p>
    </div>

    <!-- 今日复习卡片（始终显示） -->
    <div class="review-card" :class="{ idle: due === 0 }">
      <div class="rc-row1">🔁 今日复习</div>

      <template v-if="due > 0">
        <div class="rc-big">还有 <b>{{ due }}</b> 个词要复习</div>
        <div class="rc-sub">约 1 分钟 · 之前学过的词</div>
        <button class="rc-btn" @click="$emit('start-review')">开始复习 →</button>
      </template>

      <template v-else>
        <div class="rc-big">今天没有要复习的词</div>
        <div class="rc-sub">
          已经掌握 {{ mastered }} 个 · 学个新词，明天来复习
        </div>
        <button class="rc-btn ghost" @click="$emit('learn-new')">去学新词 →</button>
      </template>
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
  props: {
    grades: { type: Array, required: true },
    due: { type: Number, default: 0 },
    mastered: { type: Number, default: 0 }
  },
  emits: ['pick', 'start-review', 'learn-new']
}
</script>
