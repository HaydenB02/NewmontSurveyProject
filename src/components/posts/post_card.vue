<template>
  <b-card id="postCard" class="text-center" @click="viewPost()">
    <h5>{{post.title}}</h5>
  </b-card>
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
export default class PostCard extends Vue {
  @Prop({type: Number}) item_id!: number;

  viewPost() {
    this.$router.push('/' + this.post.id);
  }

  get post(): Post {
    return Data.state.posts.find(i => i.id === this.item_id);
  }
}
</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>

  #postCard {
    cursor: pointer;
    margin-bottom: 1em;
  }

</style>