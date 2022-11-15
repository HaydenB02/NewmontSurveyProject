<template>
</template>



<script lang="ts">
import Vue from 'vue';
import { Component, Prop} from "vue-property-decorator";

//Three Imports
import * as Three from 'three';

//Data Stores
import Data, { Survey, SurveyGroup, ThreeContainer } from "../../store/modules/data";

@Component({
  components: {}
})
export default class SurveyModel extends Vue {
  @Prop() survey!: SurveyGroup;

  surveys: Array<Survey> = this.survey.surveys;
  ids: Array<number> = [];  //used to delete previous models

  mounted(){
    //If this is the reference survey, focus controls on the middle point of this survey
    if(this.survey.isReference){
      let midID = Math.floor(this.survey.surveys.length / 2);
      let midPoint = this.survey.surveys[midID].point;
      let midVector = new Three.Vector3(midPoint.x, midPoint.z, midPoint.y);
      this.threeContainer.orbitControls.target = midVector;
    }

    //Create drawing material
    let dotGeometry = new Three.SphereGeometry(1, 10, 10);
    let goodMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Green")});
    let badMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Red")});
    
    //Draw first dot
    let dot = new Three.Mesh(dotGeometry, goodMaterial);
    let point = this.surveys[0].point;
    dot.position.set(point.x, point.y, point.z);
    this.ids.push(dot.id);
    this.threeContainer.scene.add(dot);

    //Collect dot objects for drag controls
    this.threeContainer.moveables.push(dot);

    //Draw remaining dots and lines from previous dot to current dot
    for(let i=1; i<this.surveys.length; i++){
      //Create next dot based on inRange variable
      let loopDot: Three.Mesh;
      if(this.surveys[i].point.inRange){
        loopDot = new Three.Mesh(dotGeometry, goodMaterial);
      }
      else{
        loopDot = new Three.Mesh(dotGeometry, badMaterial);
      }
      this.ids.push(loopDot.id);

      //Find current point and set current dots position accordingly
      point = this.surveys[i].point;
      loopDot.position.set(point.x, point.z, point.y);

      //Draw dot and add to moveables for Drag Controls
      this.threeContainer.scene.add(loopDot);
      this.threeContainer.moveables.push(loopDot);
        
      //Find vectors for the previous and current point
      let lastPoint = this.surveys[i-1].point;
      let lastVector = new Three.Vector3(lastPoint.x, lastPoint.z, lastPoint.y);
      let vector = new Three.Vector3(point.x, point.z, point.y);

      //Create line based on isReference variable
      let lineMaterial: Three.MeshBasicMaterial;
      if(this.survey.isReference){
        lineMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Green")});
      }
      else{
        lineMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Blue")});
      }
      let curve = new Three.LineCurve3(lastVector, vector);
      let lineGeom = new Three.TubeGeometry(curve, 1, 0.5, 8, false);
      let line = new Three.Mesh(lineGeom, lineMaterial);

      //Draw line and add ID for deleting
      this.ids.push(line.id);
      this.threeContainer.scene.add(line);
    }
  }

  destroyed() {
    //remove unselected surveys
    for(let i=0; i<this.ids.length; i++){
      this.threeContainer.scene.remove(this.threeContainer.scene.getObjectById(this.ids[i]));
    }
  }

  get selectedSurveyGroups(): Array< SurveyGroup > {
    return Data.state.surveyGroups.filter(e => e.isSelected);
  }

  get threeContainer(): ThreeContainer {
    return Data.state.threeContainer;
  }
    
}
</script>

