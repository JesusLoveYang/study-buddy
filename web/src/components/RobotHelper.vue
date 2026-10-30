<template>
  <div class="robot" :class="{ flip: onRight }" :style="wrapStyle">
    <div class="robot-bubble" :class="{ show: show }">{{ tip }}</div>
    <div
      class="robot-body"
      :class="{ dragging: !!drag }"
      role="button"
      aria-label="拖动可移动，点我提示"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    >
      <svg viewBox="0 0 80 96" width="100%" height="100%">
        <defs>
          <linearGradient id="rb1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#eafff8" /><stop offset="1" stop-color="#9fe6cf" />
          </linearGradient>
          <linearGradient id="rb2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#7fe0c4" /><stop offset="1" stop-color="#38b18e" />
          </linearGradient>
        </defs>
        <g stroke="#3f8f78" stroke-width="2.4" stroke-linecap="round">
          <line x1="31" y1="15" x2="26" y2="5" />
          <line x1="49" y1="15" x2="54" y2="5" />
        </g>
        <circle cx="25" cy="3.5" r="3.4" fill="#ff9f43" />
        <circle cx="55" cy="3.5" r="3.4" fill="#ff9f43" />
        <rect x="8" y="30" width="6" height="14" rx="3" fill="#7fe0c4" stroke="#4bb696" stroke-width="1.4" />
        <rect x="66" y="30" width="6" height="14" rx="3" fill="#7fe0c4" stroke="#4bb696" stroke-width="1.4" />
        <rect x="14" y="16" width="52" height="40" rx="16" fill="url(#rb1)" stroke="#5cc4a6" stroke-width="2.4" />
        <rect x="21" y="26" width="38" height="20" rx="10" fill="#1f3d46" />
        <circle class="eye" cx="32" cy="36" r="4.8" fill="#5ef0c8" />
        <circle class="eye" cx="48" cy="36" r="4.8" fill="#5ef0c8" />
        <circle cx="30.4" cy="34.4" r="1.5" fill="#ffffff" />
        <circle cx="46.4" cy="34.4" r="1.5" fill="#ffffff" />
        <rect x="24" y="60" width="32" height="20" rx="9" fill="url(#rb2)" stroke="#3f9c82" stroke-width="2.2" />
        <circle cx="40" cy="70" r="4.2" fill="#eafff9" />
        <rect x="15" y="62" width="6" height="16" rx="3" fill="#8ce8cf" stroke="#3f9c82" stroke-width="1.6" />
        <g class="arm">
          <rect x="59" y="62" width="6" height="16" rx="3" fill="#8ce8cf" stroke="#3f9c82" stroke-width="1.6" />
          <circle cx="62" cy="62" r="3.8" fill="#eafff9" stroke="#3f9c82" stroke-width="1.6" />
        </g>
        <ellipse cx="40" cy="88" rx="17" ry="4" fill="#5ef0c8" opacity=".32" />
      </svg>
    </div>
  </div>
</template>

<script>
const POS_KEY = 'study-buddy:robot-pos'
const SZ = { w: 58, h: 72 }   // 机器人尺寸（与 CSS 一致）
const MARGIN = 6

export default {
  name: 'RobotHelper',
  props: {
    tip: { type: String, default: '' },
    show: { type: Boolean, default: false }
  },
  emits: ['tap'],
  data() {
    return {
      pos: { x: 8, y: 0 },
      drag: null,
      moved: false
    }
  },
  computed: {
    // 机器人靠右时，气泡翻到左边，避免超出屏幕
    onRight() {
      const w = window.innerWidth || 375
      return this.pos.x > w / 2
    },
    wrapStyle() {
      return { left: this.pos.x + 'px', top: this.pos.y + 'px', bottom: 'auto', right: 'auto' }
    }
  },
  mounted() {
    this.pos = this.restorePos()
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    clamp(p) {
      const maxX = (window.innerWidth || 375) - SZ.w - MARGIN
      const maxY = (window.innerHeight || 667) - SZ.h - MARGIN
      return {
        x: Math.min(Math.max(MARGIN, p.x), Math.max(MARGIN, maxX)),
        y: Math.min(Math.max(MARGIN, p.y), Math.max(MARGIN, maxY))
      }
    },
    defaultPos() {
      const vh = window.innerHeight || 667
      return this.clamp({ x: 8, y: vh - SZ.h - 14 })
    },
    restorePos() {
      try {
        const raw = window.localStorage.getItem(POS_KEY)
        if (raw) {
          const p = JSON.parse(raw)
          if (typeof p.x === 'number' && typeof p.y === 'number') return this.clamp(p)
        }
      } catch (e) {}
      return this.defaultPos()
    },
    savePos() {
      try { window.localStorage.setItem(POS_KEY, JSON.stringify(this.pos)) } catch (e) {}
    },
    onResize() {
      this.pos = this.clamp(this.pos)
      this.savePos()
    },

    onDown(e) {
      this.drag = {
        offsetX: e.clientX - this.pos.x,
        offsetY: e.clientY - this.pos.y,
        startX: e.clientX,
        startY: e.clientY
      }
      this.moved = false
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
    },
    onMove(e) {
      if (!this.drag) return
      const dx = e.clientX - this.drag.startX
      const dy = e.clientY - this.drag.startY
      if (!this.moved && Math.hypot(dx, dy) > 6) this.moved = true   // 超过 6px 才算拖动
      if (!this.moved) return
      this.pos = this.clamp({
        x: e.clientX - this.drag.offsetX,
        y: e.clientY - this.drag.offsetY
      })
    },
    onUp() {
      if (this.drag && !this.moved) this.$emit('tap')   // 没移动 = 点击
      if (this.moved) this.savePos()
      this.drag = null
    }
  }
}
</script>
