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
    import App from "../../store/modules/app";
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
    

    @Prop({type: Number}) table_id!: number;

    get surveyGroup(): SurveyGroup {
      console.log(Data.state.surveyGroups.find(i => i.priority === this.table_id).surveys);
      return Data.state.surveyGroups.find(i => i.priority === this.table_id);
    }

    
      get tableSort(): Array<any> {
        return App.state.table.sort;
      }
    
      set tableSort(tableSort: Array<any>) {
        App.state.table.sort = tableSort;
      }
    
      
      onRowClick(params: any) {
        this.$router.push('/' + params.row.id);
      }
    
      onSortChange(params: any) {
        this.tableSort = params;
      }
    
      onSearch(params: any) {
        //This does not connect to the 'search' string in our App State
        //This could be used to supply the in-table search term to our state and use elsewhere:
    
        //this.search = params.searchTerm;
      }
    }
    </script>
    
    <!-- Global Style -->
    <style>
    </style>
    
    <!-- Local Style -->
    <style scoped>
    
    </style>