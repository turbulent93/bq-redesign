'use client'

import { inputTheme } from '@/theme/InputTheme';
import { stepperTheme } from '@/theme/StepperTheme';
import { switchTheme } from '@/theme/SwitchTheme';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false
    }
  }
});

const theme = extendTheme({
  components: {
    Switch: switchTheme,
    Input: inputTheme,
    // Stepper: stepperTheme
  }
});

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </ChakraProvider>
  )
}