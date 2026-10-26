<template>
  <div class="robot">
    <div class="robot-bubble" :class="{ show: show }">{{ tip }}</div>
    <div class="robot-body" role="button" aria-label="点我提示" @click="$emit('tap')">
      <svg viewBox="0 0 72 88" width="100%" height="100%">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#dff0ff" /><stop offset="1" stop-color="#9cc6f2" />
          </linearGradient>
          <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#a9d3ff" /><stop offset="1" stop-color="#6aa6ff" />
          </linearGradient>
        </defs>
        <line x1="36" y1="12" x2="36" y2="3" stroke="#5d7fa8" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="36" cy="3" r="3.4" fill="#ff8fb1" />
        <rect x="12" y="12" width="48" height="36" rx="13" fill="url(#rg)" stroke="#7fa6ce" stroke-width="2" />
        <g class="eye">
          <circle cx="27" cy="29" r="6.5" fill="#fff" stroke="#7fa6ce" stroke-width="1.2" />
          <circle cx="45" cy="29" r="6.5" fill="#fff" stroke="#7fa6ce" stroke-width="1.2" />
          <circle cx="27" cy="30" r="3" fill="#22304a" /><circle cx="45" cy="30" r="3" fill="#22304a" />
        </g>
        <path d="M28 41 Q36 47 44 41" stroke="#3a5578" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <rect x="19" y="50" width="34" height="26" rx="10" fill="url(#rg2)" stroke="#5d8fc9" stroke-width="2" />
        <circle cx="36" cy="60" r="4.2" fill="#eafaff" />
        <rect x="27" y="67" width="18" height="3.4" rx="1.7" fill="#eafaff" opacity=".85" />
        <rect x="11" y="53" width="7" height="17" rx="3.5" fill="#8fbdf0" stroke="#5d8fc9" stroke-width="1.6" />
        <g class="arm">
          <rect x="54" y="52" width="7" height="18" rx="3.5" fill="#8fbdf0" stroke="#5d8fc9" stroke-width="1.6" />
          <circle cx="57.5" cy="52" r="4.2" fill="#dff0ff" stroke="#5d8fc9" stroke-width="1.6" />
        </g>
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
