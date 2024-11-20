import { PartialUserUpdateDto } from "@/services/client"
import { usersClient } from "@/services/services"
import { PROMO_TYPE_BONUS } from "@/utils/constants"
import { useAuth } from "@/utils/useAuth"
import { Box, Button, Image, Link, Text } from "@chakra-ui/react"
import { IoCheckmark } from "react-icons/io5"
import { useMutation, useQueryClient } from "react-query"

type PromoCardProps = {
    id?: number
    image?: string
    title?: string
    description?: string
    type?: string
    register?: () => void
    startDate?: string
    endDate?: string
}

export const PromoCard = ({id, image, title, description, type, register, startDate, endDate}: PromoCardProps) => {
    const {isAuth, user} = useAuth()

    const queryClient = useQueryClient()

    const {mutate, isLoading} = useMutation((item: PartialUserUpdateDto) => usersClient.partialUpdate(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "check"})
        }
	})

    return <Box
        // borderRadius={"md"}
        borderRadius={14}
        border={"gray.600"}
        shadow={"lg"}
        minW="100%"
        position={"relative"}
    >
        <Box
            fontSize={12}
            position={"absolute"}
            top={0}
            right={0}
            ml={2}
            bgColor={"gray.700"}
            color={"white"}
            px={2}
            py={1}
            // borderRadius={14}
            borderRadius={"md"}
            borderTopRightRadius={14}
            // borderBottomLeftRadius={"md"}
            shadow={"lg"}
            zIndex={10}
            textTransform={"uppercase"}
        >
            {
                startDate && `с ${startDate}`
            } {
                endDate && `до ${endDate}`
            }
        </Box>
        <Image
            src={image ? image : "/haircut.jpg"}
            // src={"/haircut.jpg"}
            borderTopRadius={14}
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
                {title || "Заголовок"}
            </Text>
            <Text mb={3}>
                {description || "Описание"}
            </Text>
            <Button
                isLoading={isLoading}
                bgGradient='linear(to-br, gray.700, red.500)'
                _active={{
                    bgGradient: 'linear(to-br, gray.700, red.500)'
                }}
                _focus={{
                    bgGradient: 'linear(to-br, gray.700, red.500)'
                }}
                w={"160px"}
                textColor={"white"}
                isDisabled={!!user?.promos?.find(i => i.id == id)}
                _disabled={{
                    opacity: "0.8"
                }}
                onClick={() => type == PROMO_TYPE_BONUS
                    ? isAuth && !user?.promos?.find(i => i.id == id)
                        ? mutate({id: user?.id!, promoId: id})
                        : register?.()
                    : undefined }
            >
                {
                    type == PROMO_TYPE_BONUS
                        ? !!user?.promos?.find(i => i.id == id)
                            ? <IoCheckmark size={24} />
                            : "Использовать"
                        : <Link href={`/appointment?promoId=${id}`}>
                            Записаться
                        </Link>
                }
            </Button>
        </Box>
    </Box>
}