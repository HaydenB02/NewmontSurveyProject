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
    let dotGeometry = new Three.SphereGeometry(1/this.selectedSurveyGroups.length, 10, 10);
    let goodMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Green")});
    let badMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Red")});
    
    //draw first dot
    let dot = new Three.Mesh(dotGeometry, goodMaterial);
    let point = this.surveys[0].point;
    dot.position.set(point.x, point.y, point.z);
    this.scene.add(dot);
    console.log(point);

    //draw remaining dots and lines from previous dot to current dot
    for(let i=1; i<this.surveys.length; i++){
      //draw next dot
      let loopDot: Three.Mesh;
      if(this.surveys[i].point.inRange){
        loopDot = new Three.Mesh(dotGeometry, goodMaterial);
      }
      else{
        loopDot = new Three.Mesh(dotGeometry, badMaterial);
      }

      point = this.surveys[i].point;

      console.log(point);
      loopDot.position.set(point.x, point.z, point.y);
      this.scene.add(loopDot);
        
      //draw line from previous dot to this dot
      let lastPoint = this.surveys[i-1].point;

      let lastVector = new Three.Vector3(lastPoint.x, lastPoint.z, lastPoint.y);
      let vector = new Three.Vector3(point.x, point.z, point.y);

      let lineMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Green")});
      let curve = new Three.LineCurve3(lastVector, vector);
      let lineGeom = new Three.TubeGeometry(curve, 1, 0.5/this.selectedSurveyGroups.length, 8, false);

      let line = new Three.Mesh(lineGeom, lineMaterial);
      this.scene.add(line);
    }
  }

  get scene(): Three.Scene {
    return Data.state.scene;
  }

  get selectedSurveyGroups(): Array< SurveyGroup > {
    return Data.state.surveyGroups.filter(e => e.isSelected);
  }
    
}
</script>

