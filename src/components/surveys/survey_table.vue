<template>
  <vue-good-table
  :columns = "columns"
  :rows = "surveyGroup.surveys"
  max-height="20em"
  >
    <!-- make table editable -->

    
  </vue-good-table>

</template>


<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    
    //Data Stores
    import Data, { SurveyGroup } from "../../store/modules/data";
    
    @Component({
      components: {
      }
    })
    export default class PostTable extends Vue {
      @Prop({type: Number}) table_id!: number;
      
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

      rows: Array<Object> = [];

      mounted() {
        for(let i=0; i<this.surveyGroup.surveys.length; i++){
          let survey = this.surveyGroup.surveys[i];
          let row: any = null;
          if(survey.point.inRange){
            row = {
            id: i,
            depth: survey.depth,
            inclination: survey.inclination,
            aziTrueNth: survey.aziTrueNth,
            }
          }
          else{
            row= {
            id: i,
            depth: survey.depth,
            inclination: survey.inclination,
            aziTrueNth: survey.aziTrueNth,
            _rowVariant: "danger"
          }
          }
          this.rows.push(row);
        }
      }

      get surveyGroup(): SurveyGroup {
        return Data.state.surveyGroups.find(i => i.priority === this.table_id);
      }

    }
    </script>
    
    <!-- Global Style -->
    <style>
    </style>
    
    <!-- Local Style -->
    <style scoped>
    
    </style>