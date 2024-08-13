'use client';

import { UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form } from "../../Form";

export default function Page({params}: {params: {id: number}}) {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: UserDto) => usersClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get users"})
			router.push("/dashboard/users")}
	})

	const {data} = useQuery(
        ["view user", params.id],
        () => usersClient.view(Number(params.id)), {
			select: (data) => ({
				...data,
				employee: data.employee
					? {
						...data.employee,
						specializationIds: data?.employee?.specializations?.map(i => Number(i.id)) || []
					}
					: undefined
			}),
			onSuccess: (data) => console.log(data)
		}
    )

	return <Form mutate={mutate} values={data} />
}
