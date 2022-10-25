<template>
  <div id="tester"></div>
</template>

<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script lang="ts">
import Vue from 'vue';
import { Component} from "vue-property-decorator";

//Three Imports
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Data Stores
import Data from "../store/modules/data";


@Component({
  components: {}
})
export default class Tester extends Vue {
  renderer: Three.Renderer = null;
  camera: Three.PerspectiveCamera = null;
  controls: OrbitControls = null;
  container: HTMLElement = null;

  mounted() {
    this.container = document.getElementById('tester');
    window.addEventListener('resize', this.onWindowResize, false);

    this.renderer = new Three.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight-1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth/this.container.clientHeight, 1, 10000);
    Data.state.scene = new Three.Scene();
    Data.state.scene.add(new Three.AxesHelper(5));

    this.camera.position.x = 0;
    this.camera.position.y = 10;
    this.camera.position.z = 0;
  
    Data.state.scene.background = new Three.Color('black');
    
    let geometry = new Three.BoxGeometry(20, 20, 20);
    let material = new Three.MeshBasicMaterial({wireframe: true});
    let mesh = new Three.Mesh(geometry, material);

    mesh.position.x = 100;
    mesh.position.y = 0;
    mesh.position.z = 0;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.camera.lookAt(20, 0, 0);
    Data.state.scene.add(mesh);
    this.renderer.render(Data.state.scene, this.camera);

    this.animate();
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.render(Data.state.scene, this.camera);
  }

  animate() {
    requestAnimationFrame( this.animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    this.controls.update();
    this.renderer.render( Data.state.scene, this.camera );
  }
}



// export default{
//   name: 'Tester',
//   data: function(){
//     const container = document.getElementById('tester');

//     const camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
//     camera.position.z = 5;
//     let scene = new Three.Scene();

//     const geometry = new Three.BoxGeometry(20, 20, 20);
//     const material = new Three.MeshNormalMaterial();
//     const mesh = new Three.Mesh(geometry, material);

//     const renderer = new Three.WebGLRenderer({antialias: true});

//     return {
//       camera: camera,
//       scene: scene,
//       renderer: renderer,
//       mesh: mesh,
//       container: container,
//     }
//   },
//   components: {
//     Icon
//   },

//   mounted(){
//     let scene = new Three.Scene();
//     scene.add(this.mesh);
//     this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
//     this.container.appendChild(this.renderer.domElement);
//     this.renderer.render(scene, this.camera);

//     console.log(scene);
//   },

//   methods: {
//     animate: function(){
      
//     }
//   }
// }
</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>
  #tester {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    background-color: blue;
  }
</style>