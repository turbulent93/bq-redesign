'use client'

import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spinner, Table, TableContainer, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
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
    scroll?: boolean
}

const TableContent = ({
    columns,
    data,
    updatePath,
    removeMutate,
    actions,
    actionsDisabled
}: CustomTableProps) => {
    return <Table mx={0} mb={4}>
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
                            <Td key={index} p={0}>
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
                                            {
                                                (col.updateDisabled?.(row) || actionsDisabled?.(row))
                                                    ? <BsPencilFill/>
                                                    : <Link href={`${updatePath}?id=${row.id}`}>
                                                        <BsPencilFill/>
                                                    </Link>
                                            }
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
}

export const CustomTable = (props: CustomTableProps) => {
    if(props.isLoading)
        return  <Flex w="100%" justifyContent={"center"} alignItems="center">
            <Spinner />
        </Flex>

    return <>
        {
            props.scroll
                ? <TableContainer>
                    <TableContent {...props} />
                </TableContainer>
                : <TableContent {...props} />
        }
        {
            props.data && <Pagination
                currentPage={props?.page}
                onPageChange={props?.setPage}
                perPage={10}
                total={props.data?.totalCount}
            />
        }
    </>
}