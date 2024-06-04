import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

const ThreeJSScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#FFFDD0');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Initialize OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 500;

        // Initialize Stats
        const stats = Stats();
        stats.showPanel(2);
        mountRef.current.appendChild(stats.dom);

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const textures = {
          upperBodyColor: textureLoader.load('public/textures/ctm_gendarmerie_basic_upperbody_color_psd_6ec1202f_5.png'),
          upperBodyNormal: textureLoader.load('public/textures/ctm_gendarmerie_basic_upperbody_normal_psd_20be52e7_3.png'),
          gasmaskColor: textureLoader.load('public/textures/ctm_gendarmerie_gasmask_color_psd_c266879f_11.png'),
          gasmaskNormal: textureLoader.load('public/textures/ctm_gendarmerie_gasmask_normal_psd_9b98cb25_9.png'),
          pantColor: textureLoader.load('public/textures/ctm_gendarmerie_medic_pant_color_psd_3af1392b_8.png'),
          pantNormal: textureLoader.load('public/textures/ctm_gendarmerie_medic_pant_normal_psd_f2875d67_6.png'),
          visorColor: textureLoader.load('public/textures/ctm_gendarmerie_visor_yellow_vmat_g_tcolor_e11f4ab7_14.png'),
          visorNormal: textureLoader.load('public/textures/ctm_gendarmerie_visor_yellow_vmat_g_tnormal_ae950ea1_12.png'),
          gloveColor: textureLoader.load('public/textures/glove_hardknuckle_black_color_psd_8f00aa00_2.png'),
          gloveNormal: textureLoader.load('public/textures/glove_hardknuckle_normal_tga_a8df881b_0.png'),
          upperBodyAO: textureLoader.load('public/textures/ctm_gendarmerie_basic_upperbody_ao_psd_9b712b12_orm_34328200.png'),
          gasmaskAO: textureLoader.load('public/textures/ctm_gendarmerie_gasmask_ao_psd_307245d8_orm_148598205_10@cha.png'),
          pantAO: textureLoader.load('public/textures/ctm_gendarmerie_medic_pant_ao_psd_a04fcb40_orm_2786487808_7@.png'),
          visorAO: textureLoader.load('public/textures/ctm_gendarmerie_visor_yellow_vmat_g_tambientocclusion_9782fd.png'),
          gloveAO: textureLoader.load('public/textures/glove_hardknuckle_ao_psd_5be17a0d_orm_2084722161_1@channels=.png'),
        };

        // Load the GLTF model
        const loader = new GLTFLoader();
        loader.load(
            'gendarprotivogazz.glb',
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(2, 2, 2);

                // Apply textures to materials
                model.traverse((child) => {
                    if (child.isMesh) {
                        if (child.name.includes('UpperBody')) {
                            child.material.map = textures.upperBodyColor;
                            child.material.normalMap = textures.upperBodyNormal;
                            child.material.aoMap = textures.upperBodyAO;
                        } else if (child.name.includes('Gasmask')) {
                            child.material.map = textures.gasmaskColor;
                            child.material.normalMap = textures.gasmaskNormal;
                            child.material.aoMap = textures.gasmaskAO;
                        } else if (child.name.includes('Pant')) {
                            child.material.map = textures.pantColor;
                            child.material.normalMap = textures.pantNormal;
                            child.material.aoMap = textures.pantAO;
                        } else if (child.name.includes('Visor')) {
                            child.material.map = textures.visorColor;
                            child.material.normalMap = textures.visorNormal;
                            child.material.aoMap = textures.visorAO;
                        } else if (child.name.includes('Glove')) {
                            child.material.map = textures.gloveColor;
                            child.material.normalMap = textures.gloveNormal;
                            child.material.aoMap = textures.gloveAO;
                        }
                        child.material.needsUpdate = true; // Ensure the material updates
                    }
                });

                scene.add(model);
                console.log('Model loaded successfully');
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model', error);
            }
        );

        // Add a directional light
        const light = new THREE.DirectionalLight(0xffffff, 5);
        light.position.set(5, 5, 5).normalize();
        scene.add(light);

        // Handle window resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update controls
            controls.update();

            renderer.render(scene, camera);
            stats.update();
        };

        animate();

        // Cleanup on component unmount
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            mountRef.current.removeChild(stats.dom);
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    return <div ref={mountRef} />;
};

export default ThreeJSScene;
