<template>
  <div class="container">
    <h1 name="demo5" id="demo5">
      <a href="#demo5">单独编辑</a>
    </h1>
    <div class="markBox" ref="markBox4"></div>
    <el-button
      type="primary"
      @click="create4"
      :disabled="!editing4 || !!curEditMarkItem4"
      >新增标注</el-button
    >
    <el-button type="primary" @click="exit4" :disabled="!isCreateMarking4"
      >退出新增</el-button
    >
    <el-button type="primary" @click="getMarkData4"
      >获取标注（控制台查看）</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-delete"
      @click="deleteItem4"
      :disabled="!curEditMarkItem4"
    ></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="deleteAll4"
      >删除全部</el-button
    >
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";
import mousePlugin from "@wanglin1994/markjs/src/plugins/mouse";
Markjs.use(mousePlugin);

let mark4 = null;
export default {
  data() {
    return {
      // 单独编辑
      editing4: true,
      curEditMarkItem4: null,
      isCreateMarking4: false,
    };
  },
  mounted() {
    setTimeout(() => {
      // 单独编辑
      mark4 = new Markjs({
        el: this.$refs.markBox4,
        hoverActive: true,
        single: true,
      });
      mark4.on("CURRENT-MARK-ITEM-CHANGE", (item) => {
        this.curEditMarkItem4 = item;
      });
      mark4.on("IS-CREATE-MARKING-CHANGE", (state) => {
        this.isCreateMarking4 = state;
      });
      mark4.on("NOT-ENOUGH-END-POINTS", (state) => {
        this.$message.warning("至少需要绘制三个端点");
      });
    });
  },
  methods: {
    getMarkData4() {
      console.log(mark4.getMarkData(), JSON.stringify(mark4.getMarkData()));
    },
    deleteItem4() {
      mark4.deleteMarkItem(this.curEditMarkItem4);
    },
    deleteAll4() {
      mark4.deleteAllMarkItem();
    },
    create4() {
      mark4.createMarkItem();
    },
    exit4() {
      mark4.exitCreate();
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