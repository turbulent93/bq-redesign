import { PartialUserUpdateDto, PromoDto, PunchMapPromoDto, UserDto } from "@/services/client"
import { promosClient, usersClient } from "@/services/services"
import { useAuth } from "@/utils/useAuth"
import { Box, Button, Flex, Grid, Link, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { IoCheckmark } from "react-icons/io5"
import { SlPresent } from "react-icons/sl"
import { useMutation, useQuery, useQueryClient } from "react-query"

type PunchMapCardProps = {
    columnsCount: number
    stepsCount: number
    items?: PunchMapPromoDto[]
    setItems?: (value: PunchMapPromoDto[]) => void
    onOpen?: (value: PunchMapPromoDto) => void
    promos?: PromoDto[]
    id?: number
    register?: () => void
    showProgress?: boolean
}

export const PunchMapCard = ({columnsCount, stepsCount, items, onOpen, id, register, showProgress = false}: PunchMapCardProps) => {
    // const lastStep = 4 //useMemo(() => items ? items.reduce((p, c) => c.step > p ? c.step : p, 0) : 0, [items])
    const {user, isLoading, isAuth} = useAuth()

	const queryClient = useQueryClient()

    const {mutate} = useMutation((item: PartialUserUpdateDto) => usersClient.partialUpdate(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "check"})
        }
	})

    const {data: promos} = useQuery(
        ["get promos"],
        () => promosClient.get({})
    )

    return <>
        <Box
            bgGradient='linear(to-br, gray.700, red.500)'
            borderRadius={"md"}                
            p={4}
            color={"white"}
            minW="100%"
        >
            <Grid
                templateColumns={`repeat(${columnsCount}, 1fr)`}
                gap={2}
                mt={4}
            >
                {
                    Array.from(Array(stepsCount).keys()).map(i => <Flex key={i} alignItems={"center"} flexDir={"column"} h={"70px"}>
                        <Flex
                            borderRadius={"100%"}
                            border={(!user?.stepsCount || i + 1 > user?.stepsCount) ? "1px" : undefined}
                            borderColor={"gray.200"}
                            w="40px"
                            h="40px"
                            justifyContent={"center"}
                            alignItems={"center"}
                            bgColor={showProgress && user?.stepsCount! >= i + 1 ? "gray.700" : undefined}
                            color={showProgress && user?.stepsCount! >= i + 1 ? "green.400" : undefined}
                            onClick={() => onOpen?.(items?.find(p => p.step == i + 1) || {step: i + 1} as PunchMapPromoDto)}
                        >
                            {
                                showProgress && user?.stepsCount! >= i + 1 ? <IoCheckmark size={26} /> : items?.some(p => p.step == i + 1) ? <SlPresent size={20} /> : i + 1
                            }
                        </Flex>
                    </Flex>)
                }
            </Grid>
            <Flex>
                <Box mx={"auto"}>
                    {
                        items?.sort((a, b) => a.step - b.step).map((i, index) => <Flex
                            key={index}
                            mb={2}
                            alignItems={"center"}
                        >
                            {
                                showProgress && user?.stepsCount! >= i.step && <Box
                                    color={"green.400"}
                                    mr={2}
                                >
                                    <IoCheckmark size={20} />
                                </Box>
                            }
                            <Text
                                fontSize={12}
                                // w="160px"
                            >*{i.step} - {i.promo?.description || promos?.list.find(p => p.id == i.promoId)?.description}</Text>
                            {
                                showProgress && user?.stepsCount! >= i.step && <Box
                                ml="auto"
                                w="100px"><Button
                                    colorScheme="blackAlpha"
                                    size={"sm"}
                                    ml={2}
                                >
                                    <Link href={`/appointment?promoId=${i.promoId}`}>
                                        Записаться
                                    </Link>
                                </Button>
                                </Box>
                            }
                        </Flex>)
                    }
                </Box>
            </Flex>
            {
                register && <Flex
                    mt={4}
                    justifyContent={"center"}
                >
                    <Button
                        colorScheme="blackAlpha"
                        color={user?.punchMapId == id ? "green.400" : undefined}
                        onClick={() => isAuth ? mutate({id: user?.id!, punchMapId: id}) : register?.()}
                        isLoading={isLoading}
                        w="100px"
                    >
                        {
                            user?.punchMapId == id ? <IoCheckmark size={24} /> : "Начать"
                        }
                    </Button>
                </Flex>
            }
        </Box>
    </> 
}