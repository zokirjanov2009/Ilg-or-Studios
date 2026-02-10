import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

function mulberry32(seed: number) {
  let t = seed >>> 0
  return function rand() {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function fract(x: number) {
  return x - Math.floor(x)
}

function hash3(x: number, y: number, z: number) {
  // fast deterministic hash-ish noise in [0,1)
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123)
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

function valueNoise3(x: number, y: number, z: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)

  const xf = x - xi
  const yf = y - yi
  const zf = z - zi

  const u = smoothstep(xf)
  const v = smoothstep(yf)
  const w = smoothstep(zf)

  const n000 = hash3(xi, yi, zi)
  const n100 = hash3(xi + 1, yi, zi)
  const n010 = hash3(xi, yi + 1, zi)
  const n110 = hash3(xi + 1, yi + 1, zi)
  const n001 = hash3(xi, yi, zi + 1)
  const n101 = hash3(xi + 1, yi, zi + 1)
  const n011 = hash3(xi, yi + 1, zi + 1)
  const n111 = hash3(xi + 1, yi + 1, zi + 1)

  const x00 = THREE.MathUtils.lerp(n000, n100, u)
  const x10 = THREE.MathUtils.lerp(n010, n110, u)
  const x01 = THREE.MathUtils.lerp(n001, n101, u)
  const x11 = THREE.MathUtils.lerp(n011, n111, u)
  const y0 = THREE.MathUtils.lerp(x00, x10, v)
  const y1 = THREE.MathUtils.lerp(x01, x11, v)
  return THREE.MathUtils.lerp(y0, y1, w)
}

function fbm3(x: number, y: number, z: number) {
  // 4-octave fbm in ~[0,1]
  let f = 0
  let amp = 0.55
  let freq = 1.0
  for (let i = 0; i < 4; i++) {
    f += amp * valueNoise3(x * freq, y * freq, z * freq)
    freq *= 2.05
    amp *= 0.55
  }
  return f
}

function displaceBrainPoint(n: THREE.Vector3) {
  // n: normalized direction on unit sphere
  const x = n.x
  const y = n.y
  const z = n.z

  // center fissure (groove) stronger near x=0
  const fissure = 1 - 0.18 * Math.exp(-(x * x) / 0.018)

  // folds (gyri) — layered trigs
  const f1 = Math.sin(9.2 * x + 1.4 * Math.sin(5.8 * y)) * 0.08
  const f2 = Math.sin(9.0 * y + 1.2 * Math.sin(6.4 * z)) * 0.07
  const f3 = Math.sin(9.6 * z + 1.1 * Math.sin(6.2 * x)) * 0.06
  const ridges = Math.sin(22 * (x + y)) * 0.02 + Math.sin(20 * (y - z)) * 0.02

  // subtle lobe bulges
  const lobes = (0.06 + 0.04 * Math.cos(y * Math.PI)) * (0.6 + 0.4 * Math.abs(x))

  const displacement = (f1 + f2 + f3 + ridges + lobes) * fissure

  const v = n.clone().multiplyScalar(1.55).addScaledVector(n, displacement)

  // brain proportions
  v.set(v.x * 1.08, v.y * 0.92, v.z * 1.02)
  return v
}

function buildBrainGeometry() {
  // High-poly base sphere → organic “brain-ish” displacement
  const geometry = new THREE.IcosahedronGeometry(1.55, 7)
  const pos = geometry.attributes.position as THREE.BufferAttribute

  const v = new THREE.Vector3()
  const n = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    n.copy(v).normalize()
    const dv = displaceBrainPoint(n)
    v.copy(dv)

    pos.setXYZ(i, v.x, v.y, v.z)
  }

  geometry.computeVertexNormals()
  return geometry
}

