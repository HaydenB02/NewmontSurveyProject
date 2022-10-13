<template>
  <div id="tester"></div>
</template>

<script src="js/three.js"></script>
<script lang="ts">
//Imports
import * as Three from 'three';		
import { Camera, Scene, WebGLRenderer, Mesh } from "three";

export default{
  name: 'Tester',
  data(){
    return {
      camera: Camera,
      scene: Scene,
      renderer: WebGLRenderer,
      mesh: Mesh
    }
  },
  methods: {
    init: function(){
      let container = document.getElementById('tester');

      this.camera = new Three.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new Three.Scene();

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new Three.MeshNormalMaterial();

      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },

    animate: function(){
      requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    }
  },
  mounted(){
    this.init();
    this.animate();
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