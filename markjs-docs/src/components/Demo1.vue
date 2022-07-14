<template>
  <div class="container">
    <h1 name="demo1" id="demo1">
      <a href="#demo1">推荐用法</a>
    </h1>
    <div class="markBox" ref="markBox0"></div>
    <div class="btnGroup">
      <el-button
        type="primary"
        @click="create0"
        :disabled="!editing0 || !!curEditMarkItem0"
        >新增标注</el-button
      >
      <el-button type="primary" @click="exit0" :disabled="!isCreateMarking0"
        >退出新增</el-button
      >
      <el-button type="primary" @click="getMarkData0"
        >获取标注（控制台查看）</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-delete"
        @click="deleteItem1"
        :disabled="!curEditMarkItem0"
      ></el-button>
      <el-button type="primary" icon="el-icon-delete" @click="deleteAll0"
        >删除全部</el-button
      >
    </div>
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";
import scalePlugin from '@wanglin1994/markjs/src/plugins/scale';
Markjs.use(scalePlugin);

let mark0 = null;
export default {
  data() {
    return {
      // 推荐用法
      editing0: true,
      curEditMarkItem0: null,
      isCreateMarking0: false,
    };
  },
  mounted() {
    setTimeout(() => {
      // 推荐用法
      mark0 = new Markjs({
        el: this.$refs.markBox0,
        hoverActive: false,
        dbClickActive: true,
        noCrossing: true,
        enableAddPoint: true,
        area: true,
        showPen: false,
        singleClickComplete: false,
        pointType: "circle",
        pointWidth: 2,
        pointStyle: {
          lineWidth: 2,
          strokeColor: "#0088FF",
          fillColor: "#fff",
        },
        lineType: "borderLine",
        strokeStyle: {
          lineWidth: 5,
          strokeColor: "rgba(255, 255, 255, 0.7)",
          frontLineWidth: 3,
          frontStrokeColor: "#2196F3",
        },
        fillColor: "rgba(0,136,255,0.30)",
        dbClickRemovePoint: true,
      });
      mark0.on("CURRENT-MARK-ITEM-CHANGE", (item) => {
        this.curEditMarkItem0 = item;
      });
      mark0.on("IS-CREATE-MARKING-CHANGE", (state) => {
        this.isCreateMarking0 = state;
      });
      mark0.on("NOT-ENOUGH-END-POINTS", (state) => {
        this.$message.warning("至少需要绘制三个端点");
      });
      mark0.on("LINE-CROSS", (item) => {
        this.$message.warning("线段不允许交叉");
      });
      mark0.on("NOT-ENOUGH-POINTS-REMOVE", (item) => {
        this.$message.warning("至少需要三个端点");
      });
    });
  },
  methods: {
    // 推荐用法
    // 基础用法
    getMarkData0() {
      console.log(mark0.getMarkData(), JSON.stringify(mark0.getMarkData()));
    },
    deleteItem0() {
      mark0.deleteMarkItem(this.curEditMarkItem0);
    },
    deleteAll0() {
      mark0.deleteAllMarkItem();
    },
    create0() {
      mark0.createMarkItem();
    },
    exit0() {
      mark0.exitCreate();
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