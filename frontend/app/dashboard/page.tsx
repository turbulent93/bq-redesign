"use client"

import { statisticClient } from "@/services/services";
import { Box, Container, Flex, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useAuth } from "@/utils/useAuth";

import dynamic from 'next/dynamic'
import { StatisticBox } from "./StatisticBox";
import { weekdays } from "moment";
import { MASTER_ROLE_NAME, weekDays } from "@/utils/constants";
import { EmployeeFilter } from "@/components/EmployeeFilter";
import { useState } from "react";
    
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const red400 = "#f87171"
const blue400 = "#60a5fa"
const teal400 = "#2dd4bf"
const orange400 = "#fb923c"

const colors = [red400, blue400, teal400, orange400]
const gray600 = "#4A5568"

export default function Page() {
    const {user, isAdmin} = useAuth()
    const [userId, setUserId] = useState<number | undefined>()

    const {data, isLoading} = useQuery(
        ["get statistic"],
        () => statisticClient.get({employeeId: user?.role == MASTER_ROLE_NAME ? user?.id! : userId!})
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
        return ((data.services.values[index] * 100) / data.services.values.reduce((total, x) => x + total, 0)).toFixed(1)
    }

    return <Container>
        {
            isAdmin && <EmployeeFilter
                userId={userId}
                setUserId={setUserId}
            />
        }
        <Flex gap={3}>
            <StatisticBox title="Выручка">
                <Text fontSize={18}>
                    {data.revenueCount}Р
                </Text>
            </StatisticBox>
            <StatisticBox title="Новые клиенты">
                <Text fontSize={18}>
                    {data.newUsersCount}
                </Text>
            </StatisticBox>
        </Flex>
        <StatisticBox title="Услуги">
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
                            return Number(value) < 15 ? "" : `${Number(value).toFixed(1)}%`
                        },
                    },
                }}
                series={data.services.values}//{[30, 7, 2]}
                type="pie"
            />
        </StatisticBox>
        <StatisticBox title="Выручка">
            <Chart
                options={{
                    chart: {
                        id: "revenue-chart",
                        toolbar: {
                            show: false
                        },
                    },
                    colors: [red400],
                    stroke: {
                        curve: 'smooth',
                    },
                    labels: data.revenue.labels
                }}
                series={[{
                    name: "Выручка",
                    data: data.revenue.values,
                }]}
                type="line"
                // width={40 * data.appointments.labels.length}
                height={200}
            />
        </StatisticBox>
        <StatisticBox title="Записи">
            <Chart
                options={{
                    chart: {
                        id: "appointments-chart",
                        toolbar: {
                            show: false
                        },
                    },
                    yaxis: [
                        {
                          labels: {
                            formatter: function(val) {
                              return val.toFixed(0);
                            }
                          }
                        }
                    ],
                    xaxis: {
                        categories: data.appointments.labels
                    },
                    colors: [blue400],
                    stroke: {
                        width: 0,
                        show: false
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: 40
                        }
                    },
                    dataLabels: {
                        formatter: (value) => {
                            return Number(value) < 4 ? "" : String(value)
                        },
                    }
                }}
                series={[{
                    name: "Записи",
                    data: data.appointments.values,
                }]}
                type="bar"
                // width={40 * data.appointments.labels.length}
                height={200}
            />
        </StatisticBox>
        <StatisticBox title="Записи по дням недели">
            <Chart
                options={{
                    chart: {
                        id: "weekdays-chart",
                        toolbar: {
                            show: false
                        },
                    },
                    yaxis: [
                        {
                          labels: {
                            formatter: function(val) {
                              return val.toFixed(0);
                            }
                          }
                        }
                    ],
                    xaxis: {
                        categories: data.weekdays.labels,
                        labels: {
                            formatter: function(value) {
                                return weekDays[Number(value)]
                            },
                            style: {
                                fontWeight: "bold",
                                // fontSize: "18px",
                                cssClass: "uppercase"
                            }
                        }
                    },
                    colors: [teal400],
                    stroke: {
                        width: 0,
                        show: false
                    },
                    dataLabels: {
                        formatter: (value) => {
                            return Number(value) < 1 ? "" : String(value)
                        },
                    }
                }}
                series={[{
                    name: "Записи по дням недели",
                    data: data.weekdays.values,
                }]}
                type="bar"
                // width={40 * data.weekdays.labels.length}
                height={200}
            />
        </StatisticBox>
    </Container>
}