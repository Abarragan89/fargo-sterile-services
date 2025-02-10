import { Dancing_Script, Atkinson_Hyperlegible } from 'next/font/google'


export const bodyFont = Atkinson_Hyperlegible({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '700']
})

export const cursiveFont = Dancing_Script({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400']
})