import { Composition } from "remotion"
import { PortfolioShowcase } from "./PortfolioShowcase"

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PortfolioShowcaseVertical"
        component={PortfolioShowcase}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ variant: "vertical" as const }}
      />
      <Composition
        id="PortfolioShowcaseSquare"
        component={PortfolioShowcase}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ variant: "square" as const }}
      />
    </>
  )
}
