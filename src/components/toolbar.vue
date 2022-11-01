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
        <b-form-select-option v-for="survey in surveyGroups" :key="survey.priority" :value="survey" >{{survey.priority}}</b-form-select-option>
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
    
@Component({
  components: {
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
    }
  }

  @Watch('surveyGroups', {immediate: true})
  onGroupChanged(val: string, oldVal: string){
    if(this.surveyGroups.length > 0){
      //TODO: reload priority-dropdown div to show selectedSurvey
      this.selectedSurvey = Data.state.surveyGroups[0].priority;
    }
  }

  @Watch('selectedSurvey', {immediate: true})
  onSurveyChanged(val: number, oldVal: number){
    if((this.selectedSurvey != -1) && (this.selectedSurvey != Data.state.surveyGroups[0].priority) && (this.selectedSurvey != undefined)){
      let surveys = Data.state.surveyGroups;
      for(let i=0; i<surveys.length; i++){
        surveys[i].isReference = false;
      }

      console.log(val, Data.state.surveyGroups.find(e => e.priority == val))

      Data.state.surveyGroups.find(e => e.priority == val).isReference = true;
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
    width: 25%;
  }

</style>