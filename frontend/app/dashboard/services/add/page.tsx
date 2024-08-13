'use client';

import { useMutation, useQueryClient } from "react-query";
import { Form } from "../Form";
import { ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { useRouter } from "next/navigation";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: ServiceDto) => servicesClient.create(item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get services"})
			router.push("/dashboard/services")}
	})

	return <Form mutate={mutate} />
}
