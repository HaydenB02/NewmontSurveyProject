<template>
    <div id="tester"></div>
</template>

<script lang="ts">
//Imports
import Vue from "vue";
import * as Three from 'three';		
import { Camera, Scene, WebGLRenderer, Mesh } from "three";

export default class Tester extends Vue {
    camera: Camera;
    scene: Scene;
    renderer: WebGLRenderer;
    mesh: Mesh;

    init(){
      let container = document.getElementById('tester');

      this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new Three.Scene();

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new Three.MeshNormalMaterial();

      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    }

    mounted(){
        this.init();
    }
}

</script>

<!-- Global Style -->
<style>
</style>

<!-- Local Style -->
<style scoped>
  #tester {
    width: 50%;
    height: 100%;
    background-color: black;
    margin-left: 50%;
  }
</style>