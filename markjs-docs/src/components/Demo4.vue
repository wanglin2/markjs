<template>
  <div class="container" ref="container">
    <h1 name="demo4" id="demo4">
      <a href="#demo4">特定形状</a>
    </h1>
    <div class="markBox" ref="markBox3"></div>
    <el-button
      type="primary"
      @click="createShape3"
      :disabled="!editing3 || !!curEditMarkItem3"
      >创建形状</el-button
    >
    <el-button type="primary" @click="exit3" :disabled="!isCreateMarking3"
      >退出新增</el-button
    >
    <el-button type="primary" @click="getMarkData3"
      >获取标注（控制台查看）</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-delete"
      @click="deleteItem3"
      :disabled="!curEditMarkItem3"
    ></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="deleteAll3"
      >删除全部</el-button
    >
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";
import shapePlugin from "@wanglin1994/markjs/src/plugins/shape";
Markjs.use(shapePlugin);

let mark3 = null;
export default {
  data() {
    return {
      // 特定形状
      editing3: true,
      curEditMarkItem3: null,
      isCreateMarking3: false,
    };
  },
  mounted() {
    setTimeout(() => {
      // 特定形状
      mark3 = new Markjs({
        el: this.$refs.markBox3,
        hoverActive: true,
      });
      mark3.on("CURRENT-MARK-ITEM-CHANGE", (item) => {
        this.curEditMarkItem3 = item;
      });
      mark3.on("IS-CREATE-MARKING-CHANGE", (state) => {
        this.isCreateMarking3 = state;
      });
      mark3.on("NOT-ENOUGH-END-POINTS", (state) => {
        this.$message.warning("至少需要绘制三个端点");
      });
    });
  },
  methods: {
    // 特定形状
    getMarkData3() {
      console.log(mark3.getMarkData(), JSON.stringify(mark3.getMarkData()));
    },
    deleteItem3() {
      mark3.deleteMarkItem(this.curEditMarkItem);
    },
    deleteAll3() {
      mark3.deleteAllMarkItem();
    },
    exit3() {
      mark3.exitCreate();
    },
    createShape3() {
      mark3.createShapeMarkItem("rectangle", {
        fillColor: "rgba(250,50,57,0.30)",
      });
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