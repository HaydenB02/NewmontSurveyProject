<template>
  <b-card id="surveyCard" class="text-center">
    <b-form inline>
      <h6 id="priority">Priority: {{surveyGroup.priority}}</h6>
      <h6 id="type">Survey Type: {{surveyGroup.surveyType}}</h6>
      <b-checkbox id="check-box"></b-checkbox>
      <b-button v-b-toggle.table-collapse id="dropdown">v</b-button>
    </b-form>
    <b-collapse id="table-collapse">hi</b-collapse>
  </b-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
    
//Data Stores
import App from "../../store/modules/app";
import Data, { SurveyGroup } from "../../store/modules/data";
    
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
export default class SurveyCard extends Vue {
  @Prop({type: Number}) card_id!: number;

  get surveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(i => i.priority === this.card_id);
  }
}
</script>
    
<!-- Global Style -->
<style>
</style>
    
<!-- Local Style -->
<style scoped> 
  #surveyCard {
    cursor: pointer;
    margin-bottom: 1em;
  }

  #priority {
    margin-right: 2em;
  }

  #type {
    margin-right: 2em;
  }

  #check-box {
    position: absolute;
    right: 2em;
  }

  #dropdown {
    position: absolute;
    right: 1em;
  }
</style>