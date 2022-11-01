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

  surveys: Array<Survey> = this.survey.surveys;

  mounted(){
    //create drawing material
    let dotGeometry = new Three.SphereGeometry(1, 10, 10);
    let goodMaterial = new Three.MeshBasicMaterial({
      color: new Three.Color("Green")
    });
    let badMaterial = new Three.MeshBasicMaterial({
      color: new Three.Color("Red")
    })
    
    //draw first dot
    let dot = new Three.Mesh(dotGeometry, goodMaterial);
    let point = this.surveys[0].point;
    dot.position.set(point.x, point.y, point.z);
    this.scene.add(dot);
    console.log(point);

    //draw remaining dots and lines from previous dot to current dot
    for(let i=1; i<this.surveys.length; i++){
      let loopDot: Three.Mesh;
        if(this.surveys[i].point.inRange){
          loopDot = new Three.Mesh(dotGeometry, goodMaterial);
        }
        else{
          loopDot = new Three.Mesh(dotGeometry, badMaterial);
        }

        let lastPoint = this.surveys[i-1].point;
        point = this.surveys[i].point;

        console.log(point);
        loopDot.position.set(point.x, point.z, point.y);
        this.scene.add(loopDot);


        this.survey.surveys[i].point
    }
  }

  get scene(): Three.Scene {
    return Data.state.scene;
  }
    
}
</script>

