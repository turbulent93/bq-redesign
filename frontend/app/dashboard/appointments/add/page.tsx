'use client';

import { useMutation, useQueryClient } from "react-query";
import { AppointmentDto } from "@/services/client";
import { appointmentsClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { Appointer } from "@/components/Appointer/Appointer";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()
	const searchParams = useSearchParams()
    const phone = searchParams.get("phone")

	const {mutate} = useMutation((item: AppointmentDto) => {
		return appointmentsClient.create(item)
	}, {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["get appointments"]})
			router.push("/dashboard/appointments")}
	})

	return <Appointer mutate={mutate} phone={phone != null ? phone : undefined} />
}
