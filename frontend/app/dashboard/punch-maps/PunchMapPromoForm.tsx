import { CustomForm } from "@/components/CustomForm"
import { CustomModal } from "@/components/CustomModal"
import { CustomSelect } from "@/components/CustomSelect"
import { PunchMapPromoDto } from "@/services/client"
import { promosClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Button, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useMutation, useQuery } from "react-query"

type PunchMapPromoFormProps = {
    currentItem?: PunchMapPromoDto
    items: PunchMapPromoDto[]
    setItems: (value: PunchMapPromoDto[]) => void
    isOpen: boolean
    onClose: () => void
}

export const PunchMapPromoForm = ({currentItem, items, setItems, isOpen, onClose}: PunchMapPromoFormProps) => {
    const {data: promos} = useQuery(["geet promos"], () => promosClient.get({page: undefined, size: undefined}), {
        select: (data) => data.list.map(i => ({value: i.id, label: i.title}))
    })

    const RemovePunchMapPromoButton = () => {
        return <Button
            mt={2}
            ml={2}
            color={"white"}
            bgColor={"red.300"}
            _hover={{
                bgColor: "red.200"
            }}
            onClick={() => {
                setItems([...items.filter(i => i.step == currentItem?.step)])
                onClose()
            }}
        >Удалить</Button>
    }

    return <CustomModal
        isOpen={isOpen}
        onClose={onClose}
    >
        <ModalCloseButton />
        <Text fontSize={18} ml={4} mb={2} fontWeight="bold">
            Добавить акцию
        </Text>
        <CustomForm
            submitText={currentItem?.promoId ? "Обновить" : "Добавить"}
            onSubmit={(value) => {
                if(currentItem?.promoId) {
                    setItems([...items.map(i => i.step == currentItem.step ? {...value} : i)])
                } else {
                    setItems([...items, {...value, step: currentItem?.step}])
                }
                onClose()
            }}
            buttons={[
                RemovePunchMapPromoButton
            ]}
            values={currentItem}
        >
            <CustomSelect
                name={nameof<PunchMapPromoDto>("promoId")}
                options={promos}
                label="Промо"
            />
        </CustomForm>
    </CustomModal>
}