function buildGyriLineGeometries() {
  // Generate organic sulci/gyri streamlines on surface (more “real brain” look)
  const geometries: THREE.BufferGeometry[] = []
  const rand = mulberry32(1337)

  const n = new THREE.Vector3()
  const p = new THREE.Vector3()
  const p2 = new THREE.Vector3()
  const g = new THREE.Vector3()
  const t = new THREE.Vector3()

  const eps = 0.015
  const baseScale = 2.8

  const scalarField = (nx: number, ny: number, nz: number) => {
    // scalar field over unit sphere
    // mix fbm with anisotropy to create “fold flow”
    const a = fbm3(nx * baseScale, ny * baseScale, nz * baseScale)
    const b = fbm3((nx + ny) * 2.1, (ny - nz) * 2.1, (nz + nx) * 2.1)
    return 0.55 * a + 0.45 * b
  }

  const tangentFromField = (dir: THREE.Vector3) => {
    // approximate gradient of scalarField then produce tangent direction along iso-lines
    const x = dir.x
    const y = dir.y
    const z = dir.z

    const fx1 = scalarField(x + eps, y, z)
    const fx0 = scalarField(x - eps, y, z)
    const fy1 = scalarField(x, y + eps, z)
    const fy0 = scalarField(x, y - eps, z)
    const fz1 = scalarField(x, y, z + eps)
    const fz0 = scalarField(x, y, z - eps)

    g.set(fx1 - fx0, fy1 - fy0, fz1 - fz0)

    // tangent direction = n x grad  (follows iso-lines)
    t.copy(dir).cross(g)
    const len = t.length()
    if (len < 1e-6) {
      // fallback: pick any perpendicular vector
      t.set(-dir.y, dir.x, 0)
    }
    t.normalize()
    return t
  }

  const projectToSurface = (dir: THREE.Vector3) => {
    dir.normalize()
    return displaceBrainPoint(dir)
  }

  const addStreamline = (startDir: THREE.Vector3, steps: number, stepSize: number) => {
    const points: THREE.Vector3[] = []
    n.copy(startDir).normalize()
    p.copy(projectToSurface(n))
    points.push(p.clone())

    for (let i = 0; i < steps; i++) {
      const tangent = tangentFromField(n)

      // avoid too much crossing on fissure line (x≈0): push flow along y/z
      const fissurePush = Math.exp(-(n.x * n.x) / 0.02)
      if (fissurePush > 0.1) {
        tangent.addScaledVector(new THREE.Vector3(0, -n.z, n.y).normalize(), 0.25 * fissurePush)
        tangent.normalize()
      }

      // step in tangent direction, then re-project to surface
      p2.copy(n).addScaledVector(tangent, stepSize)
      n.copy(p2).normalize()
      p.copy(projectToSurface(n))
      points.push(p.clone())
    }

    if (points.length > 2) {
      geometries.push(new THREE.BufferGeometry().setFromPoints(points))
    }
  }

  // main folds: many short/medium streamlines concentrated on top + sides
  const lines = 240
  for (let i = 0; i < lines; i++) {
    // biased distribution: more near top (y positive) and sides (|x| larger)
    const u = rand()
    const v = rand()

    const theta = u * Math.PI * 2
    const phi = Math.acos(THREE.MathUtils.lerp(0.88, -0.10, v)) // more on upper hemisphere

    n.set(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi),
    )

    // bias to sides (avoid pure midline)
    n.x = THREE.MathUtils.clamp(n.x * 1.2, -1, 1)
    n.normalize()

    const steps = Math.floor(THREE.MathUtils.lerp(36, 82, rand()))
    const stepSize = THREE.MathUtils.lerp(0.022, 0.034, rand())
    addStreamline(n, steps, stepSize)
  }

  // emphasized central fissure (few longer curves)
  for (const off of [-0.10, -0.06, 0.06, 0.10]) {
    const steps = 140
    const stepSize = 0.024
    const startTheta = Math.PI / 2 + off
    const startPhi = Math.PI * 0.30
    n.set(
      Math.cos(startTheta) * Math.sin(startPhi),
      Math.cos(startPhi),
      Math.sin(startTheta) * Math.sin(startPhi),
    ).normalize()
    addStreamline(n, steps, stepSize)
  }

  return geometries
}

function BrainMesh({
  scroll,
  reducedMotion,
}: {
  scroll: MotionValue<number>
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  // keep geometry around (we still use its “brain-ish” displacement function)
  useMemo(() => buildBrainGeometry(), [])

  // all lines same grey (as requested)
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#a8b2bf'),
        transparent: true,
        opacity: 0.55,
      }),
    [],
  )

  const gyriLines = useMemo(() => {
    const geoms = buildGyriLineGeometries()
    return geoms.map((g) => {
      const line = new THREE.Line(g, lineMaterial)
      line.frustumCulled = false
      return line
    })
  }, [lineMaterial])

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return

    const p = reducedMotion ? 0 : scroll.get()

    // rotate + zoom with scroll
    const targetRotY = p * Math.PI * 2.2
    const targetRotX = (p - 0.5) * 0.35
    const targetRotZ = (p - 0.5) * 0.08

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 6, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 6, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRotZ, 6, delta)

    const targetScale = 1 + p * 0.38
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta))

    // camera dolly in slightly (feels more “real” than scale alone)
    const targetZ = 5.2 - p * 1.2
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 6, delta)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      {/* “real brain” style fold lines (gyri/sulci) */}
      {gyriLines.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  )
}

export function BrainCanvas({
  scroll,
  reducedMotion,
}: {
  scroll: MotionValue<number>
  reducedMotion: boolean
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.2], fov: 38, near: 0.1, far: 40 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* no lights needed for line materials */}
      <BrainMesh scroll={scroll} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

