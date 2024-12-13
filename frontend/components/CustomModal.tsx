import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"

type CustomModalProps = {
    isOpen: boolean
    onClose: () => void
    onClick?: () => void
    children: React.ReactNode
}

export const CustomModal = ({isOpen, onClose, children, onClick}: CustomModalProps) => {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
    >
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
        />
        <ModalContent py={4} mx={4} borderRadius={"md"} overflow={"hidden"} onClick={onClick}>
            {children}
        </ModalContent>
    </Modal>
}