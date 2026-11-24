import { useLanguage } from "./i18n/useLanguage.js";
import React, { useEffect, useRef, useState } from 'react'
import './assembly.css'

// These are the actual material cut-outs from the supplied reference pictures.
// The scene uses perspective transforms to assemble the pieces, and switches
// to the exact supplied final image when idle (no replacement with flat boxes).
const MATERIALS = [
  {
    id: 'column', image: 'column.png', x: 390, y: 130, w: 260, h: 610, z: 1,
    dx: '-14%', dy: '-55%', dz: '-330px', rx: '21deg', ry: '-18deg', delay: '0ms',
  },
  {
    id: 'lower', image: 'concrete-bottom.png', x: 357, y: 626, w: 398, h: 270, z: 2,
    dx: '38%', dy: '86%', dz: '-220px', rx: '-28deg', ry: '25deg', delay: '200ms',
  },
  {
    id: 'upper', image: 'concrete-top.png', x: 104, y: 2, w: 370, h: 293, z: 5,
    dx: '-36%', dy: '-78%', dz: '380px', rx: '24deg', ry: '-30deg', delay: '400ms',
  },
  {
    id: 'glass', image: 'acrylic.png', x: 165, y: 141, w: 540, h: 233, z: 6,
    dx: '82%', dy: '-21%', dz: '420px', rx: '13deg', ry: '39deg', delay: '630ms',
  },
  {
    id: 'brick', image: 'brick.png', x: 566, y: 204, w: 329, h: 346, z: 7,
    dx: '58%', dy: '-18%', dz: '470px', rx: '-21deg', ry: '28deg', delay: '860ms',
  },
  {
    id: 'steel', image: 'steel.png', x: 10, y: 303, w: 674, h: 276, z: 8,
    dx: '-75%', dy: '12%', dz: '570px', rx: '-17deg', ry: '-34deg', delay: '1120ms',
  },
  {
    id: 'wood', image: 'wood.png', x: 91, y: 523, w: 715, h: 194, z: 9,
    dx: '-42%', dy: '91%', dz: '420px', rx: '32deg', ry: '-20deg', delay: '1360ms',
  },
]

const pct = (value, total) => `${(value / total) * 100}%`

export default function Canvas3D({ mode = 0 }) {
  const {t}=useLanguage();
  const sceneRef = useRef(null)
  const [replayKey, setReplayKey] = useState(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = sceneRef.current
    if (!scene) return
    scene.classList.remove('is-complete')
    const timeout = window.setTimeout(() => {
      scene.classList.add('is-complete')
    }, reducedMotion.current ? 50 : 3800)
    return () => window.clearTimeout(timeout)
  }, [replayKey])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    scene.classList.toggle('view-alt', mode !== 0)
    scene.style.setProperty('--view-y', mode === 1 ? '-7deg' : mode === 2 ? '7deg' : '0deg')
  }, [mode])

  const onMove = (e) => {
    const scene = sceneRef.current
    if (!scene || reducedMotion.current || e.pointerType === "touch") return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2))
    scene.classList.add('is-interactive')
    scene.style.setProperty('--pointer-y', `${(x * 6).toFixed(2)}deg`)
    scene.style.setProperty('--pointer-x', `${(-y * 4).toFixed(2)}deg`)
  }

  const onLeave = () => {
    const scene = sceneRef.current
    if (!scene) return
    scene.classList.remove('is-interactive')
    scene.style.setProperty('--pointer-y', '0deg')
    scene.style.setProperty('--pointer-x', '0deg')
  }

  const replay = (event) => {
    event.stopPropagation()
    const scene = sceneRef.current
    if (scene) {
      scene.classList.remove('is-interactive')
      scene.style.setProperty('--pointer-y', '0deg')
      scene.style.setProperty('--pointer-x', '0deg')
    }
    setReplayKey((current) => current + 1)
  }

  return (
    <div className="webgl-wrap assembly-wrap" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="assembly-scene" ref={sceneRef} role="img" aria-label={t("Фотореалистичная композиция строительных материалов, которая собирается из отдельных элементов")}>
        <div key={replayKey} className="assembly-pieces">
          {MATERIALS.map((material) => (
            <img
              key={material.id}
              draggable="false"
              className={`assembly-piece assembly-${material.id}`}
              src={`/assets/assembly/${material.image}`}
              alt=""
              aria-hidden="true"
              style={{
                left: pct(material.x, 902),
                top: pct(material.y, 908),
                width: pct(material.w, 902),
                height: pct(material.h, 908),
                zIndex: material.z,
                '--from-x': material.dx,
                '--from-y': material.dy,
                '--from-z': material.dz,
                '--from-rx': material.rx,
                '--from-ry': material.ry,
                '--assembly-delay': material.delay,
              }}
            />
          ))}
        </div>
        <img className="assembly-photo" src="/assets/assembly/assembled.jpg" draggable="false" alt="" aria-hidden="true" />
      </div>
      <div className="webgl-orbit orbit-1" />
      <div className="webgl-orbit orbit-2" />
      <div className="model-crosshair crosshair-top">+</div>
      <div className="model-crosshair crosshair-bottom">+</div>
      <div className="model-tag model-tag-concrete"><i /> {t("БЕТОН")} <span>01/05</span></div>
      <div className="model-tag model-tag-brick"><i /> {t("КЕРАМИКА")} <span>02/05</span></div>
      <div className="model-tag model-tag-steel"><i /> {t("СТАЛЬ")} <span>03/05</span></div>
      <div className="model-coords">3D MATERIAL SYSTEM / ASSEMBLY <span>↗</span></div>
      <button className="assembly-replay" type="button" onClick={replay} title={t("Повторить сборку конструкции")} aria-label={t("Повторить сборку конструкции")}>
        <span aria-hidden="true">↻</span> {t("ПОВТОРИТЬ СБОРКУ")}
      </button>
    </div>
  )
}
