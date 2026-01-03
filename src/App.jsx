import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { GiftBox } from './GiftBox'
import { RoomModel } from './RoomModel' // Your room file
import { Heart } from './Heart'

function Scene({ setFinished }) {
  const scroll = useScroll()
  const cameraRef = useRef()
  const scrollData = useRef(0)
  const roomGroup = useRef()

  // Camera Path Points (x, y, z)
  // 1. Start (Outside box)
  // 2. Zoom in (Inside room)
  // 3. Look at Photo 1
  // 4. Look at Photo 2
  // 5. Look at Photo 3 (Finale)

  useFrame((state) => {
    const r1 = scroll.offset // 0 to 1
    scrollData.current = r1

    const camera = state.camera

    // 0.0 - 0.4: Static camera outside, Box opens
    if (r1 < 0.4) {
        camera.position.lerp(new THREE.Vector3(5, 5, 5), 0.1)
        camera.lookAt(0, 0, 0)
    } 
    // 0.4 - 0.5: Enter the room
    else if (r1 >= 0.4 && r1 < 0.5) {
        const t = (r1 - 0.4) * 10 // Normalize 0-1
        camera.position.lerp(new THREE.Vector3(1, 2, 4), 0.1)
        camera.lookAt(0, 0.5, 0)
    }
    // 0.5 - 0.7: Pan to Photo 1 (Left wall)
    else if (r1 >= 0.5 && r1 < 0.7) {
        camera.position.lerp(new THREE.Vector3(0, 1.5, 3), 0.05)
        // Adjust lookAt to face the left wall poster coordinate
        const lookTarget = new THREE.Vector3(-2, 1, 0) 
        const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position)
        currentLook.lerp(lookTarget, 0.05)
        camera.lookAt(currentLook)
    }
    // 0.7 - 0.9: Pan to Photo 2 & 3 (Center/Right)
    else if (r1 >= 0.7 && r1 < 0.95) {
        camera.position.lerp(new THREE.Vector3(0, 1.5, 2), 0.05)
        const lookTarget = new THREE.Vector3(2, 1, -1) 
        const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position)
        currentLook.lerp(lookTarget, 0.05)
        camera.lookAt(currentLook)
    }
    // 0.95 - 1.0: Fade out / Finale
    else {
        if(r1 > 0.99) setFinished(true)
    }
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      
      {/* Container for the Gift and Room */}
      <group position={[0, -1, 0]}>
        
        {/* The Room sits inside initially hidden by the box */}
        <RoomModel />

        {/* The Gift Box covers the room */}
        <GiftBox scrollData={scrollData} />

        {/* Ground Shadow */}
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#a65f5f" />
      </group>
      
      {/* Finale Heart (Hidden until end logic, or simpler: render it but hide via css or scale) */}
      {/* Logic for heart handled in Overlay or via scroll opacity */}
    </>
  )
}

function Overlay({ finished }) {
  const [text, setText] = useState("")
  const fullText = "I love you, Happy Birthday! ❤️"

  useEffect(() => {
    if (finished) {
      let currentText = ""
      let i = 0
      const interval = setInterval(() => {
        currentText += fullText.charAt(i)
        setText(currentText)
        i++
        if (i >= fullText.length) clearInterval(interval)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [finished])

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* Scroll instruction */}
      {!finished && (
        <div style={{ position: 'absolute', bottom: '50px', width: '100%', textAlign: 'center', color: '#d45d79', fontFamily: 'Comic Sans MS, cursive' }}>
          ⬇️ Scroll to Open ⬇️
        </div>
      )}

      {/* Finished Screen */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        background: finished ? 'rgba(255, 240, 245, 0.9)' : 'transparent',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'background 1s ease'
      }}>
        {finished && (
            <>
                <div style={{ width: '200px', height: '200px' }}>
                     {/* We render a separate canvas or SVG for the heart here, or overlay the 3D canvas */}
                     {/* For simplicity, let's use CSS or just rely on the 3D scene fading */}
                </div>
                <h1 style={{ color: '#d6336c', fontSize: '3rem', fontFamily: 'Courier New', textAlign: 'center' }}>
                    {text}
                </h1>
            </>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [finished, setFinished] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1' }}>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        {/* Soft Pink Fog for aesthetics */}
        <fog attach="fog" args={['#ffe4e1', 5, 20]} />
        
        <ScrollControls pages={6} damping={0.2}>
          <Scene setFinished={setFinished} />
          {finished && <group position={[0,0,3]}> <Heart position={[0,0.5,0]} /> </group>}
        </ScrollControls>
      </Canvas>
      <Overlay finished={finished} />
    </div>
  )
}