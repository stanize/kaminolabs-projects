import './globals.css';

export const metadata = {
  title: 'Project tracker',
  description: 'Daily rotation tracker for personal projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/@tabler/icons-webfont/latest/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
