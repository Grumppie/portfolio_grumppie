'use client'

import { Component, createElement, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const SPLINE_VIEWER_SCRIPT_ID = 'spline-viewer-script'
const SPLINE_VIEWER_SCRIPT_SRC = 'https://unpkg.com/@splinetool/viewer/build/spline-viewer.js'

interface SplineSceneProps {
    scene: string
    className?: string
    onLoad?: () => void
}

class SplineErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return <div style={{ width: '100%', height: '100%' }} />
        }

        return this.props.children
    }
}

function ensureSplineViewerScript() {
    const existing = document.getElementById(SPLINE_VIEWER_SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
        if (customElements.get('spline-viewer')) {
            return Promise.resolve()
        }

        return new Promise<void>((resolve, reject) => {
            existing.addEventListener('load', () => resolve(), { once: true })
            existing.addEventListener('error', () => reject(new Error('Failed to load Spline Viewer')), { once: true })
        })
    }

    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.id = SPLINE_VIEWER_SCRIPT_ID
        script.src = SPLINE_VIEWER_SCRIPT_SRC
        script.type = 'module'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Spline Viewer'))
        document.head.appendChild(script)
    })
}

function SplineFallback() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
            }}
        >
            <span
                style={{
                    width: 32,
                    height: 32,
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderTopColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '50%',
                    animation: 'spline-spin 0.8s linear infinite',
                }}
            />
        </div>
    )
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
    const [viewerReady, setViewerReady] = useState(() => typeof window !== 'undefined' && Boolean(customElements.get('spline-viewer')))
    const [loadFailed, setLoadFailed] = useState(false)
    const viewerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        let cancelled = false

        if (viewerReady || loadFailed) return

        ensureSplineViewerScript()
            .then(() => {
                if (!cancelled) {
                    setViewerReady(true)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadFailed(true)
                }
            })

        return () => {
            cancelled = true
        }
    }, [loadFailed, viewerReady])

    useEffect(() => {
        const viewer = viewerRef.current
        if (!viewer || !viewerReady || !onLoad) return

        const handleLoad = () => onLoad()
        viewer.addEventListener('load', handleLoad)

        return () => viewer.removeEventListener('load', handleLoad)
    }, [onLoad, viewerReady])

    return (
        <SplineErrorBoundary>
            {viewerReady && !loadFailed ? (
                createElement('spline-viewer', {
                    ref: viewerRef,
                    url: scene,
                    class: className,
                    style: { width: '100%', height: '100%', display: 'block' },
                })
            ) : (
                <SplineFallback />
            )}
        </SplineErrorBoundary>
    )
}

if (typeof document !== 'undefined') {
    const id = 'spline-scene-styles'
    if (!document.getElementById(id)) {
        const style = document.createElement('style')
        style.id = id
        style.textContent = '@keyframes spline-spin { to { transform: rotate(360deg); } }'
        document.head.appendChild(style)
    }
}
