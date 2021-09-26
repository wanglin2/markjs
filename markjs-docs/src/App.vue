<template>
  <div>
    <h1
      style="
        margin-right: auto;
        margin-bottom: 1em;
        margin-left: auto;
        -webkit-tap-highlight-color: transparent;
        white-space: normal;
        text-align: center;
        color: rgb(63, 63, 63);
        line-height: 1.75;
        font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
          'Microsoft YaHei', Arial, sans-serif;
        font-size: 18.24px;
        font-weight: bold;
        display: table;
        padding-right: 1em;
        padding-left: 1em;
        border-bottom: 2px solid rgb(15, 76, 129);
      "
      data-mpa-powered-by="yiban.io"
    >
      markjs 标注库
      <mpchecktext
        contenteditable="false"
        id="1632667401840_0.20425678920432633"
      >
      </mpchecktext>
    </h1>
    <p
      style="
        margin: 1.5em 8px;
        -webkit-tap-highlight-color: transparent;
        white-space: normal;
        text-align: left;
        color: rgb(63, 63, 63);
        line-height: 1.75;
        font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
          'Microsoft YaHei', Arial, sans-serif;
        font-size: 16px;
        letter-spacing: 0.1em;
      "
    >
      一个简单的用来标注区域的库。
      <mpchecktext
        contenteditable="false"
        id="1632667401841_0.5591303273762802"
      >
      </mpchecktext>
    </p>
    <p
      style="
        margin: 1.5em 8px;
        -webkit-tap-highlight-color: transparent;
        white-space: normal;
        text-align: left;
        color: rgb(63, 63, 63);
        line-height: 1.75;
        font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
          'Microsoft YaHei', Arial, sans-serif;
        font-size: 16px;
        letter-spacing: 0.1em;
      "
    >
      <code
        style="
          white-space: pre-wrap;
          -webkit-tap-highlight-color: transparent;
          color: rgb(221, 17, 68);
          line-height: 1.75;
          font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
            'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
            'Microsoft YaHei', Arial, sans-serif;
          font-size: 14.4px;
          background: rgba(27, 31, 35, 0.05);
          padding: 3px 5px;
          border-radius: 4px;
        "
        >markjs</code
      >使用插件化的开发方式，包括核心的标注功能也是一个插件，默认自动注册。
      <mpchecktext
        contenteditable="false"
        id="1632667401842_0.9624864221784224"
      >
      </mpchecktext>
    </p>
    <p
      style="
        margin: 1.5em 8px;
        -webkit-tap-highlight-color: transparent;
        white-space: normal;
        text-align: left;
        color: rgb(63, 63, 63);
        line-height: 1.75;
        font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
          'Microsoft YaHei', Arial, sans-serif;
        font-size: 16px;
        letter-spacing: 0.1em;
      "
    >
      其他内置插件包括：
      <mpchecktext
        contenteditable="false"
        id="1632667401845_0.4272643636279623"
      >
      </mpchecktext
      >img（图片支持插件）、mouse（鼠标样式支持插件）、shape（特定形状支持插件）。
      <mpchecktext
        contenteditable="false"
        id="1632667401843_0.35271598540757054"
      >
      </mpchecktext
      >此外，你也可以开发自己的插件，后面会详细介绍。
      <mpchecktext
        contenteditable="false"
        id="1632667401844_0.45863519295984223"
      >
      </mpchecktext>
    </p>
    <h2
      style="
        margin: 4em auto 2em;
        -webkit-tap-highlight-color: transparent;
        white-space: normal;
        text-align: center;
        color: rgb(255, 255, 255);
        line-height: 1.75;
        font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
          'Microsoft YaHei', Arial, sans-serif;
        font-size: 17.6px;
        font-weight: bold;
        display: table;
        padding-right: 0.2em;
        padding-left: 0.2em;
        background: rgb(15, 76, 129);
      "
    >
      ​安装
      <mpchecktext
        contenteditable="false"
        id="1632667401846_0.2714194494539979"
      >
      </mpchecktext>
    </h2>
    <section
      class="code-snippet__github"
      style="
        margin: 10px 8px;
        -webkit-tap-highlight-color: transparent;
        display: flex;
        font-size: 12px;
        position: relative;
        height: auto;
        background-color: rgb(247, 247, 247);
        border-radius: 8px;
        color: rgb(0, 0, 0);
        font-family: 'PingFang SC';
        text-align: start;
        white-space: normal;
      "
    >
      <pre
        class="code__pre"
        data-lang="bash"
        style="
          -webkit-tap-highlight-color: transparent;
          display: grid;
          position: relative;
          counter-reset: line 0;
          overflow-x: auto;
          padding: 1em;
          -webkit-box-flex: 1;
          flex: 1 1 0%;
          line-height: 20px;
          font-family: 'Operator Mono', Consolas, Monaco, Menlo, monospace;
        "
      >
