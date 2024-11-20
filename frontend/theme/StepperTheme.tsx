import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

export const stepperTheme = {
    indicator: {
        '&[data-status=complete]': {
            bgColor: 'red',
            borderColor: 'red',
        },
        '&[data-status=active]': {
            bgColor: 'red',
            borderColor: 'red',
        },
    },
}