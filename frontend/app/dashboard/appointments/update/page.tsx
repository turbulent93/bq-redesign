'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../Form";
import { AppointmentDto } from "@/services/client";
import { appointmentsClient } from "@/services/services";
import { Container } from "@chakra-ui/react";
// import { Form } from "../../Form";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: AppointmentDto) => appointmentsClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get employees"})
			router.push("/dashboard/appointments")}
	})

	const {data} = useQuery(
        ["view employee", id],
        () => appointmentsClient.view(Number(id))
    )

	return <Container>
		<Form mutate={mutate} values={data} 	/>
	</Container>
}
