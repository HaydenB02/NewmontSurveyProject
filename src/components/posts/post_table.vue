<template>
  <vue-good-table
    :columns="columns"
    :rows="posts"
    :pagination-options="{
      enabled: true,
      mode: 'records',
      perPage: currentPerPage,
      position: 'top',
      perPageDropdown: [5, 10, 25, 50],
      dropdownAllowAll: true,
      setCurrentPage: currentTablePage,
      jumpFirstOrLast : true,
      firstLabel : 'First Page',
      lastLabel : 'Last Page',
      nextLabel: 'next',
      prevLabel: 'prev',
      rowsPerPageLabel: 'Rows per page',
      ofLabel: 'of',
      pageLabel: 'page', // for 'pages' mode
      allLabel: 'All'
    }"
    :sort-options="{
      enabled: true,
      multipleColumns: true,
      initialSortBy: tableSort,
    }"
    :search-options="{
      enabled: true,
      trigger: 'enter',
      skipDiacritics: true,
      placeholder: 'vue-good-table allows for built in search'
    }"
    @on-row-click="onRowClick"
    @on-page-change="onPageChange"
    @on-per-page-change="onPerPageChange"
    @on-sort-change="onSortChange"
    @on-column-filter="onColumnFilter"
    @on-search="onSearch"/>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

//Data Stores
import App from "../../store/modules/app";
import Data, { Post } from "../../store/modules/data";

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
      label: 'ID',
      field: 'id',
      type: 'number',
      filterOptions: {
        enabled: true,
        filterValue: this.filters.id
      }
    },
    {
      label: 'Title',
      field: 'title',
      type: 'string',
      filterOptions: {
        enabled: true,
        filterValue: this.filters.title
      }
    },
    {
      label: 'Body',
      field: 'body',
      type: 'string'
    },
    {
      label: 'UserID',
      field: 'userId',
      type: 'number',
      filterOptions: {
        enabled: true,
        filterValue: this.filters.userId
      }
    }
  ];

  get filters(): any {
    return App.state.table.filters;
  }

  get posts(): Array<Post> {
    if(Data.state.search_results.length > 0) return Data.state.search_results;
    return Data.state.posts;
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