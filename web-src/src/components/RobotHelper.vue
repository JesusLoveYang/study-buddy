<template>
  <div class="robot">
    <div class="robot-bubble" :class="{ show: show }">{{ tip }}</div>
    <div class="robot-body" role="button" aria-label="点我提示" @click="$emit('tap')">
      <svg viewBox="0 0 80 96" width="100%" height="100%">
        <defs>
          <linearGradient id="rb1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#eafff8" /><stop offset="1" stop-color="#9fe6cf" />
          </linearGradient>
          <linearGradient id="rb2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#7fe0c4" /><stop offset="1" stop-color="#38b18e" />
          </linearGradient>
        </defs>
        <!-- 两根天线 -->
        <g stroke="#3f8f78" stroke-width="2.4" stroke-linecap="round">
          <line x1="31" y1="15" x2="26" y2="5" />
          <line x1="49" y1="15" x2="54" y2="5" />
        </g>
        <circle cx="25" cy="3.5" r="3.4" fill="#ff9f43" />
        <circle cx="55" cy="3.5" r="3.4" fill="#ff9f43" />
        <!-- 侧耳 -->
        <rect x="8" y="30" width="6" height="14" rx="3" fill="#7fe0c4" stroke="#4bb696" stroke-width="1.4" />
        <rect x="66" y="30" width="6" height="14" rx="3" fill="#7fe0c4" stroke="#4bb696" stroke-width="1.4" />
        <!-- 头 -->
        <rect x="14" y="16" width="52" height="40" rx="16" fill="url(#rb1)" stroke="#5cc4a6" stroke-width="2.4" />
        <!-- 面罩 + 眼睛 -->
        <rect x="21" y="26" width="38" height="20" rx="10" fill="#1f3d46" />
        <circle class="eye" cx="32" cy="36" r="4.8" fill="#5ef0c8" />
        <circle class="eye" cx="48" cy="36" r="4.8" fill="#5ef0c8" />
        <circle cx="30.4" cy="34.4" r="1.5" fill="#ffffff" />
        <circle cx="46.4" cy="34.4" r="1.5" fill="#ffffff" />
        <!-- 身体 -->
        <rect x="24" y="60" width="32" height="20" rx="9" fill="url(#rb2)" stroke="#3f9c82" stroke-width="2.2" />
        <circle cx="40" cy="70" r="4.2" fill="#eafff9" />
        <!-- 左臂 -->
        <rect x="15" y="62" width="6" height="16" rx="3" fill="#8ce8cf" stroke="#3f9c82" stroke-width="1.6" />
        <!-- 挥手手臂 -->
        <g class="arm">
          <rect x="59" y="62" width="6" height="16" rx="3" fill="#8ce8cf" stroke="#3f9c82" stroke-width="1.6" />
          <circle cx="62" cy="62" r="3.8" fill="#eafff9" stroke="#3f9c82" stroke-width="1.6" />
        </g>
        <!-- 悬浮光 -->
        <ellipse cx="40" cy="88" rx="17" ry="4" fill="#5ef0c8" opacity=".32" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RobotHelper',
  props: {
    tip: { type: String, default: '' },
    show: { type: Boolean, default: false }
  },
  emits: ['tap']
}
</script>
