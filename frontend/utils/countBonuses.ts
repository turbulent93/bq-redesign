import { UserDto } from "@/services/client";
import { DATE_FORMAT, PROMO_TYPE_BONUS } from "@/utils/constants";
import moment from "moment";

export const countBonuses = (user?: UserDto) => {
    let count = user
        ?.clientAppointments
        ?.filter(i => moment(i.schedule?.date, DATE_FORMAT).isSameOrAfter(moment().month(-3))
            && i.paidWithBonuses == 0)
        .reduce((c, i) => c + i.service?.bonusCount!, 0)!
    + user
        ?.promos
        ?.filter(i => (!i.startDate || moment(i.startDate, DATE_FORMAT).isSameOrBefore(moment()))
            && (!i.endDate || moment(i.endDate, DATE_FORMAT).isSameOrAfter(moment()))
            && i.type == PROMO_TYPE_BONUS)
        .reduce((c, i) => c + (i?.bonusCount || 0), 0)!
    - user
        ?.clientAppointments
        ?.filter(i => i.paidWithBonuses && i.paidWithBonuses > 0)
        .reduce((c, i) => c + i.paidWithBonuses!, 0)!

    if(!!user?.invitePromoId) {
        count += user.invitedUsers?.length! * user.invitePromo?.bonusCount!   
    }

    return count
}