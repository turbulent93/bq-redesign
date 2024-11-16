'use client';

import { PromoDto, PunchMapDto } from "@/services/client";
import { promosClient, punchMapsClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Form from "../Form";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")

	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: PunchMapDto) => punchMapsClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get punch-maps"})
			router.push("/dashboard/punch-maps")}
	})

	const {data} = useQuery(
        ["view punch-map", id],
        () => punchMapsClient.view(Number(id))
    )

	return <Form mutate={mutate} values={data} />
}
