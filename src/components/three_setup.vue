<template>
  <div id="threeSetup">
    <div v-if="!isLoading">
    <survey-model v-for="survey in selectedSurveyGroups" :survey="survey" :key="survey.holeId + survey.priority * 10000"/>
    </div>
  </div>
</template>

<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script lang="ts">
import Vue from 'vue';
import { Component} from "vue-property-decorator";

//Three Imports
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Data Stores
import Data, { SurveyGroup } from "../store/modules/data";
import App from "../store/modules/app";

//UI Components
import SurveyModel from "./surveys/survey_model.vue";

@Component({
  components: {
    SurveyModel,
  }
})
export default class ThreeSetup extends Vue {
  controls: OrbitControls = null;
  container: HTMLElement = null;

  mounted() {
    this.container = document.getElementById('threeSetup');
    window.addEventListener('resize', this.onWindowResize, false);

    this.renderer = new Three.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth/this.container.clientHeight, 1, 10000);
    this.scene = new Three.Scene();
    this.scene.add(new Three.AxesHelper(5));

    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    if(this.referenceSurveyGroup != undefined){
      let midID = Math.floor(this.referenceSurveyGroup.surveys.length / 2);
      let midPoint = this.referenceSurveyGroup.surveys[midID].point;
      this.camera.lookAt(midPoint.x, midPoint.z, midPoint.y);
    }
    else{
      this.camera.lookAt(0, 0, 0);
    }
  
    this.scene.background = new Three.Color('black');
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.animate();
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame( this.animate );
    this.renderer.render( this.scene, this.camera );
  }

  get selectedSurveyGroups(): Array< SurveyGroup > {
    return Data.state.surveyGroups.filter(e => e.isSelected);
  }

  get referenceSurveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(e => e.isReference); 
  }

  get scene(): Three.Scene {
    return Data.state.scene;
  }

  get camera(): Three.PerspectiveCamera {
    return Data.state.camera;
  }

  get renderer(): Three.Renderer {
    return Data.state.renderer;
  }

  set scene(s: Three.Scene) {
    Data.state.scene = s;
  }

  set camera(c: Three.PerspectiveCamera) {
    Data.state.camera = c;
  }

  set renderer(r: Three.Renderer) {
    Data.state.renderer = r;
  }

  get isLoading(): boolean {
    return App.state.isLoading;
  }
}

</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>
  #threeSetup {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    background-color: blue;
    overflow-y: hidden;
  }
</style>