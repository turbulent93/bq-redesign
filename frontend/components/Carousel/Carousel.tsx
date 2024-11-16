import { AspectRatio, Box, Button, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import { ComponentType, TouchEventHandler, useEffect, useRef, useState } from "react"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import { useSwipe } from "./useSwipe"

type CarouselProps = {
    items?: ComponentType[]
    autoSlide?: boolean
}

type CardItem = {
    title?: string
    description?: string
    image?: string
}

const SERVER_URL = process.env.SERVER_URL!

export const Carousel = ({items, autoSlide = true}: CarouselProps) => {
    const [curItem, setCurItem] = useState<number>(0)
    // const [autoSlide, setAutoSlide] = useState(as)
    const autoSlideRef = useRef<ReturnType<typeof setInterval>>()

    const toPrev = () => setCurItem((c) => items?.length ? c == 0 ? items?.length - 1 : c - 1 : 0)
    const toNext = () => setCurItem((c) => items?.length ? c == items?.length - 1 ? 0 : c + 1 : 0)

    useEffect(() => {
        if(!autoSlide) return

        autoSlideRef.current = setInterval(toNext, 5000)

        return () => clearInterval(autoSlideRef.current)
    }, [])

    const events = useSwipe({
        leftHandler: () => {
            toNext()
            clearInterval(autoSlideRef.current)
        },
        rightHandler: () => {
            toPrev()
            clearInterval(autoSlideRef.current)
        },
    })

    if(!items)
        <Spinner textAlign={"center"} />

    return <Box
        overflow={"hidden"}
        position={"relative"}
        {...events}
    >
        <Flex
            transition={"transform ease-out"}
            transitionDuration={"500ms"}
            style={{transform: `translateX(-${curItem * 100}%)`}}
            mb={items!.length > 1 ? 12 : 8}
        >
            {
                items?.map((Item, index) => <Item key={index} />)
            }
        </Flex>
        {
            items!.length > 1 && <Flex position={"absolute"} bottom={1} right={0} left={0} alignItems={"center"} gap={3} my={3} justifyContent={"center"}>
                {
                    items?.map((i, index) => <Box
                        w={"12px"}
                        h={"12px"}
                        borderRadius={"100%"}
                        bgColor={"gray.600"}
                        p={curItem == index ? 2 : 0}
                        opacity={curItem == index ? "1" : "0.7"}
                        onClick={() => setCurItem(index)}
                        transition={"all"}
                        transitionDuration={"100ms"}
                        key={index}
                    />)
                }
            </Flex>
        }
    </Box>
}