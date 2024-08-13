'use client';

import { useMutation, useQueryClient } from "react-query";
import { Form } from "../Form";
import { UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { useRouter } from "next/navigation";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: UserDto) => {
		return usersClient.create(item)
	}, {
		onSuccess: () => {
			queryClient.invalidateQueries(["get users"])
			router.push("/dashboard/users")}
	})

	return <Form mutate={mutate} />
}
