<template>
  <!-- Display Survey Data Cards -->
  <div id="surveys">
    <survey-card v-for="surveyGroup in surveyGroups" :key="hole.holeRowid + surveyGroup.priority + selectedSurvey + allowableDistance" :card_id="surveyGroup.priority" />
  </div>
</template>



<script lang="ts">
//Vue Imports
import Vue from "vue";
import { Component } from "vue-property-decorator";
    
//Data Stores
import Data, { Hole, SurveyGroup } from "../store/modules/data";
    
//UI Components
import SurveyCard from "./surveys/survey_card.vue";
    
@Component({
  components: {
    SurveyCard
  }
})
export default class Surveys extends Vue {
  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }

  get selectedSurvey(): number {
    let survey = Data.state.surveyGroups.find(e => e.isReference)
    if(survey){
      return survey.priority;
    }
    return -1;
  }

  get allowableDistance(): number {
    return Data.state.allowedDistance;
  }

  get hole(): Hole {
    return Data.state.hole;
  }
}
</script>

<!-- Local Style -->
<style scoped>
  #surveys {
    overflow-y: auto;
  }
</style>

