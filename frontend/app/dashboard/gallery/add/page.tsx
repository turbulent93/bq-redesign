'use client';

import { useMutation, useQueryClient } from "react-query";
import { CreateOrUpdateGalleryRequest, GalleryDto, ServiceDto } from "@/services/client";
import { galleryClient, servicesClient } from "@/services/services";
import { useRouter } from "next/navigation";
import { Form } from "../Form";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((request: CreateOrUpdateGalleryRequest) => galleryClient.create(request), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get gallery"})
			router.push("/dashboard/gallery")}
	})

	return <Form mutate={mutate} />
}
