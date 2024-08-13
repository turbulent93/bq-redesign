"use client"

import { uploadClient } from "@/services/services";
import { Box, Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { ChangeEventHandler, createRef, useRef, useState } from "react"
import { useFormContext } from "react-hook-form";
import { LuUpload } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";

import Cropper, { ReactCropperElement } from "react-cropper"
import "cropperjs/dist/cropper.css";

const dataUrlToFile = (url: string, fileName: string) => {
    const [mediaType, data] = url.split(",");
  
    const mime = mediaType.match(/:(.*?);/)?.[0];
  
    let n = data.length;
  
    const arr = new Uint8Array(n);
  
    while (n--) {
      arr[n] = data.charCodeAt(n);
    }
  
    return new File([arr], fileName, { type: mime });
  };


type FileUploadProps = {
    name: string
    employeeId?: number
}

const SERVER_URL = process.env.SERVER_URL!

export const FileUpload = ({name}: FileUploadProps) => {
    const toast = useToast()
    const {watch, setValue} = useFormContext()

    const fileId = watch(name)

    const inputRef = useRef<HTMLInputElement>(null)
    const cropperRef = createRef<ReactCropperElement>();


    const [file, setFile] = useState<File>()
    const [croppedSrc, setCroppedSrc] = useState<string>()

    const { isOpen, onOpen, onClose } = useDisclosure()


    const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        if(e.target.files && e.target.files.length > 0) {
            // setFile(e.target.files[0])
            // onOpen()
            uploadMutate(e.target.files[0])
            // setCroppedSrc(URL.createObjectURL(e.target.files[0]))
        }
    }

    const {} = useQuery(["view file", fileId], () => uploadClient.view(fileId), {
        enabled: fileId && !croppedSrc,
        onSuccess: (data) => {
            setCroppedSrc(data.path)
        }
    })

    const {mutate: uploadMutate} = useMutation((data: File) => uploadClient.upload({data, fileName: data.name}), {
        onSuccess: (data) => {
            setCroppedSrc(data.path)
            setValue(name, data.id)
            toast({
                title: "Фотография загружена"
            })
        },
        onError: () => {
            toast({
                title: "Произошла ошибка"
            })
        },
        onMutate: () => console.log("upload")
    })

    const {mutate: removeMutate} = useMutation((id: number) => uploadClient.remove(id), {
        onSuccess: () => {
            setCroppedSrc(undefined)
            toast({
                title: "Фотография удалена"
            })
        }
    })

    const changeImage = () => {
        if(cropperRef?.current && file) {
            // const croppedFile = dataUrlToFile(
            //     cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
            //     file.name
            // )
            // console.log(file.name)
            // setValue("file", croppedFile)
            // uploadMutate(croppedFile)
            // setCroppedSrc(URL.createObjectURL(croppedFile))
            // setCroppedSrc(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
        }
    }


    return <Flex flexDir={"column"} alignItems={"center"}>
        <Input
            accept="image/*"
            type="file"
            display={"none"}
            ref={inputRef}
            onChange={onChangeHandler}
        />
        <Flex
            border={!croppedSrc ? "1px" : undefined}
            borderColor={"gray.500"}
            borderStyle={!croppedSrc ? "dashed" : undefined}
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
        >
            {
                croppedSrc
                    ? <Image
                        src={`${SERVER_URL}/${croppedSrc}`}
                        // src={croppedSrc}
                        w={"100px"}
                        h={"100px"}
                        objectFit={'cover'}
                    />
                    : <LuUpload />
            }
        </Flex>
        {
            croppedSrc && <Text fontSize={"12px"} textColor={"blue.300"} onClick={() => removeMutate(fileId)}>
                Удалить фото
            </Text>
        }
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px) hue-rotate(90deg)'
            />
            <ModalContent>
                <ModalCloseButton zIndex={100}/>
                <ModalBody>
                    {
                        file && <Flex justifyContent={"center"} mt="30px">
                            <Cropper
                                src={URL.createObjectURL(file)}
                                aspectRatio={1}
                                ref={cropperRef}
                                guides={false}
                                zoomable={false}
                                style={{height: 200, width: "100%"}}
                                background={false}
                            />
                        </Flex>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => {
                        changeImage()
                        onClose()
                    }}>Загрузить</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Flex>
}