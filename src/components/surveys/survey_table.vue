<template>
    <vue-good-table
    :columns = "columns"
    :row = ""
    >

    </vue-good-table>
</template>


<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    
    //Data Stores
    import App from "../../store/modules/app";
    import Data, { Survey } from "../../store/modules/data";
    
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
          filterOptions: {
            enabled: true,
            filterValue: this.filters.id
          }
        },
        {
          label: 'Incline',
          field: 'incline',
          type: 'number',
          filterOptions: {
            enabled: true,
            filterValue: this.filters.title
          }
        },
        {
          label: 'AziTrueNorth',
          field: 'aziNorth',
          type: 'string'
        },
      ];
    

      get posts(): Array<Survey> {
        if(Data.state.search_results.length > 0) return Data.state.search_results;
        return Data.state.survey;
      }

      get filters(): any {
        return App.state.table.filters;
      }
    
      get currentTablePage(): number {
        return App.state.table.page;
      }
    
      set currentTablePage(currentTablePage: number) {
        App.state.table.page = currentTablePage;
      }
    
      get currentPerPage(): number {
        return App.state.table.page_size;
      }
    
      set currentPerPage(currentPerPage: number) {
        App.state.table.page_size = currentPerPage;
      }
    
      get tableSort(): Array<any> {
        return App.state.table.sort;
      }
    
      set tableSort(tableSort: Array<any>) {
        App.state.table.sort = tableSort;
      }
    
      onColumnFilter(params: any) {
        if(params.columnFilters.id) Vue.set(this.filters, 'id', params.columnFilters.id);
        if(params.columnFilters.title) Vue.set(this.filters, 'title', params.columnFilters.title);
        if(params.columnFilters.body) Vue.set(this.filters, 'body', params.columnFilters.body);
        if(params.columnFilters.userId) Vue.set(this.filters, 'userId', params.columnFilters.userId);
      }
      
      onRowClick(params: any) {
        this.$router.push('/' + params.row.id);
      }
      
      onPageChange(params: any) {
        this.currentTablePage = params.currentPage;
      }
      
      onPerPageChange(params: any) {
        this.currentPerPage = params.currentPerPage;
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