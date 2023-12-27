// Important! If you change things here you'll want to be sure Storybook preview is up to date as well.

import {
  Inter as FontSans,
  Cormorant_Infant as FontSerif,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = FontSerif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-sans",
});
