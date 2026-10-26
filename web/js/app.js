/* 单词小课堂 —— Vue 2 + Element-UI（免构建版） */
Vue.use(ELEMENT, { size: 'medium' });
Vue.config.productionTip = false;

var AUDIO_BASE = 'audio/';

/* ---------------- 年级选择 ---------------- */
Vue.component('grade-select', {
  props: ['grades'],
  template: `
  <div class="page home">
    <div class="hero">
      <div class="logo">📚</div>
      <h1>单词小课堂</h1>
      <p>选一个年级，开始今天的单词冒险</p>
    </div>
    <div class="grades">
      <button v-for="g in grades" :key="g.id" class="grade-card" :class="{ locked: !g.ready }"
              :disabled="!g.ready" @click="$emit('pick', g)">
        <span class="g-emoji">{{ g.emoji }}</span>
        <span class="g-name">{{ g.name }}</span>
        <span v-if="g.ready" class="g-meta">{{ g.words.length }} 个单词</span>
        <span v-else class="g-meta soon">即将上线</span>
      </button>
    </div>
    <p class="foot">声音为真实发音 · 手机/平板打开效果最佳</p>
  </div>`
});

/* ---------------- 单词列表 ---------------- */
Vue.component('word-list', {
  props: ['grade'],
  methods: {
    word: function (id) { return window.getWord(id); }
  },
  template: `
  <div class="page">
    <div class="bar">
      <el-button icon="el-icon-arrow-left" round size="small" @click="$emit('back')">返回</el-button>
      <div class="bar-title">{{ grade.emoji }} {{ grade.name }}</div>
      <span class="bar-right">{{ grade.words.length }} 词</span>
    </div>
    <div class="words">
      <button v-for="id in grade.words" :key="id" class="word-card" @click="$emit('open', id)">
        <span class="w-emoji">{{ word(id).emoji }}</span>
        <span class="w-word">{{ word(id).word }}</span>
        <span class="w-zh">{{ word(id).zh }}</span>
      </button>
    </div>
  </div>`
});

/* ---------------- 机器人 ---------------- */
Vue.component('robot-helper', {
  props: { tip: String, show: Boolean },
  template: `
  <div class="robot">
    <div class="robot-bubble" :class="{ show: show }">{{ tip }}</div>
    <div class="robot-body" role="button" aria-label="点我提示" @click="$emit('tap')">
      <svg viewBox="0 0 72 88" width="100%" height="100%">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#dff0ff"/><stop offset="1" stop-color="#9cc6f2"/>
          </linearGradient>
          <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#a9d3ff"/><stop offset="1" stop-color="#6aa6ff"/>
          </linearGradient>
        </defs>
        <line x1="36" y1="12" x2="36" y2="3" stroke="#5d7fa8" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="36" cy="3" r="3.4" fill="#ff8fb1"/>
        <rect x="12" y="12" width="48" height="36" rx="13" fill="url(#rg)" stroke="#7fa6ce" stroke-width="2"/>
        <g class="eye">
          <circle cx="27" cy="29" r="6.5" fill="#fff" stroke="#7fa6ce" stroke-width="1.2"/>
          <circle cx="45" cy="29" r="6.5" fill="#fff" stroke="#7fa6ce" stroke-width="1.2"/>
          <circle cx="27" cy="30" r="3" fill="#22304a"/><circle cx="45" cy="30" r="3" fill="#22304a"/>
        </g>
        <path d="M28 41 Q36 47 44 41" stroke="#3a5578" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <rect x="19" y="50" width="34" height="26" rx="10" fill="url(#rg2)" stroke="#5d8fc9" stroke-width="2"/>
        <circle cx="36" cy="60" r="4.2" fill="#eafaff"/>
        <rect x="27" y="67" width="18" height="3.4" rx="1.7" fill="#eafaff" opacity=".85"/>
        <rect x="11" y="53" width="7" height="17" rx="3.5" fill="#8fbdf0" stroke="#5d8fc9" stroke-width="1.6"/>
        <g class="arm">
          <rect x="54" y="52" width="7" height="18" rx="3.5" fill="#8fbdf0" stroke="#5d8fc9" stroke-width="1.6"/>
          <circle cx="57.5" cy="52" r="4.2" fill="#dff0ff" stroke="#5d8fc9" stroke-width="1.6"/>
        </g>
      </svg>
    </div>
  </div>`
});

