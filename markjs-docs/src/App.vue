<template>
  <div>
    <Demo1></Demo1>
    <Demo2></Demo2>
    <Demo3></Demo3>
    <Demo4></Demo4>
    <Demo5></Demo5>
    <Demo6></Demo6>
  </div>
</template>

<script>
import Demo1 from "./components/Demo1";
import Demo2 from "./components/Demo2";
import Demo3 from "./components/Demo3";
import Demo4 from "./components/Demo4";
import Demo5 from "./components/Demo5";
import Demo6 from "./components/Demo6";

export default {
  name: "App",
  components: {
    Demo1,
    Demo2,
    Demo3,
    Demo4,
    Demo5,
    Demo6
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
