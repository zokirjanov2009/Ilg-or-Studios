import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

function setupTexture(tex: THREE.Texture, anisotropy: number, isColor: boolean) {
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = anisotropy
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  if (isColor) tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
}

function GlobeMesh({
  scroll,
  reducedMotion,
}: {
  scroll: MotionValue<number>
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const earthMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const cloudsMatRef = useRef<THREE.MeshStandardMaterial>(null)

  const radius = 1.45 // a bit smaller
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(radius, 128, 96), [radius])
  const cloudGeometry = useMemo(() => new THREE.SphereGeometry(radius * 1.01, 128, 96), [radius])

  const { day, night, normal, clouds } = useTexture({
    day: new URL('../assets/earth/earth_day.jpg', import.meta.url).toString(),
    night: new URL('../assets/earth/earth_night.png', import.meta.url).toString(),
    normal: new URL('../assets/earth/earth_normal.jpg', import.meta.url).toString(),
    clouds: new URL('../assets/earth/earth_clouds.png', import.meta.url).toString(),
  })

  useEffect(() => {
    const maxAniso = 8
    setupTexture(day, maxAniso, true)
    setupTexture(night, maxAniso, true)
    setupTexture(normal, maxAniso, false)
    setupTexture(clouds, maxAniso, true)
  }, [clouds, day, night, normal])

  const earthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: day,
      normalMap: normal,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughness: 0.9,
      metalness: 0.0,
      emissive: new THREE.Color('#ffffff'),
      emissiveMap: night,
      emissiveIntensity: 1.25,
    })
  }, [day, night, normal])

  const cloudMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: clouds,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    })
  }, [clouds])

  const atmoMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#7dd3fc'),
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    })
  }, [])

  // Patch emissive so night lights only show on night side
  useEffect(() => {
    const mat = earthMaterial
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.sunDirection = { value: new THREE.Vector3(1, 0, 0) }
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        [
          '#include <emissivemap_fragment>',
          'vec3 sunDirView = normalize((viewMatrix * vec4(sunDirection, 0.0)).xyz);',
          'float ndl = dot(normalize(vNormal), sunDirView);',
          'float nightMask = smoothstep(0.15, -0.25, ndl);',
          'totalEmissiveRadiance *= nightMask;',
        ].join('\n'),
      )
      ;(mat as any).userData.shader = shader
    }
    mat.needsUpdate = true
  }, [earthMaterial])

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return

    const p = reducedMotion ? 0 : scroll.get()

    // real-time rotation baseline (UTC)
    const now = new Date()
    const seconds =
      now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds() + now.getUTCMilliseconds() / 1000
    const dayProgress = seconds / 86400
    const timeRotY = -dayProgress * Math.PI * 2

    // scroll-based extra rotation + slight tilt
    const targetRotY = timeRotY + p * Math.PI * 2.2
    const targetRotX = -0.35 + (p - 0.5) * 0.22
    const targetRotZ = 0.12 + (p - 0.5) * 0.06

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 6, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 6, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRotZ, 6, delta)

    // zoom with scroll
    const targetScale = 0.86 + p * 0.26
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta))

    // camera dolly
    const targetZ = 6.5 - p * 1.0
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 6, delta)
    state.camera.lookAt(0, 0, 0)

    // clouds slow drift
    const cloudsMat = cloudsMatRef.current
    if (cloudsMat?.map) {
      cloudsMat.map.offset.x = (cloudsMat.map.offset.x + delta * 0.005) % 1
    }

    // update sun direction uniform (fixed sun, earth rotates)
    const shader = (earthMatRef.current as any)?.userData?.shader as
      | { uniforms: Record<string, { value: unknown }> }
      | undefined
    if (shader?.uniforms?.sunDirection?.value) {
      ;(shader.uniforms.sunDirection.value as THREE.Vector3).set(1, 0, 0)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={sphereGeometry} castShadow receiveShadow>
        <primitive object={earthMaterial} attach="material" ref={earthMatRef} />
      </mesh>
      <mesh geometry={cloudGeometry}>
        <primitive object={cloudMaterial} attach="material" ref={cloudsMatRef} />
      </mesh>
      {/* atmosphere */}
      <mesh geometry={sphereGeometry} material={atmoMaterial} scale={1.06} />
    </group>
  )
}

export function GlobeCanvas({
  scroll,
  reducedMotion,
}: {
  scroll: MotionValue<number>
  reducedMotion: boolean
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.0], fov: 36, near: 0.1, far: 60 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 2, 0]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[-6, -2, 3]} intensity={0.35} color="#c7d2fe" />
      <GlobeMesh scroll={scroll} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

