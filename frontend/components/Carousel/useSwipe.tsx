import { TouchEventHandler, useState } from "react"

type UseSwipeProps = {
    leftHandler?: () => void
    rightHandler?: () => void
}

export const useSwipe = ({leftHandler, rightHandler}: UseSwipeProps) => {
    const [touchStart, setTouchStart] = useState<number>()
    const [touchEnd, setTouchEnd] = useState<number>()
    // const [result, setResult] = useState<"left" | "right">()

    const minSwipeDistance = 50 

    const onTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
        setTouchEnd(undefined)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove: TouchEventHandler<HTMLDivElement> = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        console.log(touchStart, touchEnd)

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe && leftHandler) leftHandler()
            
        if(isRightSwipe && rightHandler) rightHandler()
    }

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    }
}