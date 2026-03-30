import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "93Moove | Association Sportive & Culturelle",
    description: "Association d'activités sportives, manuelles et culturelles pour tous.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth">
            <body className={`${geistSans.variable} ${geistMono.variable} font-sans flex flex-col min-h-screen selection:bg-purple-300 selection:text-purple-900`}>
                <Navbar />
                
                {/* 
                  Main container takes remaining vertical space 
                  Pt-20 handles the fixed navbar offset 
                */}
                <main className="flex-grow pt-20">
                    {children}
                </main>
                
                <Footer />
            </body>
        </html>
    );
}