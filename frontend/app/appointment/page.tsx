"use client"

import { Appointer } from "@/components/Appointer/Appointer";
import { AppointmentDto } from "@/services/client";
import { appointmentsClient, promosClient } from "@/services/services";
import { CLIENT_ROLE_NAME } from "@/utils/constants";
import { useAuth } from "@/utils/useAuth";
import { Button, Container, Flex, Link } from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function Page() {
	// const searchParams = useSearchParams()
	// const id = searchParams.get("id")

	const queryClient = useQueryClient()
    const router = useRouter()
    const pathname = usePathname()

    const {mutate} = useMutation((item: AppointmentDto) => {
		return appointmentsClient.create(item)
	}, {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["get appointments"]})
            if(pathname.includes("dashboard")) {
                router.push("/dashboard/appointments")
            } else {
                router.push("/")
            }
        },
        onError: (e) => console.log(e)
	})

	const searchParams = useSearchParams()
	const promoId = searchParams.get("promoId")

    const {user} = useAuth()

    return <Flex
        p={4}
        mb={6}
    >
        <Appointer
            // mutate={(v) => console.log("appointment", v)}
            mutate={mutate}
            // values={{
            //     phone: user?.role == CLIENT_ROLE_NAME ? user?.login : "",
            //     paidWithBonuses: 0,
            //     employeeId: 0,

            // }}
            promoId={Number(promoId)}
        />
    </Flex>
}