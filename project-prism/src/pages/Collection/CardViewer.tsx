import './CardViewer.css';
import React, {useRef, useEffect, Suspense, useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {OrbitControls, useGLTF, useTexture, useEnvironment} from '@react-three/drei';
import * as THREE from 'three';
import Back from '../../assets/card-assets/dev-cards/Back.jpg';
import {CardSetType} from "../../utils/enums.ts";
import {CardContents} from "../../utils/types.ts";
import getFoilNormalMap from "../../utils/getFoilNormalMap.ts";
import {EffectComposer, Bloom} from '@react-three/postprocessing';

interface CardViewerProps {
    card: CardContents
    onClose: () => void;
}

interface CardModelProps {
    card: CardContents;
}




const CardModel: React.FC<CardModelProps> = ({ card }) => {
    const groupRef = useRef<THREE.Group>(null);

    const { scene } = useGLTF('/cardmodel.glb');
    const frontTexture = useTexture(card.frontImg);
    const backTexture = useTexture(Back);
    const meshRef = useRef<THREE.Mesh>(null); // Ref for the front mesh
    const { size } = useThree()
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 150); // Delay just enough for rotation/material setup to apply

        return () => clearTimeout(timeout);
    }, []);

    const baseEnvironment = useEnvironment({
        files: "/hdris/mpumalanga_veld_4k.hdr",
    });

    const holoEnvironment = useEnvironment({
        files: "/hdris/qwantani_dusk_2_4k.hdr",
    });

    const foilEnvironment = useEnvironment({
        files: "/hdris/studio_small_08_4k.hdr",
    });

    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;

            switch (card.cardSetType) {
                case CardSetType.foil:
                    const normalTexture = useTexture(getFoilNormalMap(card.name));
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: frontTexture,
                        normalMap: normalTexture,
                        normalScale: new THREE.Vector2(0.15, 0),
                        metalness: 0.8,
                        roughness: 0.4,
                        envMap: foilEnvironment,

                    });
                    meshRef.current = mesh;
                    break;

                case CardSetType.holographic:
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: frontTexture,
                        metalness: 0.8,
                        roughness: 0.4,
                        envMap: holoEnvironment,
                        envMapIntensity: 0.5,
                        emissive: new THREE.Color(0x423432),
                        emissiveIntensity: 1,
                    });
                    break;

                default:
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: frontTexture,
                        metalness: 0.8,
                        roughness: 0.3,
                        opacity: 1,
                        envMap: baseEnvironment,
                        envMapIntensity: 0.5,
                    });
                    break;
            }

            mesh.rotation.set(-Math.PI, Math.PI, Math.PI * 2);
        }
    });

    const front = scene.clone();
    const back = scene.clone();

    back.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
                map: backTexture,
                envMap: baseEnvironment,
            });

            mesh.geometry = mesh.geometry.clone();
            mesh.rotation.set(-Math.PI, Math.PI, Math.PI);
            mesh.position.set(0.16, 4.12, 0.125);
        }
    });

    useFrame(({ camera }) => {
        if (groupRef.current) {
            const groupPosition = new THREE.Vector3();
            groupRef.current.getWorldPosition(groupPosition);

            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
        }
    });

    return (
        <>
            <EffectComposer>
                <Bloom
                    /*
                    blendFunction?: BlendFunction;
                    luminanceThreshold?: number;
                    luminanceSmoothing?: number;
                    mipmapBlur?: boolean;
                    intensity?: number;
                    radius?: number;
                    levels?: number;
                    kernelSize?: KernelSize;
                    resolutionScale?: number;
                    width?: number;
                    height?: number;
                    resolutionX?: number;
                    resolutionY?: number;
                    */
                    blendFunction={28}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur={true}
                    intensity={1}
                    radius={1}
                    levels={8}
                    kernelSize={4}
                    resolutionScale={1}
                    width={size.width}
                    height={size.height}
                    resolutionX={size.width}
                    resolutionY={size.height}
                />
            </EffectComposer>
            <group ref={groupRef}>
                {card.cardSetType === CardSetType.base && (
                    <directionalLight
                        position={[5, 10, 5]}
                        intensity={10}
                        castShadow={true}
                    />
                )}
                {isReady && (
                    <>
                        <primitive
                            object={front}
                            position={[0, 0, -2]}
                            rotation={[-Math.PI / 2, 0, Math.PI]}
                        />
                        <primitive
                            object={back}
                            position={[-0.3, 0, -3.65]}
                            rotation={[-Math.PI / 2, 0, Math.PI]}
                        />
                    </>
                )}
            </group>
        </>
    );
};

const CameraControls = () => {
    const {camera} = useThree();
    // @ts-ignore
    const controls = useRef<OrbitControls | null>(null); // Specify the type for OrbitControls
    const timeRef = useRef(0);

    useFrame((_state, delta) => {
        if (controls.current) {
            controls.current.update();

            // If the camera is not being interacted with, apply a slow tilt
            if (!controls.current.isDragging) {
                timeRef.current += delta;
                const tiltX = Math.sin(timeRef.current) * 0.02; // Oscillate on X-axis
                const tiltY = Math.cos(timeRef.current) * 0.02; // Oscillate on Y-axis
                camera.rotation.x += tiltX;
                camera.rotation.y += tiltY;
            }
        }
    });

    useEffect(() => {
        if (controls.current) {
            camera.position.set(0, 0, 4);
            camera.lookAt(0, 0, 0);
            controls.current.target.set(0, 0, 0); // No more error
        }
    }, [camera]);


    return <OrbitControls ref={controls} makeDefault enableZoom={false} enablePan={false} />;};

const CardViewer: React.FC<CardViewerProps> = ({ card, onClose}) => {
    const isDragging = useRef(false);

    useEffect(() => {
        const handleMouseDown = () => {
            isDragging.current = false;
        };
        const handleMouseMove = () => {
            isDragging.current = true;
        };
        const handleMouseUp = (e: MouseEvent) => {
            // If user did not drag and clicked outside the viewer, close
            if (!isDragging.current && (e.target as HTMLElement).classList.contains('card-viewer-overlay')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        // Disable scrolling when the viewer is open
        document.body.style.overflow = 'hidden';

        return () => {
            // Re-enable scrolling when the viewer is closed
            document.body.style.overflow = '';
        };
    }, []);

    // if they press escape, then close the viewer
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // if they press the left or right arrow keys, it will view next card

    return (
        <div
            className="card-viewer-overlay"
        >
            <Canvas shadows camera={{position: [0, 2, 2], fov: 75}}>

                <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1}/>
                <hemisphereLight intensity={0.5}/>
                <Suspense fallback={null}>
                    <CardModel card={card} />
                </Suspense>
                <CameraControls/>
            </Canvas>


            <button
                className="exit-button"
                onClick={() => {
                    onClose();
                }}
            >
              X
            </button>
        </div>
    );
};

export default CardViewer;