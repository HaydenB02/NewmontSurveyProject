<template>
  <b-card id="surveyCard" class="text-center">
    <h6>Priority: {{surveyGroup.priority}}</h6>
    <h6>Survey Type: {{surveyGroup.type}}</h6>
  </b-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
    
//Data Stores
import App from "../../store/modules/app";
import Data, { SurveyGroup, Survey } from "../../store/modules/data";
    
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
</style>