<template>
  <div class="container">
    <h1 name="demo3" id="demo3">
      <a href="#demo3">标注图片</a>
    </h1>
    <div class="markBox" ref="markBox2"></div>
    <el-button
      type="primary"
      @click="create2"
      :disabled="!editing2 || !!curEditMarkItem2"
      >新增标注</el-button
    >
    <el-button type="primary" @click="exit2" :disabled="!isCreateMarking2"
      >退出新增</el-button
    >
    <el-button type="primary" @click="getMarkData2"
      >获取标注（控制台查看）</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-delete"
      @click="deleteItem2"
      :disabled="!curEditMarkItem2"
    ></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="deleteAll2"
      >删除全部</el-button
    >
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";
import imgPlugin from "@wanglin1994/markjs/src/plugins/img";
Markjs.use(imgPlugin, 0);

let mark2 = null;
export default {
  data() {
    return {
      // 标注图片
      editing2: true,
      curEditMarkItem2: null,
      isCreateMarking2: false,
    };
  },
  mounted() {
    setTimeout(() => {
      // 标注图片
      mark2 = new Markjs({
        el: this.$refs.markBox2,
        hoverActive: true,
        img: require("../assets/demo.png"),
        elBg: "#000",
        max: 3,
        noCrossing: true,
      });
      mark2.on("CURRENT-MARK-ITEM-CHANGE", (item) => {
        this.curEditMarkItem2 = item;
      });
      mark2.on("IS-CREATE-MARKING-CHANGE", (state) => {
        this.isCreateMarking2 = state;
      });
      mark2.on("LINE-CROSS", (item) => {
        this.$message.warning("线段不允许交叉");
      });
      mark2.on("NOT-ENOUGH-END-POINTS", (state) => {
        this.$message.warning("至少需要绘制三个端点");
      });
      mark2.on("COUNT-LIMIT", (state) => {
        this.$message.warning("最多只能绘制三个区域");
      });
    });
  },
  methods: {
    // 标注图片
    getMarkData2() {
      console.log(mark2.getMarkData(), JSON.stringify(mark2.getMarkData()));
    },
    deleteItem2() {
      mark2.deleteMarkItem(this.curEditMarkItem2);
    },
    deleteAll2() {
      mark2.deleteAllMarkItem();
    },
    create2() {
      mark2.createMarkItem();
    },
    exit2() {
      mark2.exitCreate();
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