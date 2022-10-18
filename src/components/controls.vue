<template>
  <div id="controls">
      <b-card id="data-card" class="text-center">
  
        <toolbar />
        <surveys />

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
import Toolbar from "./toolbar.vue";
import Surveys from "./surveys.vue";

//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faCog);

@Component({
  components: {
    Toolbar,
    Surveys,
    Icon
  }
})
export default class Controls extends Vue {
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
    background-color: white;
    overflow-y: auto;
  }
</style>