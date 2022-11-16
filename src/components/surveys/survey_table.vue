<template>
  <vue-good-table
  :columns = "columns"
  :rows = "surveyGroup.surveys"
  max-height="20em"
  >
  
  <template slot="table-row" slot-scope="props">
    <!-- Check inRange -->
    <span id="error-checker">
      <!-- If not in range, make inputs bold and red -->
      <span v-if="isError(props.row)">
        <span v-if="props.column.field == 'depth'">
          <span><input v-model="props.row.depth" id="error" /></span>
        </span>
        <span v-if="props.column.field == 'inclination'">
          <span><input v-model="props.row.inclination" id="error" /></span>
        </span>
        <span v-if="props.column.field == 'aziTrueNth'">
          <span><input v-model="props.row.aziTrueNth" id="error" /></span>
        </span>
      </span>

      <!-- Otherwise, make normal inputs -->
      <span v-else>
        <span v-if="props.column.field == 'depth'">
          <span><input v-model="props.row.depth" id="valid" /></span>
        </span>
        <span v-if="props.column.field == 'inclination'">
          <span><input v-model="props.row.inclination" id="valid" /></span>
        </span>
        <span v-if="props.column.field == 'aziTrueNth'">
          <span><input v-model="props.row.aziTrueNth" id="valid" /></span>
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

    //Consistently update inRange highlights
    @Watch("allowedDistance", {immediate: true})
    @Watch("referenceSurvey", {immediate: true})
    onErrorChanged(val: any, oldVal: any) {
      if(document.getElementById("error-checker")){
        //TODO: reload error checker to update which cells should be red
      }
    }

    //Consistently check for inputs from the table
    // @Watch("props", {immediate: true})
    // onInput(val: any, oldVal: any) {
    //   if(this.props){
        
    //   }
    // }
      
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

    isError(row: any) {
      return !row.point.inRange;
    }

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
    color: red;
    font-weight: bold;
    width: 5em;
    border-style: hidden;
    text-align: right;
  }

  #valid {
    width: 5em;
    border-style: hidden;
    text-align: right;
  }
</style>