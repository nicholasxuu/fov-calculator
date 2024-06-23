// react nextjs page 
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import * as THREE from 'three';
import { useStickyState } from "../../utils/useStickyState";
import dynamic from "next/dynamic";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const FILEPATH = 'assets/threejs/rb6.glb';


const PreviewPage: NextPage = (() => {

  const { t } = useTranslation();

  const [language, setLanguage] = useStickyState(navigator.language === "zh-CN" ? "cn" : "en", "language");

  const [distanceToScreen, setDistanceToScreen] = useStickyState(70, "distanceToScreen");
  const [screenSize, setScreenSize] = useStickyState(32, "screenSize");
  const [aspectRatioA, setAspectRatioA] = useStickyState(16, "aspectRatioA");
  const [aspectRatioB, setAspectRatioB] = useStickyState(9, "aspectRatioB");
  const [curvature, setCurvature] = useStickyState(0, "curvature")
  const [isTripleMonitor, setIsTripleMonitor] = useStickyState(true, "isTripleMonitor")
  const [tripleMonitorAngle, setTripleMonitorAngle] = useStickyState(60, "tripleMonitorAngle");

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const assetLoader = new GLTFLoader();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer();


    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current?.appendChild(renderer.domElement);

    const displayInfo = {
      // height: 39,
      // width: 70,


      // 55inch TV
      // height: 70.5,
      // width: 123.8,

      // 50inch 32:9
      // height: 36,
      // width: 123.8,

      height: 40.6,
      width: 70.6,
    }


    const geometry = new THREE.BoxGeometry(displayInfo.width, displayInfo.height, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: false, transparent: true, opacity: 0.5 });
    const monitorCenter = new THREE.Mesh(geometry, material);
    monitorCenter.position.x = 0;
    monitorCenter.position.y = 8;
    monitorCenter.position.z = -72;
    // monitorCenter.position.z = -132;
    scene.add(monitorCenter);

    // const monitorRight = new THREE.Mesh(geometry, material);
    // monitorRight.position.x = 75;
    // monitorRight.position.y = 10;
    // monitorRight.position.z = -55;
    // scene.add(monitorRight);

    // const monitorLeft = new THREE.Mesh(geometry, material);
    // monitorLeft.position.x = -75;
    // monitorLeft.position.y = 10;
    // monitorLeft.position.z = -55;
    // scene.add(monitorLeft);

    const headGeometry = new THREE.SphereGeometry(5, 32, 32);
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.x = 0;
    head.position.y = 0;
    head.position.z = 0;
    scene.add(head);

    assetLoader.load(FILEPATH, function (gltf) {
      const model = gltf.scene.children[0];
      // const mixer = new THREE.AnimationMixer(model);

      // const animations = gltf.animations;
      // animations.forEach(function (clip) {
      //   const action = mixer.clipAction(clip);
      //   action.play();
      // });

      // const skeleton = new THREE.SkeletonHelper(model);
      // skeleton.visible = true;
      // scene.add(skeleton);
      scene.add(model);

      const scaleFactor = 18;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      model.position.y += -18;
      model.position.x -= 0.5;
      model.position.z -= 80;
      // model.rotation.x = Math.PI / 2;
      model.rotation.y = -0.0045; // fix gltf model rotation problem
      model.rotation.z -= Math.PI;


      // const geometry = new THREE.BoxGeometry(200, 10, 480);
      // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      // const carContainer = new THREE.Mesh(geometry, material);
      // carContainer.position.x = 0;
      // carContainer.position.y = 10;
      // carContainer.position.z = 9;
      // scene.add(carContainer);
    },
      undefined,
      (error) => {
        console.error(error);
      }
    );


    const animate = function () {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      // rotate camera around the scene
      // camera.position.z = -30;
      // camera.position.x = 100;
      // camera.position.y = 10;
      // camera.lookAt(0, 0, 0);
      // camera.rotation.y += 0.01;
      // camera.rotation.x += 0.01;
      // camera.rotation.z += 0.01;


      renderer.render(scene, camera);
    };

    const ambient_light = new THREE.AmbientLight(0xffffff, 20); // soft white light
    scene.add(ambient_light);

    // renderer.render(scene, camera);
    animate();
  }, []);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
});

export default dynamic(() => Promise.resolve(PreviewPage), { ssr: false })
