import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

type PlanetSpec = {
  key:
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune'
  radius: number
  orbit: number
  angle: number
  tilt?: number
  hasRing?: boolean
}

function setupTexture(tex: THREE.Texture, anisotropy: number) {
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = anisotropy
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
}

function OrbitRing({ r }: { r: number }) {
  const geom = useMemo(() => new THREE.RingGeometry(r - 0.004, r + 0.004, 192), [r])
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#cbd5e1'),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      }),
    [],
  )
  return <mesh geometry={geom} material={mat} rotation={[Math.PI / 2, 0, 0]} />
}

function SolarSystem({
  scroll,
  reducedMotion,
}: {
  scroll: MotionValue<number>
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const planetMeshesRef = useRef<Record<string, THREE.Mesh | null>>({})

  const urls = useMemo(
    () => ({
      sun: new URL('../assets/planets/sun.jpg', import.meta.url).toString(),
      mercury: new URL('../assets/planets/mercury.jpg', import.meta.url).toString(),
      venus: new URL('../assets/planets/venus.jpg', import.meta.url).toString(),
      earth: new URL('../assets/planets/earth.jpg', import.meta.url).toString(),
      mars: new URL('../assets/planets/mars.jpg', import.meta.url).toString(),
      jupiter: new URL('../assets/planets/jupiter.jpg', import.meta.url).toString(),
      saturn: new URL('../assets/planets/saturn.jpg', import.meta.url).toString(),
      saturnRing: new URL('../assets/planets/saturn_ring.jpg', import.meta.url).toString(),
      uranus: new URL('../assets/planets/uranus.jpg', import.meta.url).toString(),
      neptune: new URL('../assets/planets/neptune.jpg', import.meta.url).toString(),
    }),
    [],
  )

  const tex = useTexture(urls)

  useEffect(() => {
    const aniso = 4
    Object.values(tex).forEach((t) => setupTexture(t, aniso))
  }, [tex])

  const planetSpecs: PlanetSpec[] = useMemo(
    () => [
      { key: 'mercury', radius: 0.14, orbit: 1.55, angle: 0.6 },
      { key: 'venus', radius: 0.18, orbit: 2.15, angle: 2.4 },
      { key: 'earth', radius: 0.19, orbit: 2.85, angle: 4.35 },
      { key: 'mars', radius: 0.17, orbit: 3.55, angle: 1.35 },
      { key: 'jupiter', radius: 0.46, orbit: 4.85, angle: 5.2 },
      { key: 'saturn', radius: 0.40, orbit: 6.1, angle: 2.15, hasRing: true, tilt: 0.52 },
      { key: 'uranus', radius: 0.30, orbit: 7.25, angle: 3.65 },
      { key: 'neptune', radius: 0.30, orbit: 8.45, angle: 0.2 },
    ],
    [],
  )

  const ringGeom = useMemo(() => new THREE.RingGeometry(0.58, 1.05, 96), [])
  const ringMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: tex.saturnRing,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: new THREE.Color('#ffffff'),
    })
  }, [tex.saturnRing])

  const sunMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: tex.sun,
      color: new THREE.Color('#ff7a18'),
    })
  }, [tex.sun])

  const glowMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff7a18'),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    })
  }, [])

  const planetMats = useMemo(() => {
    const mk = (map: THREE.Texture) =>
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.9,
        metalness: 0.0,
      })
    return {
      mercury: mk(tex.mercury),
      venus: mk(tex.venus),
      earth: mk(tex.earth),
      mars: mk(tex.mars),
      jupiter: mk(tex.jupiter),
      saturn: mk(tex.saturn),
      uranus: mk(tex.uranus),
      neptune: mk(tex.neptune),
    }
  }, [tex.earth, tex.jupiter, tex.mars, tex.mercury, tex.neptune, tex.saturn, tex.uranus, tex.venus])

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return

    const p = reducedMotion ? 0 : scroll.get()
    const zoomStart = 0.12
    const zoomT = THREE.MathUtils.clamp((p - zoomStart) / (1 - zoomStart), 0, 1)
    // smoothstep easing: starts gentle, ends gentle
    const zoom = zoomT * zoomT * (3 - 2 * zoomT)

    // top view: rotate only around Y
    const targetRotY = p * Math.PI * 2.0
    const targetRotX = 0
    const targetRotZ = 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 6, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 6, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRotZ, 6, delta)

    // start a bit farther (smaller), then zoom-in after some scroll
    const targetScale = 0.92 + zoom * 0.18
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta))

    // camera starts farther, then slowly moves closer (zoom-in)
    const targetY = 14.2 - zoom * 2.2
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 6, delta)
    state.camera.lookAt(0, 0, 0)

    // planets self-rotate when scrolling
    const spin = p * Math.PI * 10.0
    for (const pl of planetSpecs) {
      const m = planetMeshesRef.current[pl.key]
      if (!m) continue
      m.rotation.y = THREE.MathUtils.damp(m.rotation.y, spin + pl.angle * 0.4, 8, delta)
    }
  })

  return (
    <group ref={groupRef}>
      {/* orbits */}
      {planetSpecs.map((pl) => (
        <OrbitRing key={`o-${pl.key}`} r={pl.orbit} />
      ))}

      {/* sun */}
      <mesh geometry={new THREE.SphereGeometry(0.72, 64, 48)} material={sunMat} />
      <mesh geometry={new THREE.SphereGeometry(0.82, 48, 36)} material={glowMat} />

      {/* planets */}
      {planetSpecs.map((pl) => {
        const x = Math.cos(pl.angle) * pl.orbit
        const z = Math.sin(pl.angle) * pl.orbit
        const mat = planetMats[pl.key]

        return (
          <group key={pl.key} position={[x, 0, z]}>
            <mesh
              ref={(m) => {
                planetMeshesRef.current[pl.key] = m
              }}
              geometry={new THREE.SphereGeometry(pl.radius, 36, 28)}
              material={mat}
            />
            {pl.hasRing && (
              <mesh
                geometry={ringGeom}
                material={ringMat}
                rotation={[Math.PI / 2 + (pl.tilt ?? 0), 0.1, 0]}
                scale={1.05}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}

export function SolarSystemCanvas({
  scroll,
  reducedMotion,
}: {
  scroll: MotionValue<number>
  reducedMotion: boolean
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 14.2, 0.01], fov: 40, near: 0.1, far: 120 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl, camera }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        camera.up.set(0, 0, -1)
        camera.lookAt(0, 0, 0)
      }}
    >
      <ambientLight intensity={0.38} />
      <pointLight position={[0, 0, 0]} intensity={2.3} distance={25} decay={2} />
      <directionalLight position={[6, 4, 10]} intensity={0.45} />
      <SolarSystem scroll={scroll} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

