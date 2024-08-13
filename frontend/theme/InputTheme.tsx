import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const red = definePartsStyle({
    field: {
        borderColor: "white",
        _focus: {
            borderColor: "white"
        }
    }
})

export const inputTheme = defineMultiStyleConfig({ variants: { red } })