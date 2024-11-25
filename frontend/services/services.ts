import { AppointmentsClient, GalleryClient, PromosClient, PunchMapsClient, SchedulesClient, ServiceGroupClient, ServicesClient, SpecialiaztionsClient, StatisticClient, TokensClient, UploadClient, UsersClient } from "../services/client";
import { instance } from "@/api/api.interceptor";

export const servicesClient = new ServicesClient(undefined, instance)

export const specializationsClient = new SpecialiaztionsClient(undefined, instance)

export const usersClient = new UsersClient(undefined, instance)

export const schedulesClient = new SchedulesClient(undefined, instance)

export const appointmentsClient = new AppointmentsClient(undefined, instance)

export const statisticClient = new StatisticClient(undefined, instance)

export const uploadClient = new UploadClient(undefined, instance)

export const tokensClient = new TokensClient(undefined, instance)

export const promosClient = new PromosClient(undefined, instance)

export const serviceGroupClient = new ServiceGroupClient(undefined, instance)

export const galleryClient = new GalleryClient(undefined, instance)

export const punchMapsClient = new PunchMapsClient(undefined, instance)