'use client';

import { Suspense, lazy, Component } from 'react';
import type { ReactNode } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
    scene: string;
    className?: string;
    onLoad?: (app: any) => void;
}

/** Error boundary — catches Spline load failures without crashing the whole app */
class SplineErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return <div style={{ width: '100%', height: '100%' }} />;
        }
        return this.props.children;
    }
}

/**
 * Lazy-loaded Spline wrapper with error boundary.
 * Parent MUST have explicit width/height — the canvas fills its parent.
 */
export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
    return (
        <SplineErrorBoundary>
            <Suspense
                fallback={
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
                }
            >
                <Spline scene={scene} className={className} onLoad={onLoad} />
            </Suspense>
        </SplineErrorBoundary>
    );
}

// Inject spinner keyframes once
if (typeof document !== 'undefined') {
    const id = 'spline-scene-styles';
    if (!document.getElementById(id)) {
        const s = document.createElement('style');
        s.id = id;
        s.textContent = '@keyframes spline-spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
    }
}
