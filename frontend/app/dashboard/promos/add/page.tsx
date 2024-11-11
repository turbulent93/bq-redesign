'use client';

import { useMutation, useQueryClient } from "react-query";
import { Form } from "../Form";
import { PromoDto, ServiceDto } from "@/services/client";
import { promosClient, servicesClient } from "@/services/services";
import { useRouter } from "next/navigation";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: PromoDto) => promosClient.create(item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get promos"})
			router.push("/dashboard/promos")}
	})

	return <Form mutate={mutate} />
}
