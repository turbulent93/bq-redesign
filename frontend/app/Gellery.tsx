import { CustomModal } from "@/components/CustomModal"
import { GalleryDto } from "@/services/client"
import { Grid, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"

type GalleryProps = {
    items?: GalleryDto[]
}

const SERVER_URL = process.env.SERVER_URL!

export const Gallery = ({items}: GalleryProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [currentItem, setCurrentItem] = useState<GalleryDto>()

    return <>
        {
            items && items.length > 0 && <Text fontSize={22} textAlign={"center"} mb={3} fontWeight={"bold"}>
                Галерея работ
            </Text>
        }
        <Grid
            borderRadius={"md"}
            overflow={"hidden"}
            templateColumns={"repeat(2, 1fr)"}
            mb={8}
        >
            {
                items?.map(i => <Image
                    key={i.id}
                    w="100%"
                    src={`${SERVER_URL}/${i.image.path}`}
                    onClick={() => {
                        setCurrentItem(i)
                        onOpen()
                    }}/>)
            }
        </Grid>
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            onClick={onClose}
        >
            {
                currentItem && items && <Image src={`${SERVER_URL}/${currentItem.image.path}`} />
            }
        </CustomModal>
    </>
}