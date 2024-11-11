import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./dashboard/providers";
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
	return (
		<html lang="en">
			<body className="overflow-y-hidden">
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
