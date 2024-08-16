'use client';

import { ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../Form";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")

	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: ServiceDto) => servicesClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get services"})
			router.push("/dashboard/services")}
	})

	const {data} = useQuery(
        ["view service", id],
        () => servicesClient.view(Number(id))
    )

	return <Form mutate={mutate} values={data} />
}
