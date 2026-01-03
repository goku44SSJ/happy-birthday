import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Heart(props) {
  const ref = useRef()
  
  useFrame((state) => {
    if(ref.current) {
        ref.current.rotation.y += 0.02
        // Bobbing animation
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1
    }
  })

  // Simple Heart Shape
  const x = 0, y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo( x + 5, y + 5 );
  heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
  heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
  heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
  heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
  heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
  heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

  const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

  return (
    <mesh ref={ref} {...props} rotation={[Math.PI,0,0]} scale={0.1}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial color="#ff4d4d" roughness={0.4} />
    </mesh>
  )
}