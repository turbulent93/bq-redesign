'use client';

import { ServiceGroupDto } from "@/services/client";
import { serviceGroupClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../Form";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")

	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: ServiceGroupDto) => serviceGroupClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get service-groups"})
			router.push("/dashboard/service-groups")}
	})

	const {data} = useQuery(
        ["view service", id],
        () => serviceGroupClient.view(Number(id))
    )

	return <Form mutate={mutate} values={data} />
}
