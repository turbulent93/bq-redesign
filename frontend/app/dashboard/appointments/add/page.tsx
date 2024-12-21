'use client';

import { useMutation, useQueryClient } from "react-query";
import { AppointmentDto } from "@/services/client";
import { appointmentsClient } from "@/services/services";
import { useRouter, useSearchParams } from "next/navigation";
import { Appointer } from "@/components/Appointer/Appointer";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { Form } from "../Form";

export default function Page() {
	const queryClient = useQueryClient()
    const router = useRouter()
	const searchParams = useSearchParams()
    const phone = searchParams.get("phone")
	const [tab, setTab] = useState<number>()

	const {mutate} = useMutation((item: AppointmentDto) => {
		return appointmentsClient.create(item)
	}, {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["get appointments"]})
			router.push("/dashboard/appointments")}
	})

	return  <Tabs tabIndex={tab} onChange={setTab} px={4}>
		<TabList>
			<Tab>Форма</Tab>
			<Tab>Степпер</Tab>
		</TabList>
		<TabPanels>
			<TabPanel px={0}>
				<Form mutate={mutate}/>
			</TabPanel>
			<TabPanel px={0}>
				<Appointer mutate={mutate} phone={phone != null ? phone : undefined} />
			</TabPanel>
		</TabPanels>
	</Tabs>

	// return <Appointer mutate={mutate} phone={phone != null ? phone : undefined} />
}
