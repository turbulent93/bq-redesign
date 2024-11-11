'use client';

import { PromoDto } from "@/services/client";
import { promosClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../Form";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")

	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: PromoDto) => promosClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get promos"})
			router.push("/dashboard/promos")}
	})

	const {data} = useQuery(
        ["view promo", id],
        () => promosClient.view(Number(id))
    )

	return <Form mutate={mutate} values={data} />
}
