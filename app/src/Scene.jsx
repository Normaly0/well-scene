import { useEffect, useRef, useState } from 'react';
import { MeshBasicMaterial, sRGBEncoding, Color } from "three";
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, useProgress } from "@react-three/drei";

import gsap from 'gsap';
import { useControls } from 'leva';
import { Perf } from "r3f-perf";

import Effects from './Effects.jsx';

function Scene() {

    //Refs and state

    const [loadingCompleted, setLoadingCompleted] = useState(false)
    const [bloomColor, setBloomColor] = useState(new Color(5, 2, 0.2));

    const introAnimRef = useRef();

    const groupRef = useRef();
    const wellRef = useRef();
    const emissiveRef = useRef();

    //Leva 

    const {debug, post} = useControls({
        debug: false,
        post: true
    })

    const {intensity, color} = useControls('Bloom',  {
        intensity: {
            value: 1.5,
            min: 0,
            max: 3,
            step: 0.1
        },
        color: {
            options: ['orange', 'blue', 'green']
        }
    })

    //Loading Overlays

    const {progress} = useProgress();

    useEffect(() => {

        if (progress === 100) {

            document.querySelector('.loader__bar').style.transform = `translate(-50%, -50%) scaleX(${progress/100})`

            setTimeout(() => {
                document.querySelector('.loader').style.opacity = 0;
            }, 1000)

            setTimeout(() => {

                setLoadingCompleted(true)

                //Create Animation Refs

                const introTl = gsap.timeline().paused(true)

                introTl
                    .to(wellRef.current.children[1].position, {
                        y: 0.03, duration: .9
                    })
                    .to(wellRef.current.children[1].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .9
                    }, '=-.9')

                    .to(wellRef.current.children[2].position, {
                        y: 0,
                        duration: .8
                    })
                    .to(wellRef.current.children[2].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[3].position, {
                        y: 0.07,
                        duration: .8
                    }, '=-.6')
                    .to(wellRef.current.children[3].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[4].position, {
                        y: 0.15,
                        duration: .8
                    }, '=-.6')
                    .to(wellRef.current.children[4].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[5].position, {
                        y: 0.22,
                        duration: .8
                    }, '=-.6')
                    .to(wellRef.current.children[5].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[6].position, {
                        y: 0.29,
                        duration: .8
                    }, '=-.6')
                    .to(wellRef.current.children[6].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[7].position, {
                        y: 0.36,
                        duration: .8
                    }, '=-.6')
                    .to(wellRef.current.children[7].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[8].position, {
                        y: 0.86,
                        duration: .8
                    })
                    .to(wellRef.current.children[8].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[9].position, {
                        y: 0.06,
                        duration: .8
                    }, '=-.2')
                    .to(wellRef.current.children[9].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(wellRef.current.children[10].position, {
                        y: 0.52,
                        duration: .8
                    }, '=-.2')
                    .to(wellRef.current.children[10].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                    .to(emissiveRef.current.children[1].position, {
                        y: 0.52,
                        duration: .8
                    }, '=-.8')
                    .to(emissiveRef.current.children[1].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: .8
                    }, '=-.8')

                introAnimRef.current = introTl;

            }, 1500)
        }

    }, [progress])

    //Well geometry

    const well = useGLTF('./well.glb');
    const wellEmissive = useGLTF('./well_emmissions.glb');
    const wellGround = useGLTF('./well_ground.glb');

    //Well Textures

    const diffuseMap = useTexture('./Diffuse_black.jpg');
    diffuseMap.flipY = false;
    diffuseMap.encoding = sRGBEncoding;
    // diffuseMap.minFilter = NearestFilter;

    const alphaMap = useTexture('./Alpha.png');
    alphaMap.flipY = false;
    alphaMap.encoding = sRGBEncoding;

    //Well Materials

    const wellMaterial = new MeshBasicMaterial({
        map: diffuseMap
    });

    well.scene.traverse((child) => {
        if (child.isMesh) child.material = wellMaterial;
    })

    const wellEmissiveMaterial = new MeshBasicMaterial({
        color: bloomColor,
    })

    useEffect(() => {

        switch(color) {
            case 'blue':
                setBloomColor(new Color(.2, 2, 5))
                break;
            case 'green':
                setBloomColor(new Color(.2, 2.5, 1))
                break;
            default:
                setBloomColor(new Color(5, 2, 0.2))
                break;
        }

    }, [color])    

    wellEmissive.nodes.emissive_lantern.material = wellEmissiveMaterial

    const wellGroundMaterial = new MeshBasicMaterial({
        map: diffuseMap,
        transparent: true,
        alphaMap: alphaMap,
    })

    wellGround.nodes.ground.material = wellGroundMaterial

    //Animations

    useFrame(() => {

        if (loadingCompleted) {

            introAnimRef.current.play();
            
        }

    })

    return(
        <>
            
            { debug ? <Perf position="top-left" /> : null }

            <OrbitControls 
                maxPolarAngle={Math.PI / 2.1}
            />

            <color args={['#282828']} attach="background" />
            { post ? <Effects intensity={intensity} /> : null }

            <group ref={groupRef} position-y={-0.2}>

                <group ref={wellRef} dispose={null}>
                    <mesh
                        name="grass"
                        geometry={well.nodes.grass.geometry}
                        material={well.nodes.grass.material}
                    />
                    <mesh
                        name="well_base"
                        geometry={well.nodes.well_base.geometry}
                        material={well.nodes.well_base.material}
                        position={[0, 1, 0]}
                        scale={0}
                    />
                    <mesh
                        name="ring_1"
                        geometry={well.nodes.ring_1.geometry}
                        material={well.nodes.ring_1.material}
                        position-y={1.3}
                        scale={0}
                    />
                    <mesh
                        name="ring_2"
                        geometry={well.nodes.ring_2.geometry}
                        material={well.nodes.ring_2.material}
                        position={[0, 1.3, 0]}
                        scale={0}
                        rotation={[0, 0.26, 0]}
                    />
                    <mesh
                        name="ring_3"
                        geometry={well.nodes.ring_3.geometry}
                        material={well.nodes.ring_3.material}
                        position={[0, 1.3, 0]}
                        scale={0}
                    />
                    <mesh
                        name="ring_4"
                        geometry={well.nodes.ring_4.geometry}
                        material={well.nodes.ring_4.material}
                        position={[0, 1.3, 0]}
                        scale={0}
                        rotation={[0, 0.26, 0]}
                    />
                    <mesh
                        name="ring_5"
                        geometry={well.nodes.ring_5.geometry}
                        material={well.nodes.ring_5.material}
                        position={[0, 1.3, 0]}
                        scale={0}
                    />
                    <mesh
                        name="ring_6"
                        geometry={well.nodes.ring_6.geometry}
                        material={well.nodes.ring_6.material}
                        position={[0, 1.3, 0]}
                        scale={0}
                        rotation={[0, 0.26, 0]}
                    />
                    <mesh
                        name="poles"
                        geometry={well.nodes.poles.geometry}
                        material={well.nodes.poles.material}
                        position={[0, 2, 0]}
                        scale={0}
                        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
                    />
                    <mesh
                        name="buckets"
                        geometry={well.nodes.buckets.geometry}
                        material={well.nodes.buckets.material}
                        position={[0.51, .6, 0.3]}
                        scale={0}
                        rotation={[0, 0, -0.03]}
                    />
                    <mesh
                        name="lantern"
                        geometry={well.nodes.lantern.geometry}
                        material={well.nodes.lantern.material}
                        position={[0.4, 1, 0.15]}
                        scale={0}
                        rotation={[0, -0.45, 0]}
                    />
                </group>

                <group ref={emissiveRef} dispose={null}>
                    <mesh
                        name="emissive_well"
                        geometry={wellEmissive.nodes.emissive_well.geometry}
                        material={wellEmissive.nodes.emissive_well.material}
                        position={[0, 0.05, 0]}
                    />
                    <mesh
                        name="emissive_lantern"
                        geometry={wellEmissive.nodes.emissive_lantern.geometry}
                        material={wellEmissive.nodes.emissive_lantern.material}
                        position={[0.4, 1, 0.15]}
                        scale={0}
                        rotation={[0, -0.45, 0]}
                    />
                    
                </group>

                <primitive object={wellGround.scene} />

            </group>

        </>
    )
}

export default Scene;