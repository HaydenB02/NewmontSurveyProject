<template>
  <b-card id="surveyCard" class="text-center">
    <!--Survey Controls-->
    <b-form inline>
      <!--Labels-->
      <h6 id="priority">Priority: {{surveyGroup.priority}}</h6>
      <h6 id="type">Survey Type: {{surveyGroup.surveyType}}</h6>
      <!--Checkboxes-->
      <div id="checkboxes">
        <b-form-checkbox v-if="surveyGroup === surveyGroups[0]" :checked="true" v-model="selected">{{selected}}</b-form-checkbox>
        <b-form-checkbox v-else v-model="selected">{{selected}}</b-form-checkbox>
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
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
    
//Data Stores
import Data, { SurveyGroup } from "../../store/modules/data";
    
//UI Components
import SurveyTable from "./survey_table.vue";
    
//Icons
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

  get surveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(i => i.priority === this.card_id);
  }

  get selected(): boolean {
    return Data.state.surveyGroups.find(i => i.priority === this.card_id).isSelected;
  }

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