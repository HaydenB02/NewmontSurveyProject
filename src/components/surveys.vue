<template>
  <div id="surveys">
    <div v-if="surveyGroups.length > 0">
      <survey-card v-for="surveyGroup in surveyGroups" :key="surveyGroup.priority" :card_id="surveyGroup.priority" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
    
//Data Stores
import App, { AppState } from "../store/modules/app";
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

  #priority-title {
    margin-left: 0;
    width: 60%
  }

  #type-title {
    margin-left: 0;
    width: 60%
  }
</style>

