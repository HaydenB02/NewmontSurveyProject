<template>
  <div id="app">
    <controls />
    <notifications group="foo" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

//Data Stores
import AppData from "./store/modules/app";
import Data from "./store/modules/data";

//UI Components
import Controls from "./components/controls.vue";

@Component({
  components: {
    Controls,
  }
})

export default class App extends Vue {

  mounted() {
    AppData.commitLoadSession();
    Data.commitGetHoleNames();
  }

}
</script>

<!-- Global Style -->
<style>

#app {
  background-color: var(--eBlue);
  max-width: 100% !important;
  height: 100vh !important;
  overflow-x: hidden;
  overflow-y: hidden;
}

:root {
  --eBlue: #337AB7;
  --eBlue-border: #2c6ea8;
  --eBlue-dark: #236AA7;
  --eBlue-dark-border: #1c5e98;
  
  --eGold: #BA8F00;
  --eGold-border: #AA7F00;
  --eGold-dark: #9A6F00;
  --eGold-dark-border: #8A5F00;
  
  --eRed: #9A3B26;
  --eRed-border: #8A2B16;
  --eRed-dark: #7A1B06;
  --eRed-dark-border: #6A0B00;
  
  --eOrange: #bb6514;
  --eOrange-border: #ab5504;
  --eOrange-dark: #9b4500;
  --eOrange-dark-border: #8b3500;

  --eDarker: #2c3136;
  --eDark: #3E454C;
  --eDarkish: #4E555C;

  --eGray: #5E656C;
}
</style>

<!-- Local Style -->
<style scoped>

</style>