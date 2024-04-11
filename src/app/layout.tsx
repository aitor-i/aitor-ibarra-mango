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
      <body>{children}</body>
    </html>
  )
}
