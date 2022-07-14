<template>
  <div class="container">
    <div class="markBox" ref="markBox33"></div>
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
import Vconsole from 'vconsole';
Markjs.use(imgPlugin, 0);
Markjs.use(shapePlugin);
new Vconsole();

const imgList = [
  require('../assets/demo2.jpg'),
  require('../assets/demo3.jpg'),
  require('../assets/demo4.jpg'),
  require('../assets/demo5.png'),
  require('../assets/demo6.png'),
  require('../assets/demo.png'),
]

let mark2 = null;
// 移动端测试
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
        el: this.$refs.markBox33,
        hoverActive: true,
        img: imgList[0],
        elBg: "#000",
        max: 3,
        noCrossing: true,
        mobile: true
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
}
</style>