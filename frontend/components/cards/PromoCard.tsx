import { PartialUserUpdateDto } from "@/services/client"
import { usersClient } from "@/services/services"
import { PROMO_TYPE_BONUS, PROMO_TYPE_DISCOUNT, PROMO_TYPE_INVITE } from "@/utils/constants"
import { useAuth } from "@/utils/useAuth"
import { Box, Button, Image, Link, Text, useClipboard, useToast } from "@chakra-ui/react"
import { FaRegCopy } from "react-icons/fa"
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

type ButtonProps = Pick<PromoCardProps, "type" | "id">

const ButtonContent = ({type, id}: ButtonProps & {hasCopied: boolean}) => {
    const {user} = useAuth()

    if(type == PROMO_TYPE_INVITE && user?.invitePromoId == id) {
        // if(hasCopied) {
        //     return "Скипировано"
        // }
        return "Скопировать ссылку для записи"
    }

    if(!!user?.promos?.find(i => i.id == id)) {
        return <IoCheckmark size={24} />
    }

    if(type == PROMO_TYPE_DISCOUNT) {
        return <Link href={`/appointment?promoId=${id}`}>
            Записаться
        </Link>
    }

    return "Использовать"    
}

export const PromoCard = ({id, image, title, description, type, register, startDate, endDate}: PromoCardProps) => {
    const {isAuth, user} = useAuth()

    const queryClient = useQueryClient()

    const toast = useToast()
    const {onCopy, setValue, hasCopied} = useClipboard('')

    const {mutate, isLoading} = useMutation((item: PartialUserUpdateDto) => usersClient.partialUpdate(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "check"})
        }
	})

    const handler = () => {
        if(type == PROMO_TYPE_DISCOUNT) return

        if(!isAuth) register?.()

        if(type == PROMO_TYPE_INVITE) {
            if(user?.invitePromoId == id) {
                setValue(`https://bg-kurgan.ru/appointment?inviterId=${user?.id}`)
                onCopy()
                toast({
                    title: "Ссылка скопирована",
                    // status: "info",
                    position: "top",
                    colorScheme: "gray"
                })
            } else {
                mutate({id: user?.id!, promoId: id})
            }
        }

        if(!user?.promos?.find(i => i.id == id)) {
            mutate({id: user?.id!, promoId: id})
        } else {
            toast({
                title: "Акция уже была использована",
                status: "info"
            })
        }
    }

    return <Box
        // borderRadius={"md"}
        borderRadius={14}
        border={"gray.600"}
        shadow={"lg"}
        minW="100%"
        position={"relative"}
    >
        {
            // (startDate || endDate) && <Box
            //     fontSize={12}
            //     position={"absolute"}
            //     top={0}
            //     right={0}
            //     ml={2}
            //     bgColor={"gray.700"}
            //     color={"white"}
            //     px={2}
            //     py={1}
            //     // borderRadius={14}
            //     borderRadius={"md"}
            //     borderTopRightRadius={14}
            //     // borderBottomLeftRadius={"md"}
            //     shadow={"lg"}
            //     zIndex={10}
            //     textTransform={"uppercase"}
            // >
            //     {
            //         startDate && `с ${startDate}`
            //     } {
            //         endDate && `до ${endDate}`
            //     }
            // </Box>
        }
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
                minW={"160px"}
                textColor={"white"}
                isDisabled={!!user?.promos?.find(i => i.id == id)}
                _disabled={{
                    opacity: 1
                }}
                _hover={{
                    opacity: 1
                }}
                onClick={handler}
                rightIcon={user?.invitePromoId == id ? hasCopied ? <Box color="gray.300"><IoCheckmark /></Box> : <FaRegCopy /> : undefined}
            >
                <ButtonContent type={type} id={id} hasCopied={hasCopied} />
            </Button>
        </Box>
    </Box>
}