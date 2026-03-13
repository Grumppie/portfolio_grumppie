import { useEffect, useState, type RefObject } from "react"

interface UseNearScreenOptions extends IntersectionObserverInit {
  disabled?: boolean
}

export function useNearScreen<T extends Element>(
  ref: RefObject<T | null>,
  { disabled = false, root = null, rootMargin = "200px 0px", threshold = 0.01 }: UseNearScreenOptions = {}
) {
  const [isNearScreen, setIsNearScreen] = useState(disabled)

  useEffect(() => {
    if (disabled) {
      setIsNearScreen(true)
      return
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearScreen(entry.isIntersecting)
      },
      { root, rootMargin, threshold }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [disabled, ref, root, rootMargin, threshold])

  return isNearScreen
}
