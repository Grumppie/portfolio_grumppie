"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation({ onReady }: { onReady?: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<{
        camera: THREE.Camera
        scene: THREE.Scene
        renderer: THREE.WebGLRenderer
        uniforms: any
        animationId: number
    } | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const width = container.clientWidth
        const height = container.clientHeight

        // Vertex shader
        const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

        // Fragment shader
        const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05; // Base speed
        float waveDensity = 7.0; // Higher = less delay between waves
        float lineWidth = 0.005;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*waveDensity - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        
        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `

        // Initialize Three.js scene
        const camera = new THREE.Camera()
        camera.position.z = 1

        const scene = new THREE.Scene()
        const geometry = new THREE.PlaneGeometry(2, 2)

        const uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2(width, height) },
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(width, height)

        // Check if there is an existing canvas, if so remove it to avoid duplicates during strict mode
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }

        container.appendChild(renderer.domElement)

        // Handle window resize
        const onWindowResize = () => {
            if (!container) return;
            const w = container.clientWidth
            const h = container.clientHeight
            renderer.setSize(w, h)
            uniforms.resolution.value.set(w, h);
        }

        // Initial resize
        onWindowResize()
        window.addEventListener("resize", onWindowResize, false)

        // Animation loop
        let firstFrame = true
        const animate = () => {
            const animationId = requestAnimationFrame(animate)
            uniforms.time.value += 0.05
            renderer.render(scene, camera)

            if (firstFrame) {
                firstFrame = false
                onReady?.()
            }

            if (sceneRef.current) {
                sceneRef.current.animationId = animationId
            }
        }

        // Store scene references for cleanup
        sceneRef.current = {
            camera,
            scene,
            renderer,
            uniforms,
            animationId: 0,
        }

        // Start animation
        animate()

        // Cleanup function
        return () => {
            window.removeEventListener("resize", onWindowResize)

            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId)

                if (container && sceneRef.current.renderer.domElement) {
                    try {
                        container.removeChild(sceneRef.current.renderer.domElement)
                    } catch (e) { }
                }

                sceneRef.current.renderer.dispose()
                geometry.dispose()
                material.dispose()
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full h-[100dvh]"
            style={{
                background: "#000",
                overflow: "hidden",
            }}
        />
    )
}
