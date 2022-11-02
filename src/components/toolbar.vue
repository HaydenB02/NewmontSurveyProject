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
        <b-form-select-option v-for="survey in surveyGroups" :key="survey.priority" :value="survey.priority" >{{survey.priority}}</b-form-select-option>
      </b-form-select>
          
      <b-form-input id="difference-input" v-model="allowedDistance" type="number" onkeypress="return event.keyCode != 13" min="0" :lazy="true"></b-form-input>
      <div v-if="hole != null"><h4>{{hole.depthUnits}}</h4></div>
    </b-form>

  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
    
//Data Stores
import Data, { HoleName, SurveyGroup, Hole } from "../store/modules/data";
import * as Three from 'three';
    
@Component({
  components: {
  }
})
export default class Toolbar extends Vue {
  selectedHole = "";

  @Watch('selectedHole', {immediate: true})
  onHoleChanged(val: string, oldVal: string) {
    if(this.selectedHole != ""){
      //Load the json in selected
      Data.state.scene.clear();
      Data.state.scene.add(new Three.AxesHelper(5));

      Data.commitGetHole({filename: val});
      //TODO: reload check boxes, three scene, and data
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

  set selectedSurvey(n: number) {
    if(n){
      //remove old reference
      let oldSurvey = Data.state.surveyGroups.find(e => e.isReference);
      let oldIndex = Data.state.surveyGroups.indexOf(oldSurvey);
      oldSurvey.isReference = false;
      Vue.set(Data.state.surveyGroups, oldIndex, oldSurvey);

      //set new reference
      let survey = Data.state.surveyGroups.find(e => e.priority == n);
      let index = Data.state.surveyGroups.indexOf(survey);
      survey.isReference = true;
      Vue.set(Data.state.surveyGroups, index, survey);

      //reset inRange values for new priority
      Data.commitResetRange();
    }
  }

  set allowedDistance(n: number) {
    Data.state.allowedDistance = n;
    Data.commitResetRange();
    console.log(Data.state.allowedDistance)
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
    width: 25%;
  }

</style>