'use client';

import { useMutation, useQueryClient } from "react-query";
import { PromoDto, PunchMapDto, ServiceDto } from "@/services/client";
import { promosClient, punchMapsClient, servicesClient } from "@/services/services";
import { useRouter } from "next/navigation";
import Form from "../Form";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: PunchMapDto) => punchMapsClient.create(item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get punch-maps"})
			router.push("/dashboard/punch-maps")}
	})

	return <Form mutate={mutate} />
}
