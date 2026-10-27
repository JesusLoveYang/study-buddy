<template>
  <span class="word-icon" v-html="content"></span>
</template>

<script>
export default {
  name: 'WordIcon',
  props: { item: { type: Object, default: () => ({}) } },
  computed: {
    content() {
      const it = this.item || {}
      return it.svg ? it.svg : (it.emoji || '')
    }
  }
}
</script>
