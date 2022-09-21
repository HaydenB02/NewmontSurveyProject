<template>
  <div id="post" class="text-center">
    <b-button id="backButton" @click="backToHome()">
      <icon icon="arrow-left" class="icon" /> Back to posts
    </b-button>
    <h1 class="mt-5">{{post.title}}</h1>
    <b-card class="mt-5">
      <p>{{post.body}}</p>
    </b-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

//Data Stores
import App from "../store/modules/app";
import Data, { Post } from "../store/modules/data";

//UI Components

//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
library.add(faArrowLeft);

@Component({
  components: {
    Icon
  }
})
export default class PostPage extends Vue {
  //Watch for change to url route and load correct item by id
  @Watch('$route.params.id', {immediate: true})
  onChildChanged(val: string, oldVal: string) {
    this.item_id = val;
  }

  mounted() {
    if(this.post == null) this.$router.push('/');
  }

  backToHome() {
    this.$router.push('/');
  }

  item_id = "";

  get post(): Post {
    return Data.state.posts.find(i => i.id === Number(this.item_id));
  }
}
</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>

  #post {
    position: absolute;
    top: 0px;
    padding: 2em;
    margin-left: 25em;
    width: calc(100% - 25em);
    height: 100%;
  }

  #backButton {
    position: absolute;
    top: 1em;
    left: 1em;
  }

</style>