<template>
  <div>
    <!-- pc端 -->
    <Demo1></Demo1>
    <Demo2></Demo2>
    <Demo4></Demo4>
    <Demo3></Demo3>
    <Demo32></Demo32>
    <Demo5></Demo5>
    <Demo6></Demo6>
    <!-- 手机端 -->
    <!-- <Demo33></Demo33> -->
    <!-- <Demo34></Demo34> -->
  </div>
</template>

<script>
import Demo1 from "./components/Demo1";
import Demo2 from "./components/Demo2";
import Demo3 from "./components/Demo3";
import Demo4 from "./components/Demo4";
import Demo5 from "./components/Demo5";
import Demo6 from "./components/Demo6";
import Demo32 from './components/Demo3-2';
import Demo33 from './components/Demo3-3';
import Demo34 from './components/Demo3-4';

export default {
  name: "App",
  components: {
    Demo1,
    Demo2,
    Demo3,
    Demo4,
    Demo5,
    Demo6,
    Demo32,
    Demo33,
    Demo34
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
