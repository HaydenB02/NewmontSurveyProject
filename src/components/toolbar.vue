<template>
  <div id="toolbar">

    <!-- Titles -->
    <b-form inline>
      <p id="hole-title">Hole Selector:</p>
      <p id="priority-title">Priority Selector:</p>
      <p id="distance-title">Allowable Distance:</p>
    </b-form>

    <!-- Inputs -->
    <b-form inline>
      <!-- Hole Selector -->
      <b-form-select id="hole-dropdown" v-model="selectedHole">
        <b-form-select-option v-for="hole in holeNames" :key="hole.holeRowId" :value="hole.filename">{{hole.holeId}}</b-form-select-option>
      </b-form-select>
      
      <!-- Priority Survey Selector -->
      <b-form-select id="priority-dropdown" v-model="selectedSurvey">
        <b-form-select-option v-for="survey in surveyGroups" :key="survey.priority" :value="survey.priority">{{survey.priority}}</b-form-select-option>
      </b-form-select>
      
      <!-- Allowed Distance Textbox -->
      <b-form-input id="difference-input" v-model="allowedDistance" type="number" onkeypress="return event.keyCode != 13" min="0" :lazy="true" ></b-form-input>
      <div v-if="hole != null"><h4 style="color: teal;">{{hole.depthUnits}}</h4></div>
    </b-form>

  </div>
</template>



<script lang="ts">
//Vue Imports
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
    
//Data Stores
import Data, { HoleName, SurveyGroup, Hole, ThreeContainer } from "../store/modules/data";

//Three Imports
import * as Three from 'three';
import SurveyModel from "./surveys/survey_model.vue";
    
@Component({
  components: {
  }
})
export default class Toolbar extends Vue {
  selectedHole = "";

  @Watch('selectedHole', {immediate: true})
  onHoleChanged(val: string, oldVal: string) {
    if(this.selectedHole != ""){
      //reset the scene
      this.threeContainer.scene.clear();
      this.threeContainer.scene.add(new Three.AxesHelper(5));
      SurveyModel.focused = false;

      //load the json in selected
      Data.commitGetHole({filename: val});
    }
  }
  
  get holeNames(): Array<HoleName> {
    return Data.state.holeNames;
  }

  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }

  get referenceSurveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(e => e.isReference); 
  }

  get hole(): Hole {
    return Data.state.hole;
  }

  get selectedSurvey(): number {
    let survey = Data.state.surveyGroups.find(e => e.isReference)
    if(survey){
      return survey.priority;
    }
    return -1;
  }

  get allowedDistance(): number {
    return Data.state.allowedDistance;
  }

  get threeContainer(): ThreeContainer {
    return Data.state.threeContainer;
  }

  set selectedSurvey(n: number) {
    if(n){
      //Remove old reference
      let oldSurvey = Data.state.surveyGroups.find(e => e.isReference);
      let oldIndex = Data.state.surveyGroups.indexOf(oldSurvey);
      oldSurvey.isReference = false;
      Vue.set(Data.state.surveyGroups, oldIndex, oldSurvey);

      //Set new reference
      let survey = Data.state.surveyGroups.find(e => e.priority == n);
      let index = Data.state.surveyGroups.indexOf(survey);
      survey.isReference = true;
      Vue.set(Data.state.surveyGroups, index, survey);

      //Reset inRange values for new priority
      Data.commitResetRange();
    }
  }

  set allowedDistance(n: number) {
    Data.state.allowedDistance = n;
    //Reset a survey so the scene updates
    let resetSurvey = Data.state.surveyGroups.find(e => e.isReference);
    let resetIndex = Data.state.surveyGroups.indexOf(resetSurvey);
    Vue.set(Data.state.surveyGroups, resetIndex, resetSurvey);
    Data.commitResetRange();
  }
}
</script>

<!-- Local Style -->
<style scoped>
  #toolbar {
    width: 100%;
    height: 10%;
    margin-bottom: 1em;
    background-color: black;
  }

  #hole-dropdown {
    width: 29%;
    margin-right: 1%;
    background-color: gray;
    color: black;
    border-color: teal;
  }

  #priority-dropdown {
    width: 24%;
    margin-right: 1%;
    background-color: gray;
    color: black;
    border-color: teal;
  }

  #difference-input {
    width: 24%;
    margin-right: 1%;
    background-color: gray;
    color: black;
    border-color: teal;
    cursor: default;
  }

  #hole-title {
    width: 30%;
    color: teal;
    text-align: left;
  }

  #priority-title {
    width: 25%;
    color: teal;
    text-align: left;
  }

  #distance-title {
    width: 25%;
    color: teal;
    text-align: left;
  }
</style>