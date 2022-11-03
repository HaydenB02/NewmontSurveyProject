<template>
  <div id="surveys">
    <survey-card v-for="surveyGroup in surveyGroups" :key="hole.holeRowid + surveyGroup.priority" :card_id="surveyGroup.priority" />
  </div>
</template>

<script lang="ts">
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
  #surveys {
    overflow-y: auto;
  }
</style>

