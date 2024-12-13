'use client';

import { UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ClientForm } from "../ClientForm";
import { CLIENT_ROLE_NAME } from "@/utils/constants";
import { Form } from "../Form";
import { MasterForm } from "../MasterForm";

export default function Page() {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")

	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: UserDto) => usersClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get users"})
			router.push("/dashboard/users")}
	})

	const {data} = useQuery(
        ["view user", id],
        () => usersClient.view(Number(id)), {
			select: (data) => ({
				...data,
				specializationIds: data?.specializations?.map(i => Number(i.id)) || []
			})
		}
    )

	if(data?.role == CLIENT_ROLE_NAME) {
		return <ClientForm mutate={mutate} values={data} />
	}

	return <MasterForm mutate={mutate} values={data ? {...data,
		specializationIds: data?.specializations?.map(i => Number(i.id)) || []
	} : undefined} />
}
