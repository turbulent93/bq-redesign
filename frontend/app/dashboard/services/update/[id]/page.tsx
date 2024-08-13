'use client';

import { ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../../Form";

export default function Page({params}: {params: {id: number}}) {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: ServiceDto) => servicesClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get services"})
			router.push("/dashboard/services")}
	})

	const {data} = useQuery(
        ["view service", params.id],
        () => servicesClient.view(Number(params.id))
    )

	return <Form mutate={mutate} values={data} />
}
