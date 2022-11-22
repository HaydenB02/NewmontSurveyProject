<template>
  <!-- Display Survey Models -->
  <div id="threeSetup">
    <div v-if="!isLoading">
    <survey-model v-for="survey in selectedSurveyGroups" :survey="survey" :key="hole.holeRowId + survey.priority" />
    </div>
  </div>
</template>



<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script lang="ts">
//Vue Imports
import Vue from 'vue';
import { Component} from "vue-property-decorator";

//Three Imports
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

//Data Stores
import Data, { Hole, Survey, SurveyGroup, ThreeContainer } from "../store/modules/data";
import App from "../store/modules/app";

//UI Components
import SurveyModel from "./surveys/survey_model.vue";

@Component({
  components: {
    SurveyModel,
  }
})
export default class ThreeSetup extends Vue {
  dragControls: DragControls = null;
  container: HTMLElement = null;

  mounted() {
    //Set up three container
    let threeContainer: any = {
      scene: null,
      camera: null,
      renderer: null,
      moveables: new Array<Three.Mesh>(),
      orbitControls: null,
    }
    
    //Find allowed size
    this.container = document.getElementById('threeSetup');
    window.addEventListener('resize', this.onWindowResize, false);

    //Setup renderer
    threeContainer.renderer = new Three.WebGLRenderer({antialias: true});
    threeContainer.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(threeContainer.renderer.domElement);

    //Setup camera and scene
    threeContainer.camera = new Three.PerspectiveCamera(70, this.container.clientWidth/this.container.clientHeight);
    threeContainer.scene = new Three.Scene();
    threeContainer.scene.add(new Three.AxesHelper(5));

    
    /*
    //Drag Controls
    //Incomplete, delete lines 62 and 98 to enable
    //Dragging dots works, but does not save their position or recalculate the lines
    //Adding a survey disables the movement on all other surveys, unless that dot had been moved before

    this.dragControls = new DragControls(threeContainer.moveables, threeContainer.camera, threeContainer.renderer.domElement);
    this.dragControls.activate();

    //When dragging, stop orbit controls and find the original point
    let oldPoint: any = {
      x: 0,
      y: 0,
      z: 0,
    }
    this.dragControls.addEventListener( 'dragstart', this.stopOrbit);
    this.dragControls.addEventListener( 'dragstart', function(event) {
      oldPoint.x = event.object.position.x;
      oldPoint.y = event.object.position.y;
      oldPoint.z = event.object.position.z;
    });
    
    //When done dragging, resume orbit controls and find new point
    let newPoint: any = {
      x: 0,
      y: 0,
      z: 0,
    }
    this.dragControls.addEventListener( 'dragend', this.startOrbit);
    this.dragControls.addEventListener( 'dragend', function(event) {
      newPoint.x = event.object.position.x;
      newPoint.y = event.object.position.y;
      newPoint.z = event.object.position.z;
    });
    */

    //Orbit Controls
    threeContainer.orbitControls = new OrbitControls(threeContainer.camera, threeContainer.renderer.domElement);
    threeContainer.orbitControls.enableDamping = true;
    threeContainer.orbitControls.dampingfactor = 0.25;
    threeContainer.renderer.render(threeContainer.scene, threeContainer.camera);
  
    //Finalize threeContainer
    threeContainer.scene.background = new Three.Color('black');
    this.threeContainer = threeContainer;

    //Animate the scene
    this.animate();
  }

  onWindowResize() {
    this.threeContainer.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.threeContainer.camera.updateProjectionMatrix();
    this.threeContainer.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.threeContainer.renderer.render(this.threeContainer.scene, this.threeContainer.camera);
  }

  animate() {
    requestAnimationFrame( this.animate );
    this.threeContainer.renderer.render( this.threeContainer.scene, this.threeContainer.camera );
  }

  stopOrbit() {
    this.threeContainer.orbitControls.enabled = false;
  }

  startOrbit() {
    this.threeContainer.orbitControls.enabled = true;
  }

  get surveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups;
  }

  get selectedSurveyGroups(): Array<SurveyGroup> {
    return Data.state.surveyGroups.filter(e => e.isSelected);
  }

  get referenceSurveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(e => e.isReference); 
  }

  get hole(): Hole {
    return Data.state.hole;
  }

  get threeContainer(): ThreeContainer {
    return Data.state.threeContainer;
  }

  get isLoading(): boolean {
    return App.state.isLoading;
  }

  set threeContainer(c: ThreeContainer) {
    Data.state.threeContainer = c;
  }
}
</script>

<!-- Local Style -->
<style scoped>
  #threeSetup {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 65%;
    height: 100%;
    background-color: blue;
    overflow-y: hidden;
  }
</style>