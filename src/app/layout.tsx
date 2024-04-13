import Header from '@/components/Header/Header'
import './global.css'

export const metadata = {
  title: 'Mango - Aitor Ibarra',
  description: 'This is a techincal test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