/* ---------------- 单词游戏 ---------------- */
Vue.component('word-game', {
  props: { item: Object, stars: Number },
  components: {},
  data: function () {
    return {
      spellVisible: false, findVisible: false,
      index: 0, tiles: [], spellWrong: 0,
      findGrid: [], findOdd: -1, findWrong: 0, findMsg: '',
      robotTip: '', robotShow: false, audio: null, timer: null
    };
  },
  computed: {
    letters: function () { return this.item.word.split(''); }
  },
  mounted: function () {
    this.robotSay('嗨！我是小机器人，点我可以要提示 🤖', 4200);
  },
  beforeDestroy: function () {
    clearTimeout(this.timer);
    if (this.audio) { try { this.audio.pause(); } catch (e) {} }
  },
  watch: {
    item: function () {
      this.index = 0; this.tiles = []; this.spellWrong = 0;
      this.robotSay('现在学 ' + this.item.word + '（' + this.item.zh + '）', 3000);
    }
  },
  methods: {
    say: function () {
      try {
        if (this.audio) { try { this.audio.pause(); } catch (e) {} }
        this.audio = new Audio(AUDIO_BASE + this.item.id + '.mp3');
        this.audio.volume = 1;
        var p = this.audio.play();
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    },
    robotSay: function (t, ms) {
      this.robotTip = t; this.robotShow = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(function () { this.robotShow = false; }.bind(this), ms || 3000);
    },
    robotTap: function () {
      if (this.findVisible) return this.findHint();
      if (this.spellVisible) return this.spellHint();
      this.robotSay('点「听一听」听 ' + this.item.word + ' 的发音，或点「拼一拼」练拼写');
    },

    resetSpell: function () {
      this.index = 0; this.spellWrong = 0;
      var pool = this.item.word.split('').concat(['a', 'o', 'm']).map(function (ch) {
        return { ch: ch, used: false, hint: false, shake: false };
      });
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      this.tiles = pool;
    },
    openSpell: function () {
      this.resetSpell(); this.spellVisible = true; this.say();
      this.robotSay('按 ' + this.item.word.split('').join('-') + ' 的顺序点字母');
    },
    pickTile: function (i) {
      var t = this.tiles[i];
      if (!t || t.used) return;
      var need = this.item.word[this.index];
      if (t.ch === need) {
        t.used = true; this.index++;
        if (this.index === this.item.word.length) {
          this.$emit('add-stars', 3);
          this.robotSay('拼对啦！你拼出了 ' + this.item.word + ' 🎉', 3200);
          this.$message({ message: '太棒了！' + this.item.word + ' 🎉', type: 'success', duration: 1200 });
          this.say();
          var self = this;
          setTimeout(function () { if (self.spellVisible) self.resetSpell(); }, 1600);
        }
      } else {
        t.shake = true;
        var tt = t; setTimeout(function () { tt.shake = false; }, 420);
        this.spellWrong++;
        if (this.spellWrong >= 2) { this.spellWrong = 0; var self = this; setTimeout(function () { self.spellHint(); }, 420); }
      }
    },
    spellHint: function () {
      if (!this.spellVisible) return;
      var need = this.item.word[this.index];
      if (!need) { this.robotSay('已经拼完啦，点「重新来」再练一次'); return; }
      this.robotSay('小提示：下一位是「' + need + '」');
      var t = null;
      for (var i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].ch === need && !this.tiles[i].used) { t = this.tiles[i]; break; }
      }
      if (t) { t.hint = true; var tt = t; setTimeout(function () { tt.hint = false; }, 2400); }
    },

    openFind: function () {
      this.buildFind(); this.findVisible = true;
      this.robotSay('九个小图标里，有一个和大家不一样，找出来！');
    },
    buildFind: function () {
      this.findWrong = 0; this.findMsg = '';
      var n = 9, odd = Math.floor(Math.random() * n);
      this.findOdd = odd;
      var arr = [];
      for (var i = 0; i < n; i++) {
        arr.push({ emoji: i === odd ? this.item.odd : this.item.emoji, found: false, hint: false, shake: false });
      }
      this.findGrid = arr;
    },
    pickFind: function (i) {
      var c = this.findGrid[i];
      if (!c || c.found) return;
      if (i === this.findOdd) {
        c.found = true; this.$emit('add-stars', 2);
        this.findMsg = '✅ 正确！再来一局…';
        this.robotSay('找到啦！眼力真好 🎯', 2600);
        this.say();
        var self = this;
        setTimeout(function () { if (self.findVisible) self.buildFind(); }, 1300);
      } else {
        c.shake = true;
        var cc = c; setTimeout(function () { cc.shake = false; }, 420);
        this.findMsg = '再看看～';
        this.findWrong++;
        if (this.findWrong >= 2) { this.findWrong = 0; var self = this; setTimeout(function () { self.findHint(); }, 420); }
      }
    },
    findHint: function () {
      if (!this.findVisible) return;
      var c = this.findGrid[this.findOdd];
      if (c) { c.hint = true; var cc = c; setTimeout(function () { cc.hint = false; }, 2400); }
      this.robotSay('看仔细，有一个和大家不一样哦');
    }
  },
  template: `
  <div class="page game">
    <div class="bar">
      <el-button icon="el-icon-arrow-left" round size="small" @click="$emit('back')">返回</el-button>
      <div class="bar-title">{{ item.word }}</div>
      <el-tag type="warning" effect="light" class="star-tag">⭐ {{ stars }}</el-tag>
    </div>

    <el-card class="hero-card" shadow="always">
      <div class="emoji">{{ item.emoji }}</div>
      <div class="word">{{ item.word }}</div>
      <div class="ph">{{ item.ph }}</div>
      <span class="zh">{{ item.zh }}</span>
      <div class="actions">
        <el-button class="btn-say" icon="el-icon-video-play" @click="say">听一听</el-button>
        <el-button class="btn-spell" icon="el-icon-edit-outline" @click="openSpell">拼一拼</el-button>
        <el-button class="btn-find" icon="el-icon-search" @click="openFind">找不同</el-button>
      </div>
      <div class="tipbox">点「听一听」听真人发音 · 卡住了点左下角小机器人 🤖</div>
    </el-card>

    <el-dialog :visible.sync="spellVisible" width="86%" :show-close="false" :close-on-click-modal="false" append-to-body>
      <div slot="title">按顺序拼出 <b style="color:#7b5cf0">{{ item.word }}</b></div>
      <div class="slots">
        <div v-for="(s, i) in letters" :key="'s' + i" class="slot" :class="{ filled: i < index }">{{ i < index ? s : '' }}</div>
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

    <el-dialog :visible.sync="findVisible" width="86%" :show-close="false" :close-on-click-modal="false" append-to-body>
      <div slot="title">找出不一样的那一个</div>
      <div class="buggrid">
        <div v-for="(c, i) in findGrid" :key="'c' + i" class="cell"
             :class="{ found: c.found, hintcell: c.hint, shake: c.shake }" @click="pickFind(i)">{{ c.emoji }}</div>
      </div>
      <div class="find-msg">{{ findMsg }}</div>
      <div class="dialog-foot">
        <el-button round type="primary" @click="findVisible = false">回到单词</el-button>
      </div>
    </el-dialog>

    <robot-helper :tip="robotTip" :show="robotShow" @tap="robotTap"></robot-helper>
  </div>`
});

/* ---------------- 根组件 ---------------- */
new Vue({
  el: '#app',
  data: { view: 'home', grades: window.GRADES, grade: null, item: null, stars: 0 },
  methods: {
    openGrade: function (g) { if (!g.ready) return; this.grade = g; this.view = 'list'; },
    openWord: function (id) { this.item = window.getWord(id); this.view = 'game'; },
    addStars: function (n) { this.stars += n; }
  },
  template: `
  <div class="app-root">
    <grade-select v-if="view === 'home'" :grades="grades" @pick="openGrade"></grade-select>
    <word-list v-else-if="view === 'list'" :grade="grade" @back="view = 'home'" @open="openWord"></word-list>
    <word-game v-else :item="item" :stars="stars" @back="view = 'list'" @add-stars="addStars"></word-game>
  </div>`
});
