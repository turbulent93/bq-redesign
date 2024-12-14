"use client"

import { Appointer } from "@/components/Appointer/Appointer";
import { AppointmentDto } from "@/services/client";
import { appointmentsClient, promosClient } from "@/services/services";
import { CLIENT_ROLE_NAME } from "@/utils/constants";
import { useAuth } from "@/utils/useAuth";
import { Button, Container, Flex, Link } from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Content = () => {
	const searchParams = useSearchParams()
	const promoId = searchParams.get("promoId")
    const phone = searchParams.get("phone")
    const inviterId = searchParams.get("inviterId")

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

    return <Flex
        p={4}
        mb={6}
    >
        <Appointer
            mutate={mutate}
            promoId={promoId ? Number(promoId) : undefined}
            phone={phone != null ? phone : undefined}
            inviterId={inviterId ? Number(inviterId) : undefined}
        />
    </Flex>
}

export default function Page() {
    return <Suspense>
        <Content />
    </Suspense>
}