import { Box, Text } from "@chakra-ui/react"

type StatisticBoxProps = {children: React.ReactNode, title: string}

export const StatisticBox = ({children, title}: StatisticBoxProps) => {
    return <Box
        bgColor={"gray.100"}
        borderRadius={"md"}
        shadow={"lg"}
        p={4}
        mb={4}
        w="100%"
    >
        <Text
            fontSize={18}
            color={"gray.600"}
            // m={2}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
        >
            {title}
        </Text>
        {children}
    </Box>
}