"use client"

import { Box, Button, Container, Flex, Link, Text, useDisclosure } from "@chakra-ui/react";
import { AppointmentCard } from "./AppointmentCard";
import { PunchMapCard } from "@/components/cards/PunchMapCard";
import { useQuery } from "react-query";
import { usersClient } from "@/services/services";
import moment from "moment";
import { BsArrowLeft } from "react-icons/bs";
import { TbArrowBarToLeft } from "react-icons/tb";
import { Content } from "../Content";
import { useAuth } from "@/utils/useAuth";
import { useEffect, useMemo } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { DATE_FORMAT, TIME_FORMAT } from "@/utils/constants";
import { ClientAppointments } from "./ClientAppointments";

export default function Page() {
    const {user: data} = useAuth()

    return <Content type={"register"}>
        <ProfileHeader />
        <Container>
            {
                data?.punchMapId && <PunchMapCard
                    {
                        ...data?.punchMap!
                    }
                    items={data?.punchMap?.punchMapPromos}
                    showProgress
                />
            }
            <ClientAppointments data={data}/>
        </Container>
    </Content>
}