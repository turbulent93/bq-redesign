import { Box, Button, Image, Link, Text } from "@chakra-ui/react"

type PromoCardProps = {
    id?: number
    image?: string
    title?: string
    description?: string
}

export const PromoCard = ({id, image, title, description}: PromoCardProps) => {
    return <Box
        borderRadius={14}
        border={"gray.600"}
        shadow={"lg"}
        minW="100%"
    >
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
                bgGradient='linear(to-br, gray.700, red.500)'
                textColor={"white"}
            >
                <Link href={`/appointment?promoId=${id}`}>
                    Записаться
                </Link>
            </Button>
        </Box>
    </Box>
}