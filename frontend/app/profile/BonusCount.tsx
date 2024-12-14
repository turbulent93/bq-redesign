import { UserDto } from "@/services/client";
import { countBonuses } from "@/utils/countBonuses";
import { DATE_FORMAT, PROMO_TYPE_BONUS } from "@/utils/constants";
import { Box } from "@chakra-ui/react";
import moment from "moment";
import { useMemo } from "react";

export const BonusCount = ({data: user}: {data?: UserDto}) => {
    const bonusCount = useMemo(() => countBonuses(user), [user])

    return <Box
        px={2}
        py={1}
        borderRadius={"md"}
        // bgGradient='linear(to-br, gray.700, red.500)'
        bgColor={"gray.700"}
        color="white"
        shadow={"lg"}
    >
        {bonusCount} бонусов
    </Box>
}