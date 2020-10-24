<template>
  <section class="code-box" :class="{ [`demo-${componentName}`]: true, 'code-box-expand': showCode }">
    <section class="code-box-prev" v-if="$slots.codeBoxPrev">
      <slot name="codeBoxPrev"></slot>
    </section>
    <section class="code-box-demo" :class="{ 'browser': browser }" :style="demoStyle">
      <div class="code-box-browser dolphin" v-if="browser">
        <slot></slot>
      </div>
      <template v-else>
        <slot></slot>
      </template>
    </section>
    <section class="code-box-meta">
      <div class="code-box-title">{{title}}</div>
      <div class="code-box-desc" v-html="desc"></div>
      <el-tooltip effect="dark" :content="!showCode ? 'Show Code' : 'Hide Code'" placement="top">
        <span class="code-expand-icon" @click="showCode=!showCode">
          <i class="el-icon-arrow-down"></i>
        </span>
      </el-tooltip>
    </section>
    <el-collapse-transition>
      <section class="code-box-highlight" ref="highlight" v-show="showCode">
        <div class="code-box-actions"></div>
      </section>
    </el-collapse-transition>
  </section>
</template>

<script>
import MarkdownIt from 'markdown-it'
import hljs from 'highlightjs'

import 'highlightjs/styles/monokai-sublime.css'
import ElCollapseTransition from './collapse-transition'

// 初始化 markdown 对象
const md = new MarkdownIt({
  html: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(lang, str, true).value
        }</code></pre>`
      } catch (e) {
        console.error('highlightjs error')
      }
    }
    return ''
  }
})

export default {
  name: 'codeBox',
  components: {ElCollapseTransition},
  props: {
    type: {
      type: String,
      default: ''
    },
    title: String,
    description: {
      type: String,
      default: ''
    },
    browser: Boolean,
    demoStyle: {
      type: [String, Object],
      default: ''
    }
  },
  data () {
    return {
      showCode: false,
      desc: ''
    }
  },
  computed: {
    componentName () {
      return this.$router.currentRoute.path.split('/').pop().split('.')[0]
    }
  },
  mounted () {
    this.desc = md.render(this.description)
    const $code = this.$el.nextSibling
    $code && this.$refs.highlight.appendChild($code)
  }
}
</script>
