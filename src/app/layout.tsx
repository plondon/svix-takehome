"use client";
import { Box } from "@chakra-ui/react";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" style={{height: '100%'}}>
      <body style={{height: '100%'}}>
        <Providers>
          <Box height={'full'} padding={10} background='white'>
            <Box height={'full'} overflow={'scroll'} rounded={'md'} padding={4} background='gray.100'>{children}</Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
