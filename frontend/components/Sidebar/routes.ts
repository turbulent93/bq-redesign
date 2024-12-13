import { IconType } from "react-icons";
import { 
    AiOutlineBook, 
    AiOutlineSchedule,
    AiOutlineUser 
} from "react-icons/ai";
import { BsScissors } from "react-icons/bs";
import { FaCogs } from "react-icons/fa";
import { IoMdHome, IoMdPhotos } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlinePercent } from "react-icons/md";
import { PiPathBold } from "react-icons/pi";

export type RouteType = {
    title: string,
    href: string,
    Icon: IconType,
    protected?: boolean
}

export const routes: RouteType[] = [
    // {
    //     title: "Главная",
    //     href: "/dashboard/home",
    //     Icon: IoMdHome
    // },
    {
        title: "Пользователи",
        href: "/dashboard/users",
        Icon: AiOutlineUser,
        protected: true
    },
    // {
    //     title: "Мастера",
    //     href: "/dashboard/employees",
    //     Icon: AiOutlineUser
    // },
    // {
    //     title: "Расписание",
    //     href: "/dashboard/schedules",
    //     Icon: AiOutlineSchedule
    // },
    {
        title: "Услуги",
        href: "/dashboard/services",
        Icon: FaCogs
    },
    // {
    //     title: "Специализации",
    //     href: "/dashboard/specializations",
    //     Icon: BsScissors
    // },
    {
        title: "Записи",
        href: "/dashboard/appointments",
        Icon: AiOutlineBook
    },
    {
        title: "Промо",
        href: "/dashboard/promos",
        Icon: MdOutlinePercent
    },
    {
        title: "Галерея",
        href: "/dashboard/gallery",
        Icon: IoMdPhotos
    },
]

export const serviceRoutes: RouteType[] = [
    {
        title: "Услуги",
        href: "/dashboard/services",
        Icon: AiOutlineBook
    },
    {
        title: "Группы",
        href: "/dashboard/service-groups",
        Icon: AiOutlineBook
    },
    {
        title: "Специализации",
        href: "/dashboard/specializations",
        Icon: BsScissors
    },
]

export const promoRoutes: RouteType[] = [
    {
        title: "Промо",
        href: "/dashboard/promos",
        Icon: MdOutlinePercent
    },
    {
        title: "Панч-карты",
        href: "/dashboard/punch-maps",
        Icon: PiPathBold
    },
]

export const appointmentRoutes: RouteType[] = [
    {
        title: "Записи",
        href: "/dashboard/appointments",
        Icon: AiOutlineBook
    },
    {
        title: "Расписание",
        href: "/dashboard/schedules",
        Icon: AiOutlineSchedule
    },
]

export const userRoutes: RouteType[] = [
    {
        title: "Пользователи",
        href: "/dashboard/users",
        Icon: AiOutlineUser,
        protected: true
    },
    {
        title: "Мастера",
        href: "/dashboard/employees",
        Icon: AiOutlineUser
    },
]