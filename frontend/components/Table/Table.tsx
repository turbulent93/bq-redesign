'use client'

import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPencilFill } from "react-icons/bs";
import Link from "next/link";
import Pagination from "./Pagination";
import { IconType } from "react-icons";

export type ColumnType  ={
    title: string,
    name: string,
    convertContent?: (value: any) => any
    removeDisabled?: (value: any) => boolean
    updateDisabled?: (value: any) => boolean
}

type Action = {
    mutate: (value: any) => void
    text: string
    color?: string
}

type CustomTableProps = {
    columns: ColumnType[],
    data?: {
        totalPages: number
        totalCount: number
        list: any[]
    }
    updatePath?: string
    removeMutate?: (id: number) => void
    page: number
    setPage: (value: number) => void
    actions?: Action[]
    isLoading?: boolean
    actionsDisabled?: (value: any) => boolean
}

export const CustomTable = ({
    columns,
    data,
    updatePath,
    removeMutate,
    page,
    setPage,
    actions,
    isLoading,
    actionsDisabled
}: CustomTableProps) => {
    if(isLoading)
        return  <Flex w="100%" justifyContent={"center"} alignItems="center">
            <Spinner />
        </Flex>

    return <><TableContainer mb={4}>
        <Table mx={0}>
            <Thead>
                <Tr>
                    {columns.map((i, index) => (
                        <Th key={index}>
                            {i.title}
                        </Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {(data?.list ?? []).map((row) => (
                    <Tr key={row.id}>
                        {
                            columns.map((col, index) => col.name == "_actions" ?
                                <Td key={index} w={"100px"}>
                                    <Flex justifyContent={"center"}>
                                        {
                                            updatePath && <Button
                                                color={"gray.400"}
                                                mr={2} size={"xs"}
                                                isDisabled={col.updateDisabled?.(row) || actionsDisabled?.(row)}
                                                _disabled={{
                                                    opacity: "0.5"
                                                }}
                                            >
                                                <Link href={`${updatePath}?id=${row.id}`}>
                                                    <BsPencilFill/>
                                                </Link>
                                            </Button>
                                        }
                                        {
                                            removeMutate && <Popover closeOnBlur={true}>
                                                <PopoverTrigger>
                                                    <Button
                                                        color={"red.400"} 
                                                        size={"xs"}
                                                        isDisabled={col.removeDisabled?.(row) || actionsDisabled?.(row)}
                                                        _disabled={{
                                                            opacity: "0.5"
                                                        }}
                                                    >
                                                        <RiDeleteBin6Line/>
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
                                                            onClick={() => removeMutate(row.id)}
                                                        >
                                                            Да
                                                        </Button>
                                                        <Button>
                                                            Отмена
                                                        </Button>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Popover>
                                        }
                                        {
                                            actions?.map(({text, color, mutate}, i) => <Button
                                                color={color} 
                                                onClick={() => mutate(row)}
                                                size={"xs"}
                                                key={i}
                                            >
                                                {text}
                                            </Button>)
                                        }
                                    </Flex>
                                </Td> : 
                                <Td key={index}>
                                    {col.convertContent ? col.convertContent(row[col.name]) : row[col.name]}
                                </Td>)
                        }
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </TableContainer>
        {
            data && <Pagination
                currentPage={page}
                onPageChange={setPage}
                perPage={10}
                total={data?.totalCount}
            />
        }
    </>
}