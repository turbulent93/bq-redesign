"use client"

import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomSelect } from "@/components/CustomSelect"
import { FileUpload } from "@/components/FileUpload"
import { UserDto } from "@/services/client"
import { specializationsClient, usersClient } from "@/services/services"
import { CLIENT_ROLE_NAME, MASTER_ROLE_NAME } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import { useAuth } from "@/utils/useAuth"
import { Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { MasterForm } from "./MasterForm"
import { ClientForm } from "./ClientForm"

type FormProps = {
    mutate: (item: UserDto) => void,
    values?: UserDto
}

export const Form = (props: FormProps) => {
    const [tab, setTab] = useState<number>()

    return <Tabs tabIndex={tab} onChange={setTab}>
        <TabList mx={4}>
            <Tab>Мастер</Tab>
            <Tab>Клиент</Tab>
        </TabList>
        <TabPanels>
            <TabPanel px={0}>
                <MasterForm {...props} isRoleVisible />
            </TabPanel>
            <TabPanel px={0}>
                <ClientForm {...props} />
            </TabPanel>
        </TabPanels>
    </Tabs>
}