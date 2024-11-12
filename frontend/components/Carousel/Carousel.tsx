import { Box, Button, Flex, Image, Text } from "@chakra-ui/react"
import { TouchEventHandler, useEffect, useRef, useState } from "react"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import { useSwipe } from "./useSwipe"

type CarouselProps = {
    items: CardItem[]
    type: "images" | "cards"
    autoSlide?: boolean
}

type CardItem = {
    title?: string
    description?: string
    image?: string
}

const SERVER_URL = process.env.SERVER_URL!

export const Carousel = ({items, type, autoSlide = true}: CarouselProps) => {
    const [curItem, setCurItem] = useState<number>(0)
    // const [autoSlide, setAutoSlide] = useState(as)
    const autoSlideRef = useRef<ReturnType<typeof setInterval>>()

    const toPrev = () => setCurItem((c) => c == 0 ? items.length - 1 : c - 1)
    const toNext = () => setCurItem((c) => c == items.length - 1 ? 0 : c + 1)

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

    // useEffect(() => {
    //     console.log(result)
    //     if(result == "left") {
    //         toNext()
    //     } else if(result == "right") {
    //         toPrev()
    //     }
    //     if(result) {
    //         clearInterval(autoSlideRef.current)
    //     }
    // }, [result])

    return <Box
        overflow={"hidden"}
        position={"relative"}
        h={"400px"}
        {...events}
    >
        <Flex transition={"transform ease-out"} transitionDuration={"500ms"} style={{transform: `translateX(-${curItem * 100}%)`}}>
            {
                type == "images"
                    ? items.map((i, index) => <Box key={index} minW="100%">
                        <Image src={i.image} />
                    </Box>)
                    : items.map((i, index) => <Box
                        key={index}
                        borderRadius={14}
                        border={"gray.600"}
                        shadow={"lg"}
                        minW="100%"
                    >
                        <Image
                            src={`${SERVER_URL}/${i.image}`}
                            borderTopRadius={14}
                            maxH={"200px"}
                            w="100%"
                            objectFit={"cover"}
                        />
                        <Box p={5}>
                            <Text
                                fontSize={24}
                                fontWeight={"bold"}
                                color={"gray.600"}
                                mb={2}
                            >
                                {
                                    i.title
                                }
                            </Text>
                            <Text mb={3}>
                                {
                                    i.description
                                }
                            </Text>
                            <Button
                                bgGradient='linear(to-br, gray.700, red.500)'
                                textColor={"white"}
                            >Записаться</Button>
                        </Box>
                    </Box>)
            }
        </Flex>
        {/* <Flex position={"absolute"} top={0} left={0} bottom={0} alignItems={"center"}>
            <Button
                ml={2}
                size={"sm"}
                opacity={"0.7"}
                onClick={() => {
                    toPrev()
                    clearInterval(autoSlideRef.current)
                }}
                bg="white"
                borderRadius={"100%"}
                p={2}
            >
                <BsArrowLeft />
            </Button>
        </Flex>
        <Flex position={"absolute"} top={0} right={0} bottom={0} alignItems={"center"}>
            <Button
                mr={2}
                size={"sm"}
                opacity={"0.7"}
                onClick={() => {
                    toNext()
                    clearInterval(autoSlideRef.current)
                }}
                bg="white"
                borderRadius={"100%"}
                p={2}
            >
                <Box>
                    <BsArrowRight />
                </Box>
            </Button>
        </Flex> */}
        <Flex position={"absolute"} bottom={2} right={0} left={0} alignItems={"center"} gap={3} mt={3} justifyContent={"center"}>
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
    </Box>
}