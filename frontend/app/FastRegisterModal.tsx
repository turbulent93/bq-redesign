import { setTokens } from "@/api/api.handler"
import { CustomForm } from "@/components/CustomForm"
import { PhoneInput } from "@/components/PhoneInput"
import { TokenRequest, UserDto } from "@/services/client"
import { tokensClient, usersClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Grid, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "react-query"

type FastRegisterModalProps = {
    isOpen: boolean
    onClose:() => void
    punchMapId?: number
    promoId?: number
}

export const FastRegisterModal = ({isOpen, onClose, punchMapId, promoId}: FastRegisterModalProps) => {
    const queryClient = useQueryClient()

    const {mutate} = useMutation((data: TokenRequest) => tokensClient.register({login: data.login, punchMapId, promoId}), {
        onSuccess: (data) => {
            console.log(data)
            setTokens(data)
            queryClient.invalidateQueries(["check"])
            onClose()
        }
    })

    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
    >
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
        />
        <ModalContent mx={4} borderRadius={"md"} overflow={"hidden"}>
            <CustomForm onSubmit={mutate} submitText="Начать" my={3}>
                <PhoneInput name={nameof<TokenRequest>("login")}/>
            </CustomForm>
        </ModalContent>
    </Modal>
}