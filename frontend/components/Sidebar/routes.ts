import { IconType } from "react-icons";
import { 
    AiOutlineBook, 
    AiOutlineSchedule,
    AiOutlineUser 
} from "react-icons/ai";
import { BsScissors } from "react-icons/bs";
import { FaCogs } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";

export type RouteType = {
    title: string,
    href: string,
    Icon: IconType,
    protected?: boolean
}

export const routes: RouteType[] = [
    {
        title: "Главная",
        href: "/dashboard/home",
        Icon: IoMdHome
    },
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
    {
        title: "Расписание",
        href: "/dashboard/schedules",
        Icon: AiOutlineSchedule
    },
    {
        title: "Услуги",
        href: "/dashboard/services",
        Icon: FaCogs
    },
    {
        title: "Специализации",
        href: "/dashboard/specializations",
        Icon: BsScissors
    },
    {
        title: "Записи",
        href: "/dashboard/appointments",
        Icon: AiOutlineBook
    },
]