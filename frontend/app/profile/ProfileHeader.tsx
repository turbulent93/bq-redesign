import { CustomForm } from "@/components/CustomForm";
import { CustomInput } from "@/components/CustomInput";
import { PartialUserUpdateDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { PROMO_TYPE_BONUS } from "@/utils/constants";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Box, Button, Container, Flex, Link, Modal, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import { BsPencilFill } from "react-icons/bs";
import { TbArrowBarToLeft } from "react-icons/tb";
import { useMutation, useQueryClient } from "react-query";

export const ProfileHeader = () => {
    const {user: data} = useAuth()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const queryClient = useQueryClient()

    const {mutate} = useMutation((item: PartialUserUpdateDto) => usersClient.partialUpdate(data?.id!, item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "check"})
            onClose()
        }
	})

    return <Container>
        <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            py={2}
            gap={3}
            mb={4}
            borderBottom={"1px"}
            borderColor={"gray.300"}
        >
            <Link href="/" color="gray.700">
                <TbArrowBarToLeft size={24} />
            </Link>
            <Flex alignItems={"center"} gap={2}>
                <Flex alignItems={"center"} onClick={onOpen}>
                    <BsPencilFill size={14} />
                    <Text
                        ml={2}
                        fontSize={16}
                        fontWeight={"bold"}
                    >
                        {
                            data?.login
                        }
                    </Text>
                </Flex>
                <Box
                    px={2}
                    py={1}
                    borderRadius={"md"}
                    // bgGradient='linear(to-br, gray.700, red.500)'
                    bgColor={"gray.700"}
                    color="white"
                    shadow={"lg"}
                >
                    {
                        data
                            ?.appointments
                            ?.filter(i => moment(i.schedule?.date, "DD.MM.YYYY HH:mm:ss").isSameOrAfter(moment().month(-3))
                                && i.paidWithBonuses == 0)
                            .reduce((c, i) => c + i.service?.bonusCount!, 0)!
                        + data
                            ?.promos
                            ?.filter(i => (!i.startDate || moment(i.startDate, "DD.MM.YYYY HH:mm:ss").isSameOrBefore(moment()))
                                && (!i.endDate || moment(i.endDate, "DD.MM.YYYY HH:mm:ss").isSameOrAfter(moment()))
                                && i.type == PROMO_TYPE_BONUS)
                            .reduce((c, i) => c + (i?.bonusCount || 0), 0)!
                        - data
                            ?.appointments
                            ?.filter(i => i.paidWithBonuses && i.paidWithBonuses > 0)
                            .reduce((c, i) => c + i.paidWithBonuses!, 0)!
                    } бонусов
                </Box>
            </Flex>
        </Flex>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px)'
            />
            <ModalContent mx={4} borderRadius={"md"} overflow={"hidden"}>
                <CustomForm onSubmit={mutate} submitText="Обновить">
                    <CustomInput name={nameof<PartialUserUpdateDto>("phone")} label={"Телефон"} type="phone"/>
                </CustomForm>
            </ModalContent>
        </Modal>
    </Container>
}