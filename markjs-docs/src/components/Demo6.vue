<template>
  <div class="container" ref="container">
    <h2
      style="
        margin-right: auto;
        margin-bottom: 2em;
        margin-left: auto;
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
      data-mpa-powered-by="yiban.io"
    >
      综合示例
      <mpchecktext
        contenteditable="false"
        id="1632667401878_0.9432888705557636"
      >
      </mpchecktext>
    </h2>
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
      这个示例演示了大部分的配置项。
      <mpchecktext
        contenteditable="false"
        id="1632667401879_0.9936413487139533"
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
      初始设通过
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
        >readonly</code
      >为
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
        >true</code
      >设为只读模式，通过方法开启为编辑模式。
      <mpchecktext
        contenteditable="false"
        id="1632667401880_0.4546992160668135"
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
      回显了部分数据，包括特定形状，回显可设置单独的样式。
      <mpchecktext
        contenteditable="false"
        id="1632667401881_0.19242259649526994"
      >
      </mpchecktext>
    </p>
    <p>
      ​
      <br />
    </p>

    <div class="markBox" ref="markBox5"></div>
    <el-button type="primary" @click="edit5">{{
      editing5 ? "切换到只读模式" : "切换到编辑模式"
    }}</el-button>
    <el-button
      type="primary"
      @click="create5"
      :disabled="!editing5 || !!curEditMarkItem5"
      >新增标注</el-button
    >
    <el-button
      type="primary"
      @click="createShape5"
      :disabled="!editing5 || !!curEditMarkItem5"
      >创建形状</el-button
    >
    <el-button type="primary" @click="exit5" :disabled="!isCreateMarking5"
      >退出新增</el-button
    >
    <el-button type="primary" @click="getMarkData5"
      >获取标注（控制台查看）</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-delete"
      @click="deleteItem5"
      :disabled="!curEditMarkItem5"
    ></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="deleteAll5"
      >删除全部</el-button
    >
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";
import mousePlugin from "@wanglin1994/markjs/src/plugins/mouse";
import imgPlugin from "@wanglin1994/markjs/src/plugins/img";
import shapePlugin from "@wanglin1994/markjs/src/plugins/shape";
Markjs.use(imgPlugin, 0);
Markjs.use(shapePlugin);
Markjs.use(mousePlugin);

let mark5 = null;
export default {
  data() {
    return {
      // 综合示例
      editing5: false,
      curEditMarkItem5: null,
      isCreateMarking5: false,
    };
  },
  mounted() {
    setTimeout(() => {
      mark5 = new Markjs({
        el: this.$refs.markBox5,
        value: [
          {
            data: "区域1",
            pointArr: [
              { x: 0.5409663865546218, y: 0.16607004643962847 },
              { x: 1.009453781512605, y: 0.19393382352941177 },
              { x: 0.8960084033613446, y: 0.6273703560371517 },
              { x: 0.6039915966386554, y: 0.8502805727554179 },
              { x: 0.39810924369747897, y: 0.5097232972136223 },
              { x: 0.5577731092436975, y: 0.4137480650154799 },
            ],
            fillColor: "rgba(250,50,57,0.30)",
            strokeStyle: { strokeColor: "red" },
            pointStyle: { fillColor: "#FFCC00", strokeColor: "#FFCC00" },
          },
          {
            data: null,
            pointArr: [
              { x: 0.0703781512605042, y: 0.15368614551083593 },
              { x: 0.23004201680672268, y: 0.04842298761609907 },
              { x: 0.13970588235294118, y: 0.28062113003095973 },
              { x: 0.21533613445378152, y: 0.4508997678018576 },
              { x: 0.19432773109243698, y: 0.655234133126935 },
              { x: 0.27836134453781514, y: 0.8007449690402477 },
              { x: 0.1796218487394958, y: 0.806936919504644 },
              { x: 0.11659663865546219, y: 0.8595684984520123 },
            ],
          },
          {
            data: null,
            shape: "square",
            pointArr: [
              { x: 0.37, y: 0.2025 },
              { x: 0.7033333333333334, y: 0.2025 },
              { x: 0.7033333333333334, y: 0.7025 },
              { x: 0.37, y: 0.7025 },
            ],
            fillColor: "rgba(255,223,66,0.80)",
            strokeStyle: { strokeColor: "#FFCC00" },
          },
        ],
        showPoint: true,
        pointType: "square",
        pointWidth: 3,
        pointStyle: {
          lineWidth: 3,
          strokeColor: "#fff",
          fillColor: "#fff",
        },
        max: 5,
        hoverActive: true,
        readonly: true,
        showPen: true,
        single: false,
        noCrossing: true,
        img: require("../assets/demo.png"),
        elBg: "#000",
        bg: "#fff",
      });
      mark5.on("CURRENT-MARK-ITEM-CHANGE", (item) => {
        this.curEditMarkItem5 = item;
      });
      mark5.on("IS-CREATE-MARKING-CHANGE", (state) => {
        this.isCreateMarking5 = state;
      });
      mark5.on("LINE-CROSS", (item) => {
        this.$message.warning("线段不允许交叉");
      });
      mark5.on("NOT-ENOUGH-END-POINTS", (item) => {
        this.$message.warning("至少需要绘制三个端点");
      });
      mark5.on("COUNT-LIMIT", (item) => {
        this.$message.warning("最多只能绘制三个区域");
      });
    });
  },
  methods: {
    edit5() {
      if (this.editing5) {
        let succ = mark5.disableEdit();
        if (!succ) {
          this.$message.warning("请先完成编辑");
          return;
        }
      } else {
        mark5.enableEdit();
      }
      this.editing5 = !this.editing5;
    },
    getMarkData5() {
      console.log(mark5.getMarkData(), JSON.stringify(mark5.getMarkData()));
    },
    deleteItem5() {
      mark.deleteMarkItem(this.curEditMarkItem5);
    },
    deleteAll5() {
      mark5.deleteAllMarkItem();
    },
    create5() {
      mark5.createMarkItem({
        data: "新标注",
        fillColor: "rgba(155,224,255,0.27)",
      });
    },
    exit5() {
      mark5.exitCreate();
    },
    createShape5() {
      mark5.createShapeMarkItem("square");
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;

  .markBox {
    width: 100%;
    height: 400px;
    background-color: #f5f5f5;
    margin-bottom: 10px;
  }
}
</style>