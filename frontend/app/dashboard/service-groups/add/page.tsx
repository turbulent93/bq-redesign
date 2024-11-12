'use client';

import { useMutation, useQueryClient } from "react-query";
import { ServiceGroupDto } from "@/services/client";
import { serviceGroupClient } from "@/services/services";
import { useRouter } from "next/navigation";
import { Form } from "../Form";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: ServiceGroupDto) => serviceGroupClient.create(item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get service-groups"})
			router.push("/dashboard/service-groups")}
	})

	return <Form mutate={mutate} />
}
