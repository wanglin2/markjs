<template>
  <div class="container">
    <h1 name="demo34" id="demo34">
      <a href="#demo34">标注图片（移动端）</a>
    </h1>
    <div class="markBox" ref="markBox34"></div>
    <div class="btnGroup">
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
        el: this.$refs.markBox34,
        hoverActive: true,
        img: require("../assets/demo.png"),
        elBg: "#000",
        max: 3,
        noCrossing: true,
        mobile: true
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
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;

  .markBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }

  .btnGroup {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
}
</style>