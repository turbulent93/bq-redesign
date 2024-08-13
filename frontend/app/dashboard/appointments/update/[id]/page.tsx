'use client';

import { EmployeeDto } from "@/services/client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
// import { Form } from "../../Form";

export default function Page({params}: {params: {id: number}}) {
	const queryClient = useQueryClient()
    const router = useRouter()

	// const {mutate} = useMutation((item: EmployeeDto) => employeesClient.update(Number(item.id), item), {
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries({queryKey: "get employees"})
	// 		router.push("/dashboard/employees")}
	// })

	// const {data} = useQuery(
    //     ["view employee", params.id],
    //     () => employeesClient.view(Number(params.id)), {
	// 		select: (data) => ({...data, specializationIds: data.specializations!.map(i => Number(i.id))})
	// 	}
    // )

	return "form"//<Form mutate={mutate} values={data} />
}
