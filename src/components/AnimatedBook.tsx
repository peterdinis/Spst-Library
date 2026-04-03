"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function BookModel() {
	const group = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (group.current) {
			group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
		}
	});

	return (
		<group ref={group}>
			<Float
				speed={2.5}
				rotationIntensity={0.5}
				floatIntensity={1.5}
				floatingRange={[-0.1, 0.1]}
			>
				{/* Kniha objekt */}
				<group position={[0, 0, 0]} rotation={[0.2, -0.6, 0]}>
					{/* Chrbát knihy */}
					<mesh position={[-0.9, 0, 0]}>
						<boxGeometry args={[0.2, 2.5, 1.8]} />
						<meshStandardMaterial color="#4338ca" roughness={0.4} />
					</mesh>

					{/* Predný obal */}
					<mesh position={[0, 0, 0.9]} rotation-y={0.05}>
						<boxGeometry args={[1.8, 2.55, 0.05]} />
						<meshStandardMaterial
							color="#4f46e5"
							roughness={0.3}
							metalness={0.2}
						/>
					</mesh>

					{/* Zadný obal */}
					<mesh position={[0, 0, -0.9]} rotation-y={-0.05}>
						<boxGeometry args={[1.8, 2.55, 0.05]} />
						<meshStandardMaterial color="#3730a3" roughness={0.4} />
					</mesh>

					{/* Strany */}
					<mesh position={[0.05, 0, 0]}>
						<boxGeometry args={[1.7, 2.4, 1.7]} />
						<meshStandardMaterial color="#f8fafc" roughness={0.9} />
					</mesh>

					{/* Dekoračný zlatý prvok na obale */}
					<mesh position={[0, 0, 0.93]} rotation-y={0.05}>
						<planeGeometry args={[0.8, 1.2]} />
						<meshStandardMaterial
							color="#fbbf24"
							metalness={0.8}
							roughness={0.2}
						/>
					</mesh>
				</group>
			</Float>
			{/* Tieň na zemi */}
			<ContactShadows
				position={[0, -2.5, 0]}
				opacity={0.6}
				scale={15}
				blur={2.5}
				far={4}
				color="#000000"
			/>
		</group>
	);
}

export function AnimatedBookScene() {
	return (
		<div className="h-64 w-64 md:h-80 md:w-80 mx-auto relative cursor-pointer">
			<Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]}>
				<ambientLight intensity={0.6} />
				<spotLight
					position={[10, 15, 10]}
					angle={0.3}
					penumbra={1}
					intensity={1.5}
					castShadow
				/>
				<pointLight position={[-10, -10, -10]} intensity={0.5} />
				<BookModel />
				<Environment preset="city" />
			</Canvas>
		</div>
	);
}
