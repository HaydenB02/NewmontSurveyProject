<template>
  <div id="threeSetup">
    <survey-model v-for="survey in selectedSurveyGroups" :survey="survey" :key="survey"/>
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

//UI Components
import SurveyModel from "./surveys/survey_model.vue";

@Component({
  components: {
    SurveyModel,
  }
})
export default class ThreeSetup extends Vue {
  renderer: Three.Renderer = null;
  camera: Three.PerspectiveCamera = null;
  controls: OrbitControls = null;
  container: HTMLElement = null;
  scene: Three.Scene = Data.state.scene;

  mounted() {
    this.container = document.getElementById('threeSetup');
    window.addEventListener('resize', this.onWindowResize, false);

    this.renderer = new Three.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight-1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth/this.container.clientHeight, 1, 10000);
    this.scene = new Three.Scene();
    this.scene.add(new Three.AxesHelper(5));

    this.camera.position.x = 0;
    this.camera.position.y = 10;
    this.camera.position.z = 0;
    this.camera.lookAt(20, 0, 0);
  
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
    // required if controls.enableDamping or controls.autoRotate are set to true
    this.controls.update();
    this.renderer.render( this.scene, this.camera );
  }

  get selectedSurveyGroups(): Array< SurveyGroup > {
    return Data.state.surveyGroups.filter(e => e.isSelected);
  }

  get referenceSurveyGroup(): SurveyGroup {
    return Data.state.surveyGroups.find(e => e.isReference); 
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
  }
</style>