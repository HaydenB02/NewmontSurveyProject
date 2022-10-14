<template>
  <div id="toolbar">

    <b-form inline>
      <p id="hole-title">Hole Selector:</p>
      <p id="priority-title">Priority Selector:</p>
      <p id="distance-title">Allowable Distance:</p>
    </b-form>
    <b-form inline>
      <b-form-select id="hole-dropdown" v-model="selectedHole">
        <b-form-select-option v-for="hole in holeNames" :key="hole.holeRowId" :value="hole.filename">{{hole.holeId}}</b-form-select-option>
      </b-form-select>

      <b-form-select id="priority-dropdown" v-model="selectedSurvey">
        <b-form-select-option v-for="survey in surveyGroups" :key="survey.priority" :value="survey">{{survey.priority}}</b-form-select-option>
      </b-form-select>
          
      <b-form-input id="difference-input" v-model="allowedDistance" type="number"></b-form-input>
      <div v-if="hole != null"><h4> {{hole.depthUnits}}</h4></div>
    </b-form>

  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
    
//Data Stores
import App, { AppState } from "../store/modules/app";
import Data, { HoleName, SurveyGroup, Hole } from "../store/modules/data";
    
//UI Components
    
//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faCog);
    
@Component({
  components: {
    Icon
  }
})
export default class Toolbar extends Vue {
  selectedHole = "";
  selectedSurvey = 1;
  allowedDistance = 0;

  @Watch('selectedHole', {immediate: true})
  onChildChanged(val: string, oldVal: string) {
    if(this.selectedHole != ""){
      //Load the json in selected
      Data.commitGetHole({filename: val});
    }
  }
  
  get holeNames(): Array<HoleName> {
    return Data.state.holeNames;
  }

  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }

  get hole(): Hole {
    return Data.state.hole;
  }

}
</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>

  #toolbar {
    width: 100%;
    height: 10%;
    margin-bottom: 1em;
  }

  #hole-dropdown {
    width: 40%;
  }

  #priority-dropdown {
    width: 20%;
  }

  #difference-input {
    width: 20%;
  }

  #hole-title {
    width: 40%;
  }

  #priority-title {
    width: 20%;
  }

  #distance-title {
    width: 20%;
  }

</style>