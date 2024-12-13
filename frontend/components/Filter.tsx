import { Box, Flex } from "@chakra-ui/react"
import { TiDelete } from "react-icons/ti";

export type FilterItem = {label: string, value: any}

type FilterProps = {
    items: FilterItem[]
    value?: FilterItem
    setValue: (v?: FilterItem) => void
}

export const Filter = ({items, value, setValue}: FilterProps) => {
    return <Flex gap={3} my={3}>
        {
            items.map(i => <Flex
                key={i.label}
                bgColor={i.value == value?.value ? "gray.700" : "gray.100"}
                borderRadius={"md"}
                px={3}
                py={2}
                color={i.value == value?.value ? "white" : "gray.700"}
                onClick={() => setValue(i.value == value?.value ? undefined : i)}
                fontWeight={"bold"}
                alignItems={"center"}
            >
                {
                    i.label
                }
                {
                    i.value == value?.value && <Box ml={2}>
                        <TiDelete size={20} />
                    </Box>
                }
            </Flex>)
        }
    </Flex>
}