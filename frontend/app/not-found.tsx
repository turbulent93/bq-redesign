import { Flex, Text } from "@chakra-ui/react";

export default function NotFound() {
    return <Text fontSize={24} fontWeight={"bold"} color={"gray.600"} mt={14} textAlign={"center"}>
        Страница не найдена
    </Text>
    // return <Flex w="100vw" h="100vh" alignItems={"center"} justifyContent={"center"}>
    //     <Text fontSize={24} fontWeight={"bold"} color={"gray.600"}>
    //         Страница не найдена
    //     </Text>
    // </Flex>
}