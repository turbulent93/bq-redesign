'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { Gallery } from "@/app/Gellery";
import Pagination from "@/components/Table/Pagination";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { CreateOrUpdateGalleryRequest, GalleryDto, ServiceDto } from "@/services/client";
import { galleryClient, servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Box, Button, Container, Flex, Grid, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "./Form";

const SERVER_URL = process.env.SERVER_URL!

export default function Page() {
    const [page, setPage] = useState<number>(1)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [currentItem, setCurrentItem] = useState<GalleryDto>()

    const {data} = useQuery(
        ["get gallery", page],
        () => galleryClient.get({page, size: 6})
    )

    const queryClient = useQueryClient()
    
    const {mutate: removeMutate} = useMutation((id: number) => galleryClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get gallery", page])
        }
    })

    const {mutate: updateMutate} = useMutation((item: CreateOrUpdateGalleryRequest) => galleryClient.update(item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get gallery"})
        }
	})

    useEffect(() => {
        console.log(currentItem)
        // if(currentItem)
        //     console.log(data?.list[currentItem])
    }, [currentItem])

    return <>
        <Container maxW="800px">
            <Button mb={4} leftIcon={<CiCirclePlus size={24}/>}>
                <Link href={"gallery/add"}>
                    Добавить
                </Link>
            </Button>
            {/* <Box px={8} py={2} bgColor={"gray.600"}> */}
                <Grid
                    borderRadius={"md"}
                    overflow={"hidden"}
                    templateColumns={"repeat(2, 1fr)"}
                    mb={4}
                    gap={2}
                    >
                    {
                        data?.list?.map(i => <Box
                            position={"relative"}
                            key={i.image.path}
                            borderRadius="md"
                            overflow="hidden"
                        >
                            <Image
                                src={`${SERVER_URL}/${i.image.path}`}
                                w="100%"
                                />
                            <Flex
                                position={"absolute"}
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                zIndex={10}
                                justifyContent={"end"}
                                alignItems={"start"}
                                p={1}
                            >
                                <Button
                                    p={0}
                                    mr={1}
                                    onClick={() => {
                                        setCurrentItem(i)
                                        onOpen()
                                    }}
                                >
                                    <BsPencilFill
                                        size={14}
                                    />
                                </Button>
                                <Popover closeOnBlur={true}>
                                    <PopoverTrigger>
                                        <Button p={0} color="red.400">
                                            <BsFillTrashFill
                                                size={14}
                                            />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow/>
                                        <PopoverCloseButton/>
                                        <PopoverHeader>
                                            Удалить?
                                        </PopoverHeader>
                                        <PopoverBody>
                                            <Button
                                                bgColor={"red.400"}
                                                color={"white"}
                                                _hover={{
                                                    bgColor: "red.300"
                                                }}
                                                mr={2}
                                                onClick={() => removeMutate(i.id!)}
                                            >
                                                Да
                                            </Button>
                                            <Button>
                                                Отмена
                                            </Button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Flex>
                        </Box>)
                    }
                </Grid>
            </Container>
            {/* </Box> */}
            <Pagination
                currentPage={page}
                onPageChange={setPage}
                perPage={6}
                total={data?.totalCount}
            />
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
                <ModalCloseButton />
                <Form
                    mutate={(values) => {
                        updateMutate(values)
                        onClose()
                    }}
                    values={currentItem}
                />
            </ModalContent>
        </Modal>
    </>
}
