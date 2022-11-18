<template>
  <vue-good-table
  :columns = "columns"
  :rows = "surveyGroup.surveys"
  max-height="20em"
  theme="nocturnal"
  >
  
  <template slot="table-row" slot-scope="props">
    <!-- Check inRange -->
    <span id="error-checker">
      <!-- If not in range, make inputs bold and red -->
      <span v-if="isError(props.row)">
        <span v-if="props.column.field == 'depth'">
          <span><b-form-input v-model="props.row.depth" id="error" @blur="updateDepth(props)"  /></span>
        </span>
        <span v-if="props.column.field == 'inclination'">
          <span><b-form-input v-model="props.row.inclination" id="error" @blur="updateIncline(props)" /></span>
        </span>
        <span v-if="props.column.field == 'aziTrueNth'">
          <span><b-form-input v-model="props.row.aziTrueNth" id="error" @blur="updateAzi(props)" /></span>
        </span>
      </span>

      <!-- Otherwise, make normal inputs -->
      <span v-else>
        <span v-if="props.column.field == 'depth'">
          <span><b-form-input v-model="props.row.depth" id="valid" @blur="updateDepth(props)" /></span>
        </span>
        <span v-if="props.column.field == 'inclination'">
          <span><b-form-input v-model="props.row.inclination" id="valid" @blur="updateIncline(props)" /></span>
        </span>
        <span v-if="props.column.field == 'aziTrueNth'">
          <span><b-form-input v-model="props.row.aziTrueNth" id="valid" @blur="updateAzi(props)" /></span>
        </span>
      </span>
    </span>
  </template>

  </vue-good-table>
</template>



<script lang="ts">
  //Vue Imports
  import Vue from "vue";
  import { Component, Prop, Watch } from "vue-property-decorator";
    
  //Data Stores
  import Data, { SurveyGroup } from "../../store/modules/data";

  @Component({
    components: {
    }
  })
  export default class PostTable extends Vue {
    @Prop({type: Number}) table_id!: number;
    props: any = null;


    isError(row: any) {
      return !row.point.inRange;
    }

    //Consistently update inRange highlights
    @Watch("allowedDistance", {immediate: true})
    @Watch("referenceSurvey", {immediate: true})
    onErrorChanged(val: any, oldVal: any) {
      if(document.getElementById("error-checker")){
        //TODO: reload error checker to update which cells should be red
      }
    }


    //TODO: get the following 3 functions to update the scene.
    updateDepth(prop: any) {
      let survey = this.surveyGroup.surveys[prop.index];
      survey.depth = parseFloat(prop.row.depth);
      let newSG = this.surveyGroup;
      newSG.surveys[prop.index] = survey;
      let index = Data.state.surveyGroups.indexOf(this.surveyGroup);
      Vue.set(Data.state.surveyGroups, index, newSG);
      this.recalcPoints();
      Data.commitResetRange();
    }

    updateIncline(prop: any) {
      let survey = this.surveyGroup.surveys[prop.index];
      survey.inclination = parseFloat(prop.row.inclination);
      let newSG = this.surveyGroup;
      newSG.surveys[prop.index] = survey;
      let index = Data.state.surveyGroups.indexOf(this.surveyGroup);
      Vue.set(Data.state.surveyGroups, index, newSG);
      this.recalcPoints();
      Data.commitResetRange();
    }

    updateAzi(prop: any) {
      let survey = this.surveyGroup.surveys[prop.index];
      survey.aziTrueNth = parseFloat(prop.row.aziTrueNth);
      let newSG = this.surveyGroup;
      newSG.surveys[prop.index] = survey;
      let index = Data.state.surveyGroups.indexOf(this.surveyGroup);
      Vue.set(Data.state.surveyGroups, index, newSG);
      this.recalcPoints();
      Data.commitResetRange();
    }
      
    recalcPoints() {
      //Create temporary point variable and current surveys array
      let surveys = this.surveyGroup.surveys;
      let point: any = {
        x: null,
        y: null,
        z: null,
        depth: null,
        inRange: null
      }

      //Create first point, always the same, always in range
      point.x = 0;
      point.y = 0;
      point.z = 0;
      point.depth = surveys[0].depth;
      point.inRange = true;
      surveys[0].point = JSON.parse(JSON.stringify(point));

      //Find every other point
      for(let i=1; i<surveys.length; i++){
        let lastSurvey = surveys[i-1];
        let diffDepth = surveys[i].depth - lastSurvey.depth;
        let aziRads = lastSurvey.aziTrueNth * Math.PI / 180;
        let inclineRads = lastSurvey.inclination * Math.PI / 180;
        let lastPoint = lastSurvey.point;

        //Calculate new points position
        point.x = lastPoint.x + (diffDepth * Math.sin(aziRads));
        point.y = lastPoint.y + (diffDepth * Math.cos(aziRads));
        point.z = lastPoint.z + (diffDepth * Math.sin(inclineRads));
        point.depth = surveys[i].depth;

        //Set current point to calculated point variable
        surveys[i].point = JSON.parse(JSON.stringify(point));
      }
    }

    columns = [
      {
        label: 'Depth',
        field: 'depth',
        type: 'number',
      },
      {
        label: 'Inclination',
        field: 'inclination',
        type: 'number',
      },
      {
        label: 'AziTrueNorth',
        field: 'aziTrueNth',
        type: 'number'
      },
    ];

    get surveyGroup(): SurveyGroup {
      return Data.state.surveyGroups.find(i => i.priority === this.table_id);
    }

    get allowedDistance(): number {
      return Data.state.allowedDistance;
    }

    get referenceSurvey(): SurveyGroup {
      return Data.state.surveyGroups.find(e => e.isReference);
    }

  }
</script>



<!-- Local Style -->
<style scoped>
  #error {
    width: 5em;
    color: red;
    background-color: #324057;
    border-style: hidden;
    font-weight: bold;
    text-align: right;
    float: right;
  }

  #valid {
    width: 5em;
    color: lightgray;
    background-color: #324057;
    border-style: hidden;
    text-align: right;
    float: right;
  }
</style>