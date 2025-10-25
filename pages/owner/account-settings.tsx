import Head from 'next/head'
import AccountSettings from '../../components/AccountSettings'

export default function AccountSettingsPage() {
  return (
    <>
      <Head>
        <title>إعدادات الحساب | أملاك تك</title>
        <meta name="description" content="إعدادات الحساب والأمان والخصوصية في منصة أملاك تك" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="ar" />
        <meta name="direction" content="rtl" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div dir="rtl" lang="ar">
        <AccountSettings />
      </div>
    </>
  )
}
