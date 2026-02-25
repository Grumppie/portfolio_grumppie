"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function WebGLShader({ onReady }: { onReady?: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<{
        scene: THREE.Scene | null
        camera: THREE.OrthographicCamera | null
        renderer: THREE.WebGLRenderer | null
        mesh: THREE.Mesh | null
        uniforms: any
        animationId: number | null
        targetDistortion: number
        targetXScale: number
        targetYScale: number
    }>({
        scene: null,
        camera: null,
        renderer: null,
        mesh: null,
        uniforms: null,
        animationId: null,
        targetDistortion: 0.05,
        targetXScale: 1.0,
        targetYScale: 0.5,
    })

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const { current: refs } = sceneRef

        const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

        const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `

        const initScene = () => {
            refs.scene = new THREE.Scene()
            refs.renderer = new THREE.WebGLRenderer({ canvas })
            refs.renderer.setPixelRatio(window.devicePixelRatio)
            refs.renderer.setClearColor(new THREE.Color(0x000000))

            refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

            refs.uniforms = {
                resolution: { value: [window.innerWidth, window.innerHeight] },
                time: { value: 0.0 },
                xScale: { value: 1.0 },
                yScale: { value: 0.5 },
                distortion: { value: 0.05 },
            }

            const position = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ]

            const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute("position", positions)

            const material = new THREE.RawShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: refs.uniforms,
                side: THREE.DoubleSide,
            })

            refs.mesh = new THREE.Mesh(geometry, material)
            refs.scene.add(refs.mesh)

            handleResize()
        }

        let firstFrame = true
        const animate = () => {
            if (refs.uniforms) {
                refs.uniforms.time.value += 0.01

                // Lerp towards target parameters
                refs.uniforms.distortion.value += (refs.targetDistortion - refs.uniforms.distortion.value) * 0.05
                refs.uniforms.xScale.value += (refs.targetXScale - refs.uniforms.xScale.value) * 0.05
                refs.uniforms.yScale.value += (refs.targetYScale - refs.uniforms.yScale.value) * 0.05
            }
            if (refs.renderer && refs.scene && refs.camera) {
                refs.renderer.render(refs.scene, refs.camera)
            }

            if (firstFrame) {
                firstFrame = false
                onReady?.()
            }

            refs.animationId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            if (!refs.renderer || !refs.uniforms) return
            // Use parent container dimensions instead of window to fit within a div
            const parent = canvas.parentElement;
            const width = parent ? parent.clientWidth : window.innerWidth;
            const height = parent ? parent.clientHeight : window.innerHeight;
            refs.renderer.setSize(width, height, false)
            refs.uniforms.resolution.value = [width, height]
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!refs.uniforms) return
            const x = e.clientX / window.innerWidth
            const y = e.clientY / window.innerHeight

            const dx = x - 0.5
            const dy = y - 0.5
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Distort more strongly when mouse is further from center
            refs.targetDistortion = 0.05 + dist * 0.1
            refs.targetXScale = 1.0 + dx * 0.5
            refs.targetYScale = 0.5 + dy * 0.5
        }

        initScene()
        animate()
        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            if (refs.animationId) cancelAnimationFrame(refs.animationId)
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            if (refs.mesh) {
                refs.scene?.remove(refs.mesh)
                refs.mesh.geometry.dispose()
                if (refs.mesh.material instanceof THREE.Material) {
                    refs.mesh.material.dispose()
                }
            }
            refs.renderer?.dispose()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full block"
        />
    )
}
