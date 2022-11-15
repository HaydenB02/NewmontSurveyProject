<template>
  <b-card id="surveyCard" class="text-center">
    <!--Survey Controls-->
    <b-form inline>
      <!--Labels-->
      <h6 id="priority">Priority: {{surveyGroup.priority}}</h6>
      <h6 id="type">Survey Type: {{surveyGroup.surveyType}}</h6>

      <!--Checkboxes-->
      <div id="checkboxes">
        <b-form-checkbox v-model="selected"></b-form-checkbox>
      </div>

      <!--Dropdown Button-->
      <b-button v-b-toggle="'collapse-' + surveyGroup.priority" id="dropdown"><icon icon="caret-down"></icon></b-button>
    </b-form>

    <!--Survey Tables-->
    <b-collapse :id="'collapse-' + surveyGroup.priority">
      <div id="table-position"><survey-table :table_id="surveyGroup.priority" /></div>
    </b-collapse>
  </b-card>
</template>



<script lang="ts">
//Vue Imports
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
    
//Data Stores
import Data, { SurveyGroup } from "../../store/modules/data";
    
//UI Components
import SurveyTable from "./survey_table.vue";
    
//Dropdown Icon
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
library.add(faCaretDown);

@Component({
  components: {     
    SurveyTable,   
    Icon
  }
})
export default class SurveyCard extends Vue {
  @Prop({type: Number}) card_id!: number;

  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }

  get surveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(i => i.priority === this.card_id);
  }

  get selected(): boolean {
    return Data.state.surveyGroups.find(i => i.priority === this.card_id).isSelected;
  }

  set selected(b: boolean) {
    let mySurvey = Data.state.surveyGroups.find(i => i.priority === this.card_id);
    let newSurvey = mySurvey;
    newSurvey.isSelected = b;
    let index = Data.state.surveyGroups.indexOf(mySurvey);
    Vue.set(Data.state.surveyGroups, index, newSurvey);
  }
}
</script>
  

    
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

  #checkboxes {
    position: absolute;
    right: 5em;
  }

  #dropdown {
    position: absolute;
    right: 0em;
    margin: 1em;
  }

  #table-position{
    margin: 1em
  }
</style>