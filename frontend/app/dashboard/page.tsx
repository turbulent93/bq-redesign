"use client"

import { statisticClient } from "@/services/services";
import { Box, Container, Flex, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useAuth } from "@/utils/useAuth";

import dynamic from 'next/dynamic'
    
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const colors = ["#ff6f00", "#17A398", "#e0c097", "#002d5b"]
const gray600 = "#4A5568"

export default function Page() {
    const {user} = useAuth()

    const {data, isLoading} = useQuery(
        ["get statistic"],
        () => statisticClient.get({employeeId: user?.id})
    )

    if(isLoading)
        return  <Flex w="100%" justifyContent={"center"} alignItems="center" mt={4}>
            <Spinner />
        </Flex>

    if(!data || data.revenueCount == 0) {
        return <Flex w="100%" justifyContent={"center"} alignItems="center" mt={4}>
            Нет данных
        </Flex>
    }

    const getPercent = (index: number) => {
        return (data.services.values[index] * 100) / data.services.values.reduce((total, x) => x + total, 0)
    }

    return <Container>
        <Box
            bgColor={"gray.100"}
            borderRadius={5}
            py={2}
            px={3}
            mb={4}
        >
            Текущий заработок:
            <Text fontSize={18} fontWeight={"bold"}>
                {data.revenueCount} р.
            </Text>
        </Box>
        <Box
            bgColor={"gray.100"}
            borderRadius={5}
            py={1}
            px={1}
            mb={4}
        >
            <Text
                fontSize={12}
                color={"gray.600"}
                m={2}
                fontWeight={"bold"}
            >
                Услуги
            </Text>
            <Chart
                options={{
                    chart: {
                        id: "services-chart",
                        toolbar: {
                            show: false
                        },
                        
                    },
                    labels: data.services.labels, //["Мужская стрижка", "Окрашивание", "Укладка"],
                    colors: colors,
                    stroke: {
                        show: false,
                        width: 0
                    },
                    legend: {
                        formatter: function(value, { seriesIndex }) {
                            return value + ", " + getPercent(seriesIndex) + "%"
                        },
                        position: "bottom"
                    },
                    dataLabels: {
                        // enabled: false,
                        background: {
                            foreColor: gray600,
                            // borderColor: colors[2],

                            enabled: true,
                            dropShadow: {
                                enabled: false
                            },
                        },
                        dropShadow: {
                            enabled: false
                        },
                        style: {
                            // colors: [gray600],
                        },
                        formatter: (value) => {
                            return Number(value) < 15 ? "" : `${value}%`
                        },
                    },
                }}
                series={data.services.values}//{[30, 7, 2]}
                type="pie"
            />
        </Box>
        <Box
            overflowX="auto"
            overflowY={"hidden"}
            bgColor={"gray.100"}
            borderRadius={5}
            py={1}
            px={1}
            mb={4}
        >
            <Text
                fontSize={12}
                color={"gray.600"}
                m={2}
                fontWeight={"bold"}
            >
                Выручка
            </Text>
            <Chart
                options={{
                    chart: {
                        id: "revenue-chart",
                        toolbar: {
                            show: false
                        },
                    },
                    xaxis: {
                        categories: data.revenue.labels
                    },
                    colors: [colors[1]],
                    stroke: {
                        width: 2
                    }
                }}
                series={[{
                    name: "Выручка",
                    data: data.revenue.values,
                }]}
                width={40 & data.revenue.labels.length}
                height={160}
            />
        </Box>
        <Box
            overflowX="auto"
            overflowY={"hidden"}
            bgColor={"gray.100"}
            borderRadius={5}
            py={1}
            px={1}
        >
            <Text
                fontSize={12}
                color={"gray.600"}
                m={2}
                fontWeight={"bold"}
            >
                Записи
            </Text>
            <Chart
                options={{
                    chart: {
                        id: "appointments-chart",
                        toolbar: {
                            show: false
                        },
                    },
                    xaxis: {
                        categories: data.applications.labels
                    },
                    colors: [colors[0]],
                    stroke: {
                        width: 0,
                        show: false
                    },
                    dataLabels: {
                        formatter: (value) => {
                            return Number(value) < 4 ? "" : String(value)
                        },
                    },
                }}
                series={[{
                    name: "Записи",
                    data: data.applications.values,
                }]}
                type="bar"
                width={40 * data.applications.labels.length}
                height={160}
            />
        </Box>
    </Container>
}