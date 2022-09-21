<template>
    <div id="visualizer">
      <div v-if="posts.length > 0">
        <div v-if="view == 'grid'">
          <post-card v-for="post in posts" :key="post.id" :item_id="post.id" />
        </div>
        <div v-else>
          <post-table />
        </div>
        <div v-if="isLoading" id="loadingSpinnerWrapper">
          <scale-loader id="loadingSpinner" color="#fff" />
        </div>
      </div>
      <div v-else class="text-center mt-5">
        <h2>Use the controls on the left to load some data</h2>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Vue from "vue";
  import { Component } from "vue-property-decorator";
  
  //Data Stores
  import App from "../store/modules/app";
  import Data, { Post } from "../store/modules/data";
  
  //UI Components
  import PostCard from "./posts/post_card.vue";
  import PostTable from "./posts/post_table.vue";
  import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
  
  //Icons
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
  library.add(faPlus, faCog);
  
  @Component({
    components: {
      Icon,
      PostCard,
      ScaleLoader,
      PostTable
    }
  })
  export default class Posts extends Vue {
    get posts(): Array<Post> {
      if(Data.state.search_results.length > 0) return Data.state.search_results;
      return Data.state.posts;
    }
  
    get isLoading(): boolean {
      return App.state.isLoading;
    }
  
    get view(): string {
      return App.state.view;
    }
  
  }
  </script>
  
  <!-- Global Style -->
  <style>
  </style>
  
  <!-- Local Style -->
  <style scoped>
  
    #posts {
      position: absolute;
      top: 0px;
      padding: 1em;
      margin-left: 25em;
      width: calc(100% - 25em);
      height: 100%;
      overflow-y: scroll;
    }
  
    #header {
      padding-bottom: 2em;
    }
  
    #loadingSpinnerWrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000A;
    }
  
    #loadingSpinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  
  </style>