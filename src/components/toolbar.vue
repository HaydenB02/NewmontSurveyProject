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
          
      <b-form-input id="difference-input" v-model="allowedDistance" type="number" onkeypress="return event.keyCode != 13" min="0"></b-form-input>
      <div v-if="hole != null"><h4> {{hole.depthUnits}}</h4></div>
    </b-form>

  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
    
//Data Stores
import Data, { HoleName, SurveyGroup, Hole } from "../store/modules/data";
    
//UI Components
    
//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faCog);
    
@Component({
  components: {
    Icon,
  }
})
export default class Toolbar extends Vue {
  selectedHole = "";
  selectedSurvey: number = -1;
  allowedDistance = 0;

  @Watch('selectedHole', {immediate: true})
  onHoleChanged(val: string, oldVal: string) {
    if(this.selectedHole != ""){
      //Load the json in selected
      Data.commitGetHole({filename: val});

      //TODO: make sure commitGetHole and everything it calls is finished before continuing

      //calculate points for every survey
      for(let i=0; i<Data.state.surveyGroups.length; i++){
        this.calcPoints(Data.state.surveyGroups[i]);
      }

      //TODO: reload priority-dropdown div to show selectedSurvey
      this.selectedSurvey = Data.state.surveyGroups[0].priority;
    }
  }

  @Watch('selectedSurvey', {immediate: true})
  onSurveyChanged(val: number, oldVal: number){
    if(this.selectedSurvey != -1){
      let surveys = Data.state.surveyGroups;
      for(let i=0; i<surveys.length; i++){
        surveys[i].isReference = false;
      }

      let newRef = Data.state.surveyGroups.find(e => e.priority == val);
      newRef.isReference = true;
      console.log(Data.state.surveyGroups.find(e => e.priority == val).isReference);

      
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

  calcPoints(survey: SurveyGroup) {
    survey.surveys[0].point.x = Data.state.hole.x;
    survey.surveys[0].point.y = Data.state.hole.y;
    survey.surveys[0].point.z = Data.state.hole.z;
    survey.surveys[0].point.depth = survey.surveys[0].depth;
    survey.surveys[0].point.inRange = true;
    for(let i=1; i<survey.surveys.length; i++){
        let diffDepth = survey.surveys[i].depth - survey.surveys[i-1].depth;
        let aziRads = survey.surveys[i-1].aziTrueNth * Math.PI / 180;
        let inclineRads = survey.surveys[i-1].inclination * Math.PI / 180;

        survey.surveys[i].point.x = diffDepth * Math.sin(aziRads);
        survey.surveys[i].point.y = diffDepth * Math.cos(aziRads);
        survey.surveys[i].point.z = diffDepth * Math.cos(inclineRads);

    }
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