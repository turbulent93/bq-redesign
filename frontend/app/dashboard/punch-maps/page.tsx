'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { PunchMapDto, PunchMapPromoDto, ServiceDto } from "@/services/client";
import { punchMapsClient, servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Box, Button, Container } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DashboardNavigation } from "../../../components/DashboardNavigation";
import { promoRoutes, serviceRoutes } from "@/components/Sidebar/routes";
import { MdQuestionMark } from "react-icons/md";
import { PromoTemplate } from "../promos/PromoTemplate";
import { PromoCard } from "@/components/cards/PromoCard";
import { IoCheckmark } from "react-icons/io5";
import { SlPresent } from "react-icons/sl";
import { CiCirclePlus } from "react-icons/ci";

const columns: ColumnType[] = [
    {
        title: "Описание",
        name: nameof<PunchMapDto>("punchMapPromos"),
        convertContent: (value) => value.map((i: PunchMapPromoDto) => ` ${i.step} - ${i.promo.description}`).join("\n")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

export default function Page() {
    const [page, setPage] = useState<number>(1)
    const {data, isLoading} = useQuery(
        ["get punch-maps"],
        () => punchMapsClient.get({page: undefined, size: undefined})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => punchMapsClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get punch-maps"])
        }
    })

    return (
        <Container maxW="800px">
            <DashboardNavigation routes={promoRoutes} />
            <Button mb={4} leftIcon={<CiCirclePlus size={24}/>}>
                <Link href={"punch-maps/add"}>
                    Добавить
                </Link>
            </Button>
            <CustomTable
                columns={columns}
                data={data}
                updatePath="punch-maps/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
                // actionsDisabled={actionsDisabled}
            />
        </Container>
    );
}
