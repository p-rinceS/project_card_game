
import './CardViewer.css';
import React, {useRef, useEffect, Suspense, useState} from 'react';
import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import {OrbitControls, useGLTF, useTexture, useEnvironment} from '@react-three/drei';
import * as THREE from 'three';
import Back from '../../assets/card-assets/dev-cards/Back.jpg';
import {CardSetType} from "../../utils/enums.ts";

interface CardViewerProps {
    cardImg?: string;
    onClose: () => void;
    cardSetType ?: CardSetType;
}

interface CardModelProps {
    frontImg: string;
    cardSetType: CardSetType;
}

const CardModel: React.FC<CardModelProps> = ({ frontImg, cardSetType }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF('/cardmodel.glb');
    const frontTexture = useTexture(frontImg);
    const backTexture = useTexture(Back);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 150); // Delay just enough for rotation/material setup to apply

        return () => clearTimeout(timeout);
    }, []);

    const envMap = useEnvironment({
        files: "/overcast_soil_puresky_4k.hdr",
    })
    // const normalMap = useTexture('/maps/normal.png');
    // const heightMap = useTexture('/maps/height.png');

    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;

            switch (cardSetType) {
                case CardSetType.foil:
                    console.log("Foil card detected");
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: frontTexture,
                        metalness: 1,
                        roughness: 0.4,
                        envMap: envMap,
                        envMapIntensity: 0.6,
                    });
                    break;

                case CardSetType.holographic:
                    console.log("Holo card detected");
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: frontTexture,
                        // normalMap: normalMap,
                        // displacementMap: heightMap,
                        displacementScale: 0.05,
                        metalness: 0.8,
                        roughness: 0.3,
                        envMap: envMap,
                        envMapIntensity: 1.2,
                        transparent: true,
                        opacity: 1,
                    });
                    break;

                default:
                    // console.log("Normal card detected");
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: frontTexture,
                        envMap: envMap,
                        roughness: 0.9,
                        envMapIntensity: 0.1,
                    });
                    break;
            }

            mesh.rotation.set(-Math.PI, Math.PI, Math.PI * 2); // face camera, right-side up
        }
    });

    const front = scene.clone();
    const back = scene.clone();


    back.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({ map: backTexture,                 envMap: envMap,
                metalness: .5,
                roughness: 0.3,
            });

            mesh.geometry = mesh.geometry.clone(); // Avoid sharing geometry
            mesh.rotation.set(-Math.PI , Math.PI, Math.PI); // face camera, right-side up
            mesh.position.set(0.16, 4.12, .125); // Adjust position for back

        }
    });


    return (
        <group ref={groupRef}>
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
    );
};

const CameraControls = () => {
    const {camera} = useThree();
    const controls = useRef<OrbitControls | null>(null); // Specify the type for OrbitControls
    const timeRef = useRef(0);

    useFrame((state, delta) => {
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

const CardViewer: React.FC<CardViewerProps> = ({ cardImg = '', onClose, cardSetType }) => {
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
                <ambientLight intensity={0.5}/>
                <pointLight position={[2, 2, 2]} intensity={1}/>
                <pointLight position={[-2, 2, 2]} intensity={1}/>
                <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1}/>
                <hemisphereLight intensity={0.5}/>
                <Suspense fallback={null}>
                    <CardModel frontImg={cardImg} cardSetType={cardSetType} />
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