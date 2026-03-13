import { useEffect, useState } from "react"

interface DeviceProfile {
  isMobile: boolean
  canHover: boolean
  prefersReducedMotion: boolean
}

const DEFAULT_PROFILE: DeviceProfile = {
  isMobile: false,
  canHover: true,
  prefersReducedMotion: false,
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(DEFAULT_PROFILE)

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)")
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateProfile = () => {
      setProfile({
        isMobile: mobileQuery.matches,
        canHover: hoverQuery.matches,
        prefersReducedMotion: motionQuery.matches,
      })
    }

    updateProfile()

    mobileQuery.addEventListener("change", updateProfile)
    hoverQuery.addEventListener("change", updateProfile)
    motionQuery.addEventListener("change", updateProfile)

    return () => {
      mobileQuery.removeEventListener("change", updateProfile)
      hoverQuery.removeEventListener("change", updateProfile)
      motionQuery.removeEventListener("change", updateProfile)
    }
  }, [])

  return profile
}
