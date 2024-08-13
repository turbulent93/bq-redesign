'use client'

import { inputTheme } from '@/theme/InputTheme';
import { switchTheme } from '@/theme/SwitchTheme';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

const theme = extendTheme({
  components: {
    Switch: switchTheme,
    Input: inputTheme
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