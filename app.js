import * as THREE from 'three';
// var OBJLoader = require('three-obj-loader');
// OBJLoader(THREE);

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import * as dat from 'dat.gui';

// import {TimelineMax} from 'gsap';

var OrbitControls = require('three-orbit-controls')(THREE);

class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xeeeeee, 1);

    this.container = document.getElementById(selector);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001, 1000
    );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    // this.loader = new THREE.OBJLoader();

    this.setupResize();

    this.resize();
    this.addObjects();
    this.animate();

  }

  settings() {
    let that = this;
    this.settings = {
      time: 0,
      amplitude: 1,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'time', 0, 100, 0.01);
    this.gui.add(this.settings, 'amplitude', 0, 100, 0.01);

  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = (w / h);

    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extensions GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {type: 'f', value: 0},
        pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);


    this.points = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.points);

  }

  animate() {
    this.time += 0.5;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
}

new Sketch('container');
