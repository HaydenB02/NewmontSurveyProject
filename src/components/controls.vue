<template>
  <div id="controls">
      <b-card id="data-card" class="text-center" style="background-color: black;">

        <!-- Display dropdowns and survey info -->
        <toolbar />
        <surveys />

      </b-card>
  </div>
</template>



<script lang="ts">
//Vue Imports
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

<!-- Local Style -->
<style scoped>
  #controls {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 35%;
    height: 100%;
    background-color: black;
    overflow-y: auto;
  }

   /* Customize Scrollbar */
   ::-webkit-scrollbar {
    width: auto;
   }
   ::-webkit-scrollbar-thumb {
    background: teal;
    border-radius: 10em;
   }
   ::-webkit-scrollbar-track {
    color: black
   }
</style>