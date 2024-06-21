import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

/*

The things, or reason, for including these parameters:
        setExportTrigger:           Like what it does is on export button, being clicked, it shall run the export sequence of  instructions over here defined in handleExport

        importFile:                 Quite Detailed to explain, but: This is to handle importing the file, into my scene. Like it is used in useEffect, for re-updating models to specifically when they change
                                    The parameter, is used in my JSX Return later in app functionality, also, so that I can pass my parameters. @Abhay A Rao, if you can work on this just explain this better to them.

        animationControl:           That takes a reference to play button, inside my JSX. Based on it's state we change the code working like below in useEffect and useFrame
        loop:                       State of my loop button, whether to loop or not, used in useEffects below
        finalPosition
        finalScale
        finalRotation:              All these three, are used to obtain values that they suggest
        duration:                   Takes the value of duration that is passed to the Keyframe Controllers Menu
        selectedAnimations:         Using this to access collection of selected animations in the AVAILABLE ANIMATIONS pane
        playKeyframeAnimation:      Specifically to include keyframe animations. This IS NEEDED as a separate parameter. The reason is, keyframes aren't preconfigured animations, we are adding these animations to our existing collection of animations, hence this is needed as a separate parameter
*/

const Model = ({ setExportTrigger, importFile, animationControl, loop, finalPosition, finalScale, finalRotation, duration, selectedAnimations, playKeyframeAnimation, setAvailableAnimations }) => {

    const groupRef = useRef();
    // The thing is that, groupRef, doesn't require initialisation like states and references. Unlike them/these, we just need to pass these as a seperate parameter to <group>, with reference parameter, to my reference object

    const { scene } = useThree();
    // Reference to Three Itself. It returns associated objects with the ThreeJS scene. Basically I could have done it also as "const { scene, camera, gl, size } = useThree();"

    const [mixer] = useState(() => new THREE.AnimationMixer());
    // This creates an instance of AnimationMixer, which is returned to the mixer object. We are right now not interested right now changing the state value. However, the question arises, when we decide to not change the animation mixer, why use state. Here's the thing. If I do not use state, JS modifies the mixer, everytime values change, and re-renders, and a new instance of mixer, is created everytime on change. This is compute intensive task, so we just use state to prevent re-rendering on using new instances

    const clock = new THREE.Clock();
    // Instantiates my clock, from the current point

    const [actions, setActions] = useState({});
    // Initialising my collection of associated prebuilt animations with "{}" and then using setActions, to associate it with new set of actions

    const [modelLoaded, setModelLoaded] = useState(false);
    // A state variable that changes when a model is loaded. It basically as expected is initialised to false, and later on when is being imported and loaded shall be set to true

    const [pausedAt, setPausedAt] = useState(0);
    // A state variable, that is used to save my state of Pause Time. ThreeJS, pause stops at specific frame, but doesn't save the value of pause timestamp or timeframe or whatever you call that. For that reason we require to implement this using React States

    const resetToInitialFrame = () => {
        if (groupRef.current) {
            // Note that when we load the model below, (FileReader Call), we set the name as the 'myModel' using "model.name = 'myModel';"
            const model = groupRef.current.getObjectByName('myModel');
            if (model) {
                model.position.set(0, 0, 0);
                model.scale.set(1, 1, 1);
                model.quaternion.set(0, 0, 0, 1);
            }
        }
    };
    // In this piece of code, what we do is as the name suggests, reset to the initial frame. I start with finding the reference to my scene using groupRef.current. If exists, then find reference to my model using getObjectByName. With that I get the object, and then totally resets the physical parameters like scale, orientation and position. Do not confuse it with initialisation which we perform later specific to the model, while importing it!

    useEffect(() => {
        // I put the below statement under if-clause, because I want it to only run, when the useEffect is triggered by importFile, only. Of course the other parameter is when my scene is defined and ready to run

        if (groupRef.current && importFile) {

            while (groupRef.current.children.length) {
                groupRef.current.remove(groupRef.current.children[0]);
            }
            // Here we make sure to clear out all the existing models out of my scene. My object is to work right now only on the model, that I import. Later on we can work on multiple import functionalities

            // Below I create a new instance of file reader
            const reader = new FileReader();

            // reader.onload is an event that is triggered when the file is fully uploaded. So it creates a file upload event, that we can use to perform operations with. From here, operations are fully asynchronous for file reading. Note that!
            reader.onload = function (e) {

                console.log("File is Uploaded Successfully")
                // For debugging
                // However, note that FileReader allows us to read files as Binary, String Buffers and hence that is used. However, there is no way to find the size of a file. Read this for reference: "https://developer.mozilla.org/en-US/docs/Web/API/FileReader". We can modify this later if needed to work with File API, rather than File API

                const contents = e.target.result;
                // Holds the result of the file. File data itself. Note that it reads here as a Buffer using readArrayAsBuffer. The call is asynchronous, non-blocking. So the thing is that it shall read simultaneously, as well as contents are loaded over here. For more information, read it over here guys "https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer"

                const loader = new GLTFLoader();
                // A GLTFLoader instance, provides us with a loader, which you know we can use to parse the file data which I read into "contents" using "loader.parse"

                loader.parse(contents, '', function (gltf) {
                    // Second parameter indicates empty string, because, see if you think about it we do not need (right now at least) additional binaries, or textures are separately provided. This line of code, returns a callback parameter "gltf", which can be accessed to perform operations using inbuilt methods and properties

                    const model = gltf.scene;
                    model.name = 'myModel';
                    groupRef.current.add(model);
                    // On Importing my model, I name it as 'myModel', which I later, add into my current ThreeJS Scene or Canvas

                    model.position.set(0, 0, 0);
                    model.scale.set(1, 1, 1);
                    model.quaternion.set(0, 0, 0, 1);
                    // Setting Initial State over here for the model

                    const existingAnimations = gltf.animations || [];
                    const newActions = {};
                    // Accessing animations over here. gltf.Animations returns a ArrayType "[]" which contains my animation objects. This thing, is ORRed with empty array, just to empty array, if nothing exists
                    // The "newActions" parameter, will basically, take stuff like all my existing animations, as well as my new custom animations. Basically, it's literally animations collection of the object. It contains the pre-existing animations, as well as the animations I would to my object later

                    existingAnimations.forEach(animation => {
                        const action = mixer.clipAction(animation, model);
                        // Obtain each "animation" from "model"

                        action.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                        // You can add Ping-Ponging over here, like that Boomerang feature if you remember, here

                        action.clampWhenFinished = !loop;
                        newActions[animation.name] = action;
                        // Set the playback parameters
                    });
                    // We add my existing animations from its collector to the newActions. It shall now contain instances or you know literal copy of my animations

                    // Here comes the main part of keyframing

                    const positionKF = new THREE.VectorKeyframeTrack(
                        'myModel.position',
                        // I mention the object as myModel, whose ".position" properties are being tracked now. Remember, this is not naming, but rather I am accessing property position on the model name 'myModel'

                        [0, duration],
                        [0, 0, 0, ...finalPosition]
                    );
                    // This is our first track. Here we use the THREE Method, "VectorKeyframeTrack"

                    const scaleKF = new THREE.VectorKeyframeTrack(
                        'myModel.scale',
                        [0, duration],
                        [1, 1, 1, ...finalScale]
                    );

                    const rotationKF = new THREE.QuaternionKeyframeTrack(
                        'myModel.quaternion',
                        [0, duration],
                        [
                            0, 0, 0, 1,
                            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(...finalRotation.map(r => r * (Math.PI / 180)))).toArray()
                        ]
                    );
                    // Similar to position keyframing, self-explanatory

                    // ERROR: Specifically here is the reason why we can't merge inbuilt animations
                    const customClip = new THREE.AnimationClip('CustomAnimation', duration, [positionKF, scaleKF, rotationKF]);
                    // We create a custom clip, basically defining the animation name, with duration and other things like tracks that the animation is defined by
                    // @Abhay A Rao, over here, we can merge multiple animations
                    // This right now, defines animation 'wireframe' if that makes sense

                    const customAction = mixer.clipAction(customClip, model);
                    // Associating new animation to the model

                    customAction.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                    customAction.clampWhenFinished = !loop;
                    newActions['CustomAnimation'] = customAction;
                    //Appending the new animation to the newActions object

                    setActions(newActions);
                    //Specifically navigate to L56, to understand this. We initialised the "actions" to new animation

                    setModelLoaded(true);
                    // Setting up the state values. Basically on loading the model, it is set to true

                    setExportTrigger(() => () => handleExport(scene, gltf, selectedAnimations, existingAnimations, customClip));
                    // To handle the export, which we will discuss later here, below in the code. I use this as a state in the App export, wherein, "Model" takes the state setting function, the setExportTrigger as a parameter. This is later utilised, to export the model using handleExport. No initialsiation needed whatsoerver

                });
            };
            reader.readAsArrayBuffer(importFile);
            // The asynchronous call, which we disucssed above in the comments, discussing on mechanism of reading files using "FileReader" object instances

        }
    }, [importFile, mixer, scene, setExportTrigger, loop, finalPosition, finalScale, finalRotation, duration, selectedAnimations]);
    // Dependencies, that perform this set of actions in useEffect, whenever, any of these dependencies change

    // This specifically is a R3F Hook, which is performed on every frame change, no matter what
    useFrame(() => {
        const delta = clock.getDelta();
        // Time elapsed since last frane

        if (animationControl === 'play') {
            mixer.update(delta);
            // Time to update, the frames by delta
        } else if (animationControl === 'pause') {
            mixer.update(0);
            // Do not update the current frame of animation. Basically update my animations by 0ms
        }
    });

    useEffect(() => {
        if (modelLoaded) {
            // After the model is loaded
            if (animationControl === 'play') {
                Object.keys(actions).forEach(name => {
                    // My "actions" contains the "newActions" collection. Each name is accessed, and played

                    if (selectedAnimations.includes(name) || (name === 'CustomAnimation' && playKeyframeAnimation)) {
                        actions[name].paused = false;
                        actions[name].play();
                    }
                });
                // Speedup Value, is associated over here. mixer.timeScale, is 1 indicates no speedup. We can later work on this to perform multiple speed operations
                mixer.timeScale = 1;
            } else if (animationControl === 'pause') {
                setPausedAt(mixer.time);
                // My Pause Time is recorded

                mixer.timeScale = 0;
                // The playback is stopped. Working is indicated in comment at L250

                Object.keys(actions).forEach(name => {
                    actions[name].paused = true;
                    // All associated animations are set to stop using this
                });
            }
        }
    }, [animationControl, actions, selectedAnimations, modelLoaded, mixer, playKeyframeAnimation]);

    const handleExport = (scene, gltf, selectedAnimations, existingAnimations, customClip) => {
        resetToInitialFrame();
        // To export with 0th Frame, rather than the end frame that is rendered.

        const mergedTracks = {};
        // To merge selected tracks within the animations pane

        selectedAnimations.forEach((animationName) => {
            const animation = existingAnimations.find((anim) => anim.name === animationName);
            // "animationName", callback takes the current value of animations within the selected animations, and iterates through, the animations associated with the object. anim is another callback operand, that iterates through "existingAnimations". If they match animation retains the animation object (with name) else retains undefined\
            // It returns THREE.AnimationClip
            // ERROR: Specifically here is the reason why we can't merge inbuilt animations

            if (animation) {
                // If animations, multiple exists exists

                animation.tracks.forEach((track) => {
                    // animation.tracks returns a THREE.KeyframeTracks. Basically, KeyframeTracks collect together, to create an animation clip. Check out L183 for example

                    if (!mergedTracks[track.name]) {
                        //If my merged tracks doesn't have the track name, just clone and add it to my animation merged track Collection that is done using "mergedTracks"

                        mergedTracks[track.name] = track.clone();
                        // Cloning the track instance, and associating the track to "mergedTracks"

                    } else {
                        // This case, does not have the track within the mergedTracks
                        const existingTrack = mergedTracks[track.name];
                        // Retrieve that animation which already has a specific base or compounded animation, that we want to add, our new animation to with

                        const values = new Float32Array(existingTrack.values.length + track.values.length);
                        values.set(existingTrack.values);
                        values.set(track.values, existingTrack.values.length);
                        // exisitingTrack is appended with track.values, from index
                        // The values here refer to value stamps of the three basic keyframe animation types

                        const times = new Float32Array(existingTrack.times.length + track.times.length);
                        // The times too work the same way

                        times.set(existingTrack.times);
                        times.set(track.times.map(time => time + existingTrack.times[existingTrack.times.length - 1]), existingTrack.times.length);

                        existingTrack.values = values;
                        existingTrack.times = times;
                    }
                });
            }
        });

        // Include the custom keyframe animation if selected
        if (playKeyframeAnimation) {
            customClip.tracks.forEach((track) => {
                if (!mergedTracks[track.name]) {
                    mergedTracks[track.name] = track.clone();
                } else {
                    const existingTrack = mergedTracks[track.name];
                    const values = new Float32Array(existingTrack.values.length + track.values.length);
                    values.set(existingTrack.values);
                    values.set(track.values, existingTrack.values.length);

                    const times = new Float32Array(existingTrack.times.length + track.times.length);
                    times.set(existingTrack.times);
                    times.set(track.times.map(time => time + existingTrack.times[existingTrack.times.length - 1]), existingTrack.times.length);

                    existingTrack.values = values;
                    existingTrack.times = times;
                }
            });
        }
        // Same thing specific for keyframe as it is not an inbuilt animation

        const mergedClip = new THREE.AnimationClip('MergedAnimation', -1, Object.values(mergedTracks));
        // mergedClip Animation contains the mergedTrack now

        const gltfExporter = new GLTFExporter();
        // Ny Instance of GLTFExporter, that is required to export the animations

        // ERROR: Probably because, we are only saving with the mergedClip animations
        const options = {
            binary: true,
            animations: [mergedClip],
        };
        // Options for export parameters

        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        function save(blob, filename) {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            // Automatically Click the Download Reference on exportTrigger
        }
        function saveString(text, filename) {
            save(new Blob([text], { type: 'text/plain' }), filename);
            // The Array object, is basically a type of ArrayBuffer
        }

        function saveArrayBuffer(buffer, filename) {
            save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
        }

        gltfExporter.parse(scene, function (result) {
            // Parses the scene Object to export the scene as a GLTF Object. On parsing, the object associated is returned as a result

            if (result instanceof ArrayBuffer) {
                saveArrayBuffer(result, 'Exported.glb');
                // If is a simple ArrayBuffer, export as a GLB Object, directly without any issues

            } else {
                // This case, is that the result is a JSON Object

                const output = JSON.stringify(result, null, 2);
                console.log(output);
                saveString(output, 'Exported.gltf');
                // JSON Stringifying the object, that can be exported
            }
        }, function (error) {
            console.error('An error occurred during the export:', error);
        }, options);
    };

    return (
        <group ref={groupRef} />
    );
};

export default Model;
