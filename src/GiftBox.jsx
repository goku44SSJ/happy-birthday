/* GiftBox.jsx */
import React, { useRef, useLayoutEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function GiftBox({ scrollData, ...props }) {
  const { nodes, materials } = useGLTF('/gift_box.glb')
  const group = useRef()
  const lidRef = useRef()
  const baseRef = useRef()
  const ribbonRef = useRef()

  useFrame(() => {
    // scrollData is a ref or object passed from parent containing scroll.offset
    const r1 = scrollData.current // 0 to 1
    
    // Animation Logic
    // 0.0 - 0.2: Ribbon unties (scales down/spins)
    // 0.2 - 0.4: Lid lifts up
    // 0.2 - 0.5: Walls (Base) fall flat (scale Y down or rotate if separated)
    
    if (lidRef.current && baseRef.current && ribbonRef.current) {
        // Ribbon Animation
        const ribbonProgress = THREE.MathUtils.clamp(r1 * 5, 0, 1) // 0 to 0.2 mapped to 0-1
        ribbonRef.current.scale.setScalar(1 - ribbonProgress)
        ribbonRef.current.rotation.y = ribbonProgress * Math.PI * 4

        // Lid Animation (Lifts up and flies away)
        const lidProgress = THREE.MathUtils.clamp((r1 - 0.15) * 4, 0, 1) // 0.15 to 0.4
        lidRef.current.position.y = THREE.MathUtils.lerp(0, 10, lidProgress)
        lidRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.5, lidProgress)

        // Base Animation (Fades/Moves down to reveal room)
        const baseProgress = THREE.MathUtils.clamp((r1 - 0.2) * 4, 0, 1)
        // Since we can't rotate walls individually in this model, we scale it down to "disappear"
        baseRef.current.scale.y = THREE.MathUtils.lerp(1, 0, baseProgress)
        baseRef.current.position.y = THREE.MathUtils.lerp(0, -2, baseProgress)
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.6}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          
          {/* THE BASE (Walls) */}
          <group ref={baseRef}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_4.geometry}
              material={materials.Pink01}
              position={[0, 1.1, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_6.geometry}
              material={materials.Pink02}
              position={[0, 1.3, 0]}
              rotation={[0, Math.PI / 2, 0]}
            />
          </group>

          {/* THE LID */}
          <group ref={lidRef}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_8.geometry}
              material={materials.Pink02}
              position={[0, 2.2, 0]}
              rotation={[0, -Math.PI / 4, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_10.geometry}
              material={materials.Pink03}
              position={[0, 2.2, 0]}
              rotation={[-0.1, 0, 0]}
              scale={[0.2, 0.4, 0.4]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_12.geometry}
              material={materials.Pink01}
              position={[0, 2.2, 0]}
            />
             {/* THE RIBBON */}
            <mesh
                ref={ribbonRef}
                castShadow
                receiveShadow
                geometry={nodes.Object_14.geometry}
                material={materials.Yellow01}
                position={[0, 2.4, 0]}
                scale={0.2}
            />
          </group>

        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/gift_box.glb')