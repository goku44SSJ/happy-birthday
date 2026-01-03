function Finale({ scroll }) {
  const heart = useRef();
  
  useFrame((state) => {
    // Range 0.85 to 1.0
    const r = scroll.range(0.85, 0.15);
    
    if (heart.current) {
        // Pop up scaling
        heart.current.scale.setScalar(r * 2); 
        // Spin
        heart.current.rotation.y += 0.05;
    }
  });

  return (
    <group position={[0, 1, 3]}>
       <Float speed={5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={heart} visible={true}>
            {/* Heart Shape (Simple Sphere placeholder or use ShapeGeometry) */}
            <dodecahedronGeometry args={[0.8, 0]} /> 
            <meshStandardMaterial color="#ff0040" emissive="#ff0040" emissiveIntensity={0.5} roughness={0.4} />
            
            <Html transform position={[0, -1.5, 0]} center>
                <div style={{ 
                    fontFamily: 'cursive', color: '#d6335c', fontSize: '2rem', 
                    textAlign: 'center', width: '300px', opacity: 1 
                }}>
                    I Love You<br/>Happy Birthday!
                </div>
            </Html>
        </mesh>
       </Float>
    </group>
  );
}

// Utility to create the dot pattern texture
function createDotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff6b6b'; // Box color
    ctx.fillRect(0,0,64,64);
    ctx.fillStyle = '#ff8585'; // Dot color
    ctx.beginPath(); ctx.arc(32,32,10,0,Math.PI*2); ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    return tex;
}