<template>
  <div id="surveys">
    <survey-card v-for="surveyGroup in surveyGroups" :key="surveyGroup.priority" :card_id="surveyGroup.priority" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
    
//Data Stores
import Data, { SurveyGroup } from "../store/modules/data";
    
//UI Components
import SurveyCard from "./surveys/survey_card.vue";
    
//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faCog);
    
@Component({
  components: {
    SurveyCard,
    Icon
  }
})
export default class Surveys extends Vue {
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
  #surveys {
    overflow-y: auto;
  }
</style>

