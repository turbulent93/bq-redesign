import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Content } from "./Content";

export const metadata: Metadata = {
  title: "Королева красоты",
  description: "Описание",
  icons: {
    icon: "/bq.jpeg"
  }
};

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
    const vh = window.innerHeight * 0.01

	return (
		<html lang="en">
			<body className="overflow-y-hidden" style={{height: `calc(${vh}px * 100)`}}>
				<Providers>
					<Content>
						{children}
					</Content>
				</Providers>
			</body>
		</html>
	);
}
