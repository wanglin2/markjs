<template>
  <div class="container">
    <h1 name="demo3-2" id="demo3-2">
      <a href="#demo3-2">标注图片（可切换图片）</a>
    </h1>
    <div class="markBox" ref="markBox2"></div>
    <el-button
      type="primary"
      @click="refresh"
      >刷新图片</el-button
    >
    <el-button type="primary" @click="getMarkData2"
      >获取标注（控制台查看）</el-button
    >
  </div>
</template>

<script>
import Markjs from "@wanglin1994/markjs";
import imgPlugin from "@wanglin1994/markjs/src/plugins/img";
import shapePlugin from "@wanglin1994/markjs/src/plugins/shape";
Markjs.use(imgPlugin, 0);
Markjs.use(shapePlugin);

const imgList = [
  require('../assets/demo2.jpg'),
  require('../assets/demo3.jpg'),
  require('../assets/demo4.jpg'),
  require('../assets/demo5.png'),
  require('../assets/demo6.png'),
  require('../assets/demo.png'),
]

let mark2 = null;
export default {
  data() {
    return {
      // 标注图片
      editing2: true
    };
  },
  mounted() {
    setTimeout(() => {
      // 标注图片
      mark2 = new Markjs({
        el: this.$refs.markBox2,
        hoverActive: true,
        img: imgList[0],
        elBg: "#000",
        max: 3,
        noCrossing: true,
      });
      mark2.on('PLUGINS_LOADED', () => {
        this.create2()
      })
    });
  },
  methods: {
    // 标注图片
    refresh() {
      let index = Math.floor(Math.random() * imgList.length)
      mark2.refreshImage(imgList[index])
    },
    getMarkData2() {
      console.log(mark2.getMarkData(), JSON.stringify(mark2.getMarkData()));
    },
    create2() {
      mark2.createShapeMarkItem("square", {
        fillColor: "rgba(250,50,57,0.30)",
      });
    }
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