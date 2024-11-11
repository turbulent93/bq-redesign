import { Button, Flex, Switch, Text } from "@chakra-ui/react"
import Link from "next/link"
import { useEffect } from "react"
import { CiCirclePlus } from "react-icons/ci"

type DashboardHeaderProps = {
    addUrl: string
    abbreviatedTable: boolean
    setAbbreviatedTable: (value: boolean) => void
}

export const DashboardHeader = ({addUrl, abbreviatedTable, setAbbreviatedTable}: DashboardHeaderProps) => {
    useEffect(() => {
        if(window.innerWidth <= 500) {
            setAbbreviatedTable(true)
        }
    }, [])

    return <Flex alignItems={"center"} mb={4}>
        <Button leftIcon={<CiCirclePlus size={24}/>}>
            <Link href={addUrl}>
                Добавить
            </Link>
        </Button>
        <Switch
            isChecked={abbreviatedTable}
            onChange={(e) => setAbbreviatedTable(e.target.checked)}
            mx={3}
            variant={"gray"}
        />
        <Text
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
        >
            Сокращенный вид
        </Text>
    </Flex>
}