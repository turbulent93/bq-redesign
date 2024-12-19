import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys)

const red = definePartsStyle({
    track: {
        _checked: {
            bg: "red.300"
        }
    }
})

const gray = definePartsStyle({
    track: {
        _checked: {
            bg: "gray.700",
        },
        borderColor: "inherit"
    },
    thumb: {
        _checked: {
            bg: "white"
        }
    },
    container: {
        _focus: {
            outline: "none"
        },
        outline: "none"
    }
})

export const switchTheme = defineMultiStyleConfig({ variants: { red, gray } })