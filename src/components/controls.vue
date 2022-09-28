<template>
  <div id="controls">
      <b-card id="data-card" class="text-center">

        
        <b-form inline>
          <b-form-select id="hole-dropdown" v-model="selectedHole">
            <b-form-select-option v-for="hole in holeNames" :key="hole.holeRowId" :value="hole.filename">{{hole.holeId}}</b-form-select-option>
          </b-form-select>
          <b-form-select id="priority-dropdown" v-model="selectedSurvey" :aria-placeholder=selectedSurvey>
            <b-form-select-option v-for="survey in surveyGroups" :key="survey.priority" :value="survey">{{survey.priority}}</b-form-select-option>
          </b-form-select>
          <b-form-input id="difference-input" v-model="allowedPercent" type="number" min="0" max="100" placeholder="% Difference"></b-form-input>
        </b-form>

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



      </b-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

//Data Stores
import App, { AppState } from "../store/modules/app";
import Data, { HoleName, SurveyGroup } from "../store/modules/data";

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
export default class Controls extends Vue {
  selectedHole = "";
  selectedSurvey = 1;
  @Watch('selectedHole', {immediate: true})
  onChildChanged(val: string, oldVal: string) {
    //Load the json in selected
    Data.commitGetHole({filename: val});
  }

  get holeNames(): Array<HoleName> {
    return Data.state.holeNames;
  }

  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }

  get view(): string {
    return App.state.view;
  }

  set view(view: string) {
    App.state.view = view;
  }

  get search(): string {
    return App.state.search;
  }

  set search(search: string) {
    Data.commitSearch({search});
    App.state.search = search;
  }

  get data_url(): string {
    return App.state.data_url;
  }

  set data_url(url: string) {
    App.state.data_url = url;
    //Save user-entered data URL to local browser cache
    localStorage.setItem('dataUrl', url);
  }
}
</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>

  #controls {
    width: 50%;
    height: 100%;
    background-color: red;
  }

  #data-card {
    width: 100%
  }

  #hole-dropdown {
    width: 40%
  }

  #priority-dropdown {
    width: 20%
  }

  #difference-input {
    width: 20%
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