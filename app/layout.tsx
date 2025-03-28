import type { Metadata } from "next";
import ClientLayout from "./client-layout";
import GeminiCuisineChatbot from "@components/main/gemini-cuisine-chatbot"; // Import the chatbot component

export const metadata: Metadata = {
  title: "ReFresh",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout>
      {children}
      <GeminiCuisineChatbot /> {/* Add the chatbot to the layout */}
    </ClientLayout>
  );
}