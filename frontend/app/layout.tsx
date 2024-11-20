import type { Metadata } from "next";
import { Providers } from "./dashboard/providers";

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
		<html lang="ru">
			<body>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
