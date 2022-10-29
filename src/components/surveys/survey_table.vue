<template>
    <vue-good-table
    :columns = "columns"
    :rows = "surveyGroup.surveys"
    max-height="20em"
    />

</template>


<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    
    //Data Stores
    import Data, { Survey, SurveyGroup } from "../../store/modules/data";
    
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