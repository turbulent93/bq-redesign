import { UserDto } from "@/services/client";
import { DATE_FORMAT, PROMO_TYPE_BONUS } from "@/utils/constants";
import { Box } from "@chakra-ui/react";
import moment from "moment";

export const BonusCount = ({data}: {data?: UserDto}) => {
    return <Box
        px={2}
        py={1}
        borderRadius={"md"}
        // bgGradient='linear(to-br, gray.700, red.500)'
        bgColor={"gray.700"}
        color="white"
        shadow={"lg"}
    >
        {
            data
                ?.clientAppointments
                ?.filter(i => moment(i.schedule?.date, DATE_FORMAT).isSameOrAfter(moment().month(-3))
                    && i.paidWithBonuses == 0)
                .reduce((c, i) => c + i.service?.bonusCount!, 0)!
            + data
                ?.promos
                ?.filter(i => (!i.startDate || moment(i.startDate, DATE_FORMAT).isSameOrBefore(moment()))
                    && (!i.endDate || moment(i.endDate, DATE_FORMAT).isSameOrAfter(moment()))
                    && i.type == PROMO_TYPE_BONUS)
                .reduce((c, i) => c + (i?.bonusCount || 0), 0)!
            - data
                ?.clientAppointments
                ?.filter(i => i.paidWithBonuses && i.paidWithBonuses > 0)
                .reduce((c, i) => c + i.paidWithBonuses!, 0)!
        } бонусов
    </Box>
}