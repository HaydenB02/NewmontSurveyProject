<template>
  <div id="controls">
      <b-card id="data-card" class="text-center">
  
        <toolbar />
        <surveys />

      </b-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component} from "vue-property-decorator";

//Data Stores
import Data, { HoleName, SurveyGroup } from "../store/modules/data";

//UI Components
import Toolbar from "./toolbar.vue";
import Surveys from "./surveys.vue";



@Component({
  components: {
    Toolbar,
    Surveys,
  }
})
export default class Controls extends Vue {
  get holeNames(): Array<HoleName> {
    return Data.state.holeNames;
  }

  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }
}
</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>
  #controls {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50%;
    height: 100%;
    background-color: white;
    overflow-y: auto;
  }
</style>