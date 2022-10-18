<template>
  <div id="tester"></div>
</template>

<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script lang="ts">
//Imports
import * as Three from 'three';	

export default{
  name: 'Tester',
  data: function(){
    const camera = new Three.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 10);
    const scene = new Three.Scene();

    const geometry = new Three.EdgesGeometry();
    const material = new Three.MeshNormalMaterial();
    const mesh = new Three.Mesh(geometry, material);

    const renderer = new Three.WebGLRenderer({antialias: true});

    return {
      camera: camera,
      scene: scene,
      renderer: renderer,
      mesh: mesh,
    }
  },

  created: function(){
    this.scene.add(this.mesh);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  mounted(){
    document.getElementById('tester').appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
  },

  methods: {
    animate: function(){
      
    }
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