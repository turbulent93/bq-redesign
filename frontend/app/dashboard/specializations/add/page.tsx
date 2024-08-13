'use client';

import { useMutation, useQueryClient } from "react-query";
import { Form } from "../Form";
import { SpecializationDto } from "@/services/client";
import { specializationsClient } from "@/services/services";
import { useRouter } from "next/navigation";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: SpecializationDto) => specializationsClient.create(item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get specializations"})
			router.push("/dashboard/specializations")}
	})

	return <Form mutate={mutate} />
}
