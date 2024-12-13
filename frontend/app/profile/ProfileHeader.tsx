import { CustomForm } from "@/components/CustomForm";
import { CustomInput } from "@/components/CustomInput";
import { PartialUserUpdateDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { DATE_FORMAT, PROMO_TYPE_BONUS } from "@/utils/constants";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Box, Button, Container, Flex, Link, Modal, ModalContent, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import moment from "moment";
import { BsPencilFill } from "react-icons/bs";
import { TbArrowBarToLeft } from "react-icons/tb";
import { useMutation, useQueryClient } from "react-query";
import { BonusCount } from "./BonusCount";
import { CustomModal } from "@/components/CustomModal";
import { IoExitOutline } from "react-icons/io5";

const LogoutButton = () => {
    const {logout} = useAuth()

    return <Button
        bgColor={"red.300"}
        color="white"
        onClick={logout}
        leftIcon={<IoExitOutline/>}
        ml={3}
    >
        <Text>
            Выйти
        </Text>
    </Button>
}

export const ProfileHeader = () => {
    const {user} = useAuth()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const queryClient = useQueryClient()
    const toast = useToast()

    const {mutate} = useMutation((item: PartialUserUpdateDto) => usersClient.partialUpdate(user?.id!, item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "check"})
            onClose()
        },
        onError: () => {
            toast({
                position: "top",
                status: "error",
                title: "Номер телефона занят"
            })
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
                            user?.login
                        }
                    </Text>
                </Flex>
                <BonusCount data={user} />
            </Flex>
        </Flex>
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
        >
            <CustomForm onSubmit={mutate} submitText="Обновить" values={{phone: user?.login}} buttons={[LogoutButton]}>
                <CustomInput name={nameof<PartialUserUpdateDto>("phone")} label={"Телефон"} type="phone"/>
            </CustomForm>
        </CustomModal>
    </Container>
}