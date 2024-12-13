"use client"

import { uploadClient } from "@/services/services";
import { AspectRatio, Box, Button, Flex, Grid, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { ChangeEventHandler, createRef, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form";
import { LuUpload } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";

import Cropper, { ReactCropperElement } from "react-cropper"
import "cropperjs/dist/cropper.css";
import { BsFillTrashFill } from "react-icons/bs";
import { FileDto } from "@/services/client";
import { CustomModal } from "./CustomModal";

type FileUploadProps = {
    name: string
    employeeId?: number
    multiple?: boolean
    aspectRatio?: number
}

const SERVER_URL = process.env.SERVER_URL!

export const FileUpload = ({name, multiple, aspectRatio = 1}: FileUploadProps) => {
    const toast = useToast()
    const {watch, setValue, getValues} = useFormContext()
    const fileId = watch(name)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [images, setImages] = useState<FileDto[]>([]) // "/haircut.jpg"
    const [curImage, setCurImage] = useState<number>(0)
    const [cropData, setCropData] = useState<FileDto[]>([])//(["files/06759efa-9817-462e-b288-2a33e7200fc2.jpg", "files/2417710c-a6c5-40c0-8c55-099faacb9fb8.jpg"]);
    
    const inputRef = useRef<HTMLInputElement>(null)
    const cropperRef = useRef<ReactCropperElement>(null);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault()
        if(!e.target.files)
            return

        const files: FileDto[] = []
        for (let i = 0; i < e.target.files.length; i++) {
            // reader.readAsDataURL(e.target.files[i])
            // console.log(URL.createObjectURL(e.target.files[i]))
            files.push({path: URL.createObjectURL(e.target.files[i]), name: e.target.files[i].name, id: 0})
        }
        setImages(files)

        setCurImage(0)
        onOpen()
    };

    const toNext = () => setCurImage(curImage != images.length - 1 ? curImage + 1 : images.length - 1)

    const {mutate: uploadMutate} = useMutation((data: File) => uploadClient.upload({data, fileName: data.name}), {
        onSuccess: (data) => {
            if(multiple) {
                setCropData([...cropData, data])
                setValue(name, [...(!!getValues(name) ? getValues(name) : []), data.id])
            } else {
                setCropData([data])
                setValue(name, data.id)
            }

            toNext()
            
            if(images.length - 1 == curImage) {
                onClose()
            } else {
                onOpen()
            }
        },
        onError: () => {

        },
        onMutate: () => console.log("upload")
    })

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            // setCropData([...cropData, cropperRef.current?.cropper.getCroppedCanvas().toDataURL()]);

            const dataURI = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
            var byteString = atob(dataURI.split(',')[1])
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
            var ab = new ArrayBuffer(byteString.length)
            var ia = new Uint8Array(ab)

            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i)
            }

            var blob = new Blob([ab], {type: mimeString})
            var f = new File([blob], images[curImage!].name)
            
            uploadMutate(f)
        }
    }

    const {} = useQuery(["view file", fileId], () => uploadClient.view(fileId), {
        enabled: !!fileId && cropData.length == 0,
        onSuccess: (data) => {
            // console.log("view file", data, "crop data", cropData)
            setCropData([...cropData, data])
        }
    })

    const {mutate: removeMutate} = useMutation((id: number) => uploadClient.remove(id), {
        onSuccess: () => {
            setCropData([])
            toast({
                title: "Фотография удалена",
                status: "error"
            })
        }
    })

    return <Box>
        <Input
            accept="image/*"
            type="file"
            display={"none"}
            ref={inputRef}
            onChange={onChange}
            multiple={multiple}
        />
        <Flex
            border={(multiple || cropData.length == 0) ? "1px" : undefined}
            borderColor={"gray.500"}
            borderStyle={"dashed"}
            borderRadius={"100%"}
            bgColor={"gray.100"}
            _hover={{
                bgColor: "gray.200"
            }}
            transition={"background-color 0.5s ease"}
            cursor={"pointer"}
            w={"100px"}
            h={"100px"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={() => inputRef.current?.click()}
            mb={1}
            overflow={"hidden"}
            mx="auto"
        >
            {
                cropData && cropData.length > 0 && !multiple
                    ? <Image
                        src={`${SERVER_URL}/${cropData[0].path}`}
                        // src={cropData[0]}
                        w={"100px"}
                        h={"100px"}
                        objectFit={'cover'}
                        
                    />
                    : <LuUpload />
            }
        </Flex>
        {
            cropData && !multiple && <Text
                fontSize={"12px"}
                textColor={"blue.300"}
                onClick={() => removeMutate(cropData[0].id)}
                textAlign={"center"}
            >
                Удалить фото
            </Text>
        }
        {
            cropData.length > 0 && multiple && <Grid 
                templateColumns={"repeat(3, 1fr)"}
                // borderRadius="md"
                my={4}
                gap={2}
            >
                {
                    cropData.map(i => <Box
                        position={"relative"}
                        key={i.path}
                        borderRadius="md"
                        overflow="hidden"
                    >
                        <Image
                            src={`${SERVER_URL}/${i.path}`}
                            w="100%"
                        />
                        <Flex
                            position={"absolute"}
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            zIndex={10}
                            // _hover={{
                            //     opacity: "0.7",
                            //     color: "red.400"
                            // }}
                            justifyContent={"end"}
                            alignItems={"start"}
                            // color="inherit"
                            p={1}
                        >
                            {/* <Button p={0} mr={1}>
                                <BsEye
                                    size={14}
                                />
                            </Button> */}
                            <Button p={0} color="red.400" onClick={() => removeMutate(i.id)}>
                                <BsFillTrashFill
                                    size={14}
                                />
                            </Button>
                        </Flex>
                    </Box>)
                }
            </Grid>
        }
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
        >
            {
                curImage != undefined && images[curImage] != undefined && <Cropper
                    style={{ width: "100%", marginTop: "40px", maxHeight: "600px" }}
                    // initialAspectRatio={1}
                    src={images[curImage].path}
                    ref={cropperRef}
                    // viewMode={1}
                    // guides={true}
                    aspectRatio={aspectRatio}
                    // minCropBoxHeight={10}
                    // minCropBoxWidth={10}
                    // background={false}
                    // responsive={true}
                />
            }
            <Flex>
                <Button
                    onClick={toNext}
                    colorScheme="red"
                    m={2}
                    w="100%"
                >
                    Отмена
                </Button>
                <Button
                    onClick={getCropData}
                    colorScheme="blue"
                    m={2}
                    w="100%"
                >
                    Отправить
                </Button>
            </Flex>
        </CustomModal>
    </Box>
}