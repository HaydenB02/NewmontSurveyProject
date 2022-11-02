<template>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop} from "vue-property-decorator";

//Three Imports
import * as Three from 'three';

//Data Stores
import Data, { Survey, SurveyGroup } from "../../store/modules/data";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



@Component({
  components: {}
})
export default class SurveyModel extends Vue {
  @Prop() survey!: SurveyGroup;

  surveys: Array<Survey> = this.survey.surveys;
  ids: Array<number> = [];

  mounted(){
    //check ref
    let camera = new Three.PerspectiveCamera();
    if(this.survey.isReference){
      let midID = Math.floor(this.survey.surveys.length / 2);
      let midPoint = this.survey.surveys[midID].point;
      camera.lookAt(midPoint.x, midPoint.z, midPoint.y);
      console.log("isRef");
    }
    else{
      camera.lookAt(0, 0, 0);
      console.log("notRef")
    }

    //add new controls
    let controls = new OrbitControls(camera, this.renderer.domElement);
    controls.update();
    this.renderer.render(this.scene, camera);

    //create drawing material
    let dotGeometry = new Three.SphereGeometry(1, 10, 10);
    let goodMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Green")});
    let badMaterial = new Three.MeshBasicMaterial({color: new Three.Color("Red")});
    
    //draw first dot
    let dot = new Three.Mesh(dotGeometry, goodMaterial);
    let point = this.surveys[0].point;
    dot.position.set(point.x, point.y, point.z);
    this.ids.push(dot.id);
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
      this.ids.push(loopDot.id);

      point = this.surveys[i].point;

      loopDot.position.set(point.x, point.z, point.y);
      this.scene.add(loopDot);
        
      //draw line from previous dot to this dot
      let lastPoint = this.surveys[i-1].point;

      let lastVector = new Three.Vector3(lastPoint.x, lastPoint.z, lastPoint.y);
      let vector = new Three.Vector3(point.x, point.z, point.y);

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
      this.ids.push(line.id);
      this.scene.add(line);
    }
    console.log(this.ids);
  }

  destroyed() {
    //remove unselected surveys
    console.log(this.ids);
    for(let i=0; i<this.ids.length; i++){
      this.scene.remove(this.scene.getObjectById(this.ids[i]));
    }
  }

  get scene(): Three.Scene {
    return Data.state.scene;
  }

  get renderer(): Three.Renderer {
    return Data.state.renderer;
  }

  get selectedSurveyGroups(): Array< SurveyGroup > {
    return Data.state.surveyGroups.filter(e => e.isSelected);
  }
    
}
</script>

