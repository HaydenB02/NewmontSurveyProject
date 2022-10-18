<template>
  <div id="tester"></div>
</template>

<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script lang="ts">
//Imports
import * as Three from 'three';	

//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import Vue from 'vue';
import { Component} from "vue-property-decorator";
library.add(faPlus, faCog);

@Component({
  components: {}
})
export default class Tester extends Vue {
  scene: Three.Scene = null;
  renderer: Three.Renderer = null;
  camera: Three.PerspectiveCamera = null;

  mounted() {
    const container = document.getElementById('tester');

    this.renderer = new Three.WebGLRenderer();
    this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight);
    this.scene = new Three.Scene();

    this.camera.position.x = 0;
    this.camera.position.y = 10;
    this.camera.position.z = 5;
  
    this.scene.background = new Three.Color('red');

    let geometry = new Three.BoxGeometry(20, 20, 20);
    let material = new Three.MeshNormalMaterial();
    let mesh = new Three.Mesh(geometry, material);

    mesh.position.x = 100;
    mesh.position.y = 0;
    mesh.position.z = 0;

    this.camera.lookAt(20, 0, 0);
    this.scene.add(mesh);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
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
    background-color: black;
    border: 3px solid red;
    margin-left: 50%;
  }
</style>