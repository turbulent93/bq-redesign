'use client';

import { SpecializationDto } from "@/services/client";
import { specializationsClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../Form";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")
	
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: SpecializationDto) => specializationsClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get specializations"})
			router.push("/dashboard/specializations")}
	})

	const {data} = useQuery(
        ["view specialization", id],
        () => specializationsClient.view(Number(id))
    )

	return <Form mutate={mutate} values={data} />
}
