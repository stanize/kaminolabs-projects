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
      <body>{children}</body>
    </html>
  );
}
