<template>
  <div id="webgl" ref="webgl" class="webgl_style" />
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"; // STL 模型加载库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // GLB 模型加载库
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import openWindow from "@/utils/open-window";
import { log } from "three";

export default {
  data() {
    return {
      renderer: "", // 渲染器
      scene: "", // 场景
      camera: "", // 相机
      controls: "", // 控制器
      composer: "", // outlineSelect
      effectFXAA: "", // outlineSelect
      outlinePass: "", // outlineSelect
      selectedObjects: [], // outlineSelect
      raycaster: new THREE.Raycaster(),
      list: [],
      gui: new GUI({ width: 300 }),
      GUIparams: {
        MeshName: "name",
      },
    };
  },
  mounted() {
    this.getList();
  },
  beforeDestroy() {
    this.gui.destroy();
  },
  methods: {
    getList() {
      this.init();
      this.animate();
    },
    init() {
      this.initScene(); // 初始化场景
      this.initCamera(); // 初始化相机
      this.initLight(); // 初始化光线
      this.Panel(); // 地面
      this.STLModel();
      this.Model();
      this.initGUI(); // GUI
      this.initRenender(); // 初始化渲染器
      this.outlineSelect(); // 模型选择
      this.ininControl(); // 初始化控制
      this.$refs.webgl.addEventListener("mousemove", this.onWindowResize); //
      this.$refs.webgl.addEventListener("mousemove", this.launchHover); //
    },
    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene(); // 创建场景
      //this.scene.background = new THREE.Color(0xcce0ff)
      this.scene.fog = new THREE.Fog(this.scene.background, 1, 1000);
    },
    // 初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        document.getElementById("webgl").clientWidth /
          document.getElementById("webgl").clientHeight,
        0.1,
        5000
      ); // 创建相机对象
      this.camera.position.set(0, 0, 100); // 设置相机位置
      this.camera.lookAt(new THREE.Vector3(0, 1, 0)); // 设置相机方向(指向的场景对象)
    },

    // 初始化光线
    initLight() {
      const ambientLight = new THREE.AmbientLight(0x0c0c0c);
      this.scene.add(ambientLight);
      // LIGHTS HemisphereLight
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
      hemiLight.color.setHSL(0.6, 1, 0.6);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      hemiLight.position.set(0, 50, 0);
      this.scene.add(hemiLight); // 光线加入场景中

      const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
      this.scene.add(hemiLightHelper);

      // LIGHTS DirectionalLight

      const dirLight = new THREE.DirectionalLight(0xffffff, 2);
      dirLight.color.setHSL(0.1, 1, 0.95);
      dirLight.position.set(-1, 1.75, 1);
      dirLight.position.multiplyScalar(30);
      this.scene.add(dirLight); // 光线加入场景中

      dirLight.castShadow = true;

      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;

      const d = 50;

      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;

      dirLight.shadow.camera.far = 15000;
      dirLight.shadow.bias = -0.0001;

      const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
      this.scene.add(dirLightHelper);
    },
    // 加载GLB模型
    STLModel() {
      const loader1 = new GLTFLoader();
      const Path1 = "models/eqp.glb";
      const _this = this;
      for (let i = 0; i < 3; i++) {
        loader1.load(Path1, (gltf) => {
          const model = gltf.scene;
          console.log(model);
          model.rotation.set(0, -Math.PI / 1, 0);
          model.position.set(i * 15, -5, i * 15);
          model.scale.set(20, 20, 20);
          model.name = "半导体设备";
          
          _this.scene.add(model); // 网格模型添加到场景中
        });
      }
      for (let i = 0; i < 3; i++) {
        loader1.load(Path1, (gltf) => {
          const model = gltf.scene;
          console.log(model);
          model.rotation.set(0, -Math.PI / 1, 0);
          model.position.set(50, -5, i * 15);
          model.scale.set(20, 20, 20);
          model.name = "半导体设备";
          
          _this.scene.add(model); // 网格模型添加到场景中
        });
      }
    },
    // 控制
    ininControl() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
      this.controls.minDistance = 5;
      this.controls.maxDistance = 220;
      this.controls.maxPolarAngle = Math.PI * 0.4; // 最大角度 地平面与camera
      this.controls.enablePan = true;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    },

    // 初始化渲染器 ——指定容器
    initRenender() {
      this.renderer = new THREE.WebGLRenderer(); // 创建渲染器
      this.renderer.shadowMap.enabled = true; // 开启阴影，加上阴影渲染
      this.renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      this.renderer.setPixelRatio(window.devicePixelRatio); // 接口返回当前显示设备 的物理像素分辨率与CSS 像素分辨率 //高清
      this.renderer.setSize(
        document.getElementById("webgl").clientWidth,
        document.getElementById("webgl").clientHeight
      );
      this.$refs.webgl.appendChild(this.renderer.domElement);
    },
    // 定义窗口的设置
    onWindowResize() {
      const container = document.getElementById("webgl");
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.camera.updateProjectionMatrix();
      this.effectFXAA.uniforms["resolution"].value.set(
        1 / container.clientWidth,
        1 / container.clientHeight
      );
    },
    // 地面
    Panel() {
      // 在平面上创建栅格覆盖
      var grid = new THREE.GridHelper(175, 20, 0xffffff, 0xffffff);
      grid.material.opacity = 0.5;
      grid.material.transparent = true;
      grid.position.y = 0.005;
      this.scene.add(grid);

      // 创建Threejs平面
      const blockPlane = new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25,
        })
      );
      const pos = { x: 0, y: -0.25, z: 0 };
      const scale = { x: 175, y: 0.5, z: 175 };
      blockPlane.position.set(pos.x, pos.y, pos.z);
      blockPlane.scale.set(scale.x, scale.y, scale.z);
      blockPlane.receiveShadow = true;
      blockPlane.name = "地板";
      this.scene.add(blockPlane);
    },
    initGUI() {
      this.gui.domElement.style = "position:absolute;top:0px;right:0px";
      this.gui.add(this.GUIparams, "MeshName").name("选中的物体名:").listen();
    },
    Model() {
      const geometry = new THREE.BoxGeometry(5, 5, 5);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0a9196,
        roughness: 0.5,
        metalness: 0,
        flatShading: true,
      });

      for (let i = 0; i < this.list.length; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 80 - 10;
        mesh.position.y = 2.5;
        mesh.position.z = Math.random() * 80 - 10;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        mesh.name =
          this.list[i].factory +
          "-" +
          this.list[i].eqpId +
          "-" +
          this.list[i].vncip;
        mesh.userData = this.list[i];
        this.scene.add(mesh);
      }
    },
    outlineSelect() {
      this.composer = new EffectComposer(this.renderer);

      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      const container = document.getElementById("webgl");
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        this.scene,
        this.camera
      );

      this.outlinePass.edgeStrength = Number(5); // 边缘长度
      this.outlinePass.edgeThickness = Number(3.6); // 边缘厚度 值越小越明显
      this.outlinePass.pulsePeriod = Number(2.9); // 一闪一闪周期
      this.outlinePass.visibleEdgeColor.set("#ffff00"); // 没有被遮挡的outline的颜色
      this.outlinePass.hiddenEdgeColor.set(0xff0000); // 被遮挡的outline的颜色
      this.composer.addPass(this.outlinePass);

      this.effectFXAA = new ShaderPass(FXAAShader);
      this.effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      this.composer.addPass(this.effectFXAA);
      this.renderer.domElement.style.touchAction = "none"; // CSSStyleDeclaration
      this.$refs.webgl.addEventListener("pointermove", this.onPointerMove);
      this.$refs.webgl.addEventListener("click", this.onPointerMove);
    },
    onPointerMove(event) {
      var mouse = new THREE.Vector2();
      const container = document.getElementById("webgl");
      const getBoundingClientRect = container.getBoundingClientRect(); // 获取元素位置 确定三维坐标
      mouse.x =
        ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - getBoundingClientRect.top) /
          container.offsetHeight
        ) *
          2 +
        1;

      this.raycaster.setFromCamera(mouse, this.camera);

      const intersects = this.raycaster.intersectObject(this.scene, true);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        this.addSelectedObject(selectedObject);
        this.outlinePass.selectedObjects = this.selectedObjects;
        this.GUIparams.MeshName = intersects[0].object.name;
        if (event.type === "click") {
          if (
            intersects[0].object.userData.vncip !== undefined &&
            intersects[0].object.userData.vncPort !== undefined
          ) {
            const url =
              "http://" +
              intersects[0].object.userData.vncip +
              ":" +
              intersects[0].object.userData.vncPort;
            openWindow(url, "thirdpart", 800, 540);
          }
        }
      } else {
        this.outlinePass.selectedObjects = [];
      }
    },
    addSelectedObject(object) {
      this.selectedObjects = [];
      this.selectedObjects.push(object);
    },

    launchHover(event) {
      event.preventDefault();
      var mouse = new THREE.Vector2();
      const container = document.getElementById("webgl");
      const getBoundingClientRect = container.getBoundingClientRect(); // 获取元素位置 确定三维坐标
      mouse.x =
        ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - getBoundingClientRect.top) /
          container.offsetHeight
        ) *
          2 +
        1;
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      var intersects = raycaster.intersectObjects([this.scene], true);
      if (intersects.length > 0) {
        document.querySelector("body").style.cursor = "pointer";
      } else {
        document.querySelector("body").style.cursor = "default";
      }
    },
    // 动画
    animate() {
      this.controls.update(); // Update controls
      this.renderer.render(this.scene, this.camera); // Render 渲染
      this.composer.render();
      requestAnimationFrame(this.animate); // Call tick again on the next frame
    },
  },
};
</script>

<style>
.webgl_style {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /*有查出边框部分隐藏的作用，清除浮动的作用，解决边框塌陷的作用 */
}
</style>
