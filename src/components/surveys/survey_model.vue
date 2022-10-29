<template>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop} from "vue-property-decorator";

//Three Imports
import * as Three from 'three';

//Data Stores
import Data, { Survey, SurveyGroup } from "../../store/modules/data";



@Component({
  components: {}
})
export default class SurveyModel extends Vue {
  @Prop() survey!: SurveyGroup;

  scene: Three.Scene = Data.state.scene;
  surveys: Array<Survey> = this.survey.surveys;

  mounted(){
    //create drawing material
    let dotGeometry = new Three.SphereGeometry(10, 5, 5);
    let material = new Three.MeshNormalMaterial();
    let dot = new Three.Mesh(dotGeometry, material);
    let path = new Three.Curve();
    
    //draw first dot
    let point = this.surveys[0].point;
    dot.position.set(point.x, point.y, point.z);
    this.scene.add(dot);

    for(let i=1; i<this.surveys.length; i++){
        
        let lastPoint = this.surveys[i-1].point;
        point = this.surveys[i].point;

        dot.position.set(point.x, point.y, point.z);
        this.scene.add(dot);


        this.survey.surveys[i].point
    }
  }
    
}
</script>

