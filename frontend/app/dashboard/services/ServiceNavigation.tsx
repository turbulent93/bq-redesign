import { serviceRoutes } from "@/components/Sidebar/routes"
import { Button, Flex, Link } from "@chakra-ui/react"
import { usePathname } from "next/navigation"

export const ServiceNavigation = () => {
    const pathname = usePathname()

    return <Flex gap={3} mb={3}>
        {
            serviceRoutes.map(i => <Button
                key={i.href}
                border={0}
                bgColor={"inherit"}
                borderBottom={"1px"}
                borderBottomColor={pathname.includes(i.href) ? "blue.500" : "gray.500"}
                borderRadius={0}
                _focus={{
                    bgColor: "inherit"
                }}
            >
                <Link href={i.href}>{i.title}</Link>
            </Button>)
        }
    </Flex>
}