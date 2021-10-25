<template>
  <div class="container">
    <h1 name="demo2" id="demo2">
      <a href="#demo2">基础用法</a>
    </h1>
    <div class="markBox" ref="markBox1"></div>
    <el-button
      type="primary"
      @click="create1"
      :disabled="!editing1 || !!curEditMarkItem1"
      >新增标注</el-button
    >
    <el-button type="primary" @click="exit1" :disabled="!isCreateMarking1"
      >退出新增</el-button
    >
    <el-button type="primary" @click="getMarkData1"
      >获取标注（控制台查看）</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-delete"
      @click="deleteItem1"
      :disabled="!curEditMarkItem1"
    ></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="deleteAll1"
      >删除全部</el-button
    >
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";

let mark1 = null;
export default {
  data() {
    return {
      // 基础用法
      editing1: true,
      curEditMarkItem1: null,
      isCreateMarking1: false,
    };
  },
  mounted() {
    setTimeout(() => {
      // 基础用法
      mark1 = new Markjs({
        el: this.$refs.markBox1,
        hoverActive: true,
      });
      mark1.on("CURRENT-MARK-ITEM-CHANGE", (item) => {
        this.curEditMarkItem1 = item;
      });
      mark1.on("IS-CREATE-MARKING-CHANGE", (state) => {
        this.isCreateMarking1 = state;
      });
      mark1.on("NOT-ENOUGH-END-POINTS", (state) => {
        this.$message.warning("至少需要绘制三个端点");
      });
    });
  },
  methods: {
    // 基础用法
    getMarkData1() {
      console.log(mark1.getMarkData(), JSON.stringify(mark1.getMarkData()));
    },
    deleteItem1() {
      mark1.deleteMarkItem(this.curEditMarkItem1);
    },
    deleteAll1() {
      mark1.deleteAllMarkItem();
    },
    create1() {
      mark1.createMarkItem();
    },
    exit1() {
      mark1.exitCreate();
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