<code class="prettyprint prettyprinted" style="-webkit-tap-highlight-color: transparent; font-family: Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; display: flex; position: relative; padding-right: 8px; border-width: 0px !important; border-style: initial !important; border-color: initial !important;"><span class="code-snippet_outer" style="-webkit-tap-highlight-color: transparent;"><span class="pln" style="-webkit-tap-highlight-color: transparent; color: rgb(51, 51, 51);">$ npm i </span><span class="lit" style="-webkit-tap-highlight-color: transparent; color: rgb(0, 134, 179);">@wanglin1994</span><span class="pun" style="-webkit-tap-highlight-color: transparent; color: rgb(51, 51, 51);">/</span><span class="pln" style="-webkit-tap-highlight-color: transparent; color: rgb(51, 51, 51);">markjs<mpchecktext contenteditable="false" id="1632667401847_0.16819536829326953">
</mpchecktext></span></span></code>
</pre>
    </section>
    <h2
      style="
        margin: 4em auto 2em;
        -webkit-tap-highlight-color: transparent;
        white-space: normal;
        text-align: center;
        color: rgb(255, 255, 255);
        line-height: 1.75;
        font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI',
          'Microsoft YaHei', Arial, sans-serif;
        font-size: 17.6px;
        font-weight: bold;
        display: table;
        padding-right: 0.2em;
        padding-left: 0.2em;
        background: rgb(15, 76, 129);
      "
    >
      引入
      <mpchecktext
        contenteditable="false"
        id="1632667401848_0.27738120102577457"
      >
      </mpchecktext>
    </h2>
    <section
      class="code-snippet__github"
      style="
        margin: 10px 8px;
        -webkit-tap-highlight-color: transparent;
        display: flex;
        font-size: 12px;
        position: relative;
        height: auto;
        background-color: rgb(247, 247, 247);
        border-radius: 8px;
        color: rgb(0, 0, 0);
        font-family: 'PingFang SC';
        text-align: start;
        white-space: normal;
      "
    >
      <pre
        class="code__pre"
        data-lang="bash"
        style="
          -webkit-tap-highlight-color: transparent;
          display: grid;
          position: relative;
          counter-reset: line 0;
          overflow-x: auto;
          padding: 1em;
          -webkit-box-flex: 1;
          flex: 1 1 0%;
          line-height: 20px;
          font-family: 'Operator Mono', Consolas, Monaco, Menlo, monospace;
        "
      >
<code class="prettyprint prettyprinted" style="-webkit-tap-highlight-color: transparent; font-family: Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; display: flex; position: relative; padding-right: 8px; border-width: 0px !important; border-style: initial !important; border-color: initial !important;"><span class="code-snippet_outer" style="-webkit-tap-highlight-color: transparent;"><span class="kwd" style="-webkit-tap-highlight-color: transparent; color: rgb(167, 29, 93);">import</span><span class="pln" style="-webkit-tap-highlight-color: transparent; color: rgb(51, 51, 51);"> markjs </span><span class="kwd" style="-webkit-tap-highlight-color: transparent; color: rgb(167, 29, 93);">from</span><span class="pln" style="-webkit-tap-highlight-color: transparent; color: rgb(51, 51, 51);"> </span><span class="str" style="-webkit-tap-highlight-color: transparent; color: rgb(24, 54, 145);">'@wanglin1994/markjs'<mpchecktext contenteditable="false" id="1632667401849_0.6123258996776402">
</mpchecktext></span></span></code>
</pre>
    </section>
    <p>
      <br />
    </p>

    <Demo1></Demo1>
    <Demo2></Demo2>
    <Demo3></Demo3>
    <Demo4></Demo4>
    <Demo5></Demo5>
    <Demo6></Demo6>
    <Api></Api>
  </div>
</template>

<script>
import Demo1 from "./components/Demo1";
import Demo2 from "./components/Demo2";
import Demo3 from "./components/Demo3";
import Demo4 from "./components/Demo4";
import Demo5 from "./components/Demo5";
import Demo6 from "./components/Demo6";
import Api from './components/Api';

export default {
  name: "App",
  components: {
    Demo1,
    Demo2,
    Demo3,
    Demo4,
    Demo5,
    Demo6,
    Api
  },
};
</script>

<style>
#app {
  width: 800px;
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
