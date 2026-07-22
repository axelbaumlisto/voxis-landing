import { RootDocument, buildMetadata } from "../root-layout.shared";
import "../globals.css";

export const metadata = buildMetadata("ru");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="ru">{children}</RootDocument>;
}
