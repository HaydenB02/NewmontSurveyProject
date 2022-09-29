<template>
    <div id="survey">

        <div v-for="survey in surveyGroups" :key="survey.priority" :value="survey">
          <b-card id="survey-card">

            <b-form inline>
              <h4 id="priority-title">Priority: {{survey.priority}}</h4>
              <b-checkbox></b-checkbox>
            </b-form>

            <b-form inline>
              <h6 id="type-title">Survey Type: {{survey.surveyType}}</h6>
              <b-button v-b-toggle.table-collapse id="dropdown">v</b-button>
              <b-collapse id="table-collapse">hi</b-collapse>
            </b-form>

          </b-card>
        </div>

    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Watch } from "vue-property-decorator";
    
    //Data Stores
    import App, { AppState } from "../store/modules/app";
    import Data, { HoleName, SurveyGroup } from "../store/modules/data";
    
    //UI Components
    import Toolbar from "./toolbar.vue";
    
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
    export default class Surveys extends Vue {

    }
    </script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>
</style>
