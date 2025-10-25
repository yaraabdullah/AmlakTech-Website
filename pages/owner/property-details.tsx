import Head from 'next/head'
import PropertyDetails from '../../components/PropertyDetails'

export default function PropertyDetailsPage() {
  return (
    <>
      <Head>
        <title>تفاصيل العقارات | أملاك تك</title>
        <meta name="description" content="إدارة تفصيلية للعقارات الفردية في منصة أملاك تك" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="ar" />
        <meta name="direction" content="rtl" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div dir="rtl" lang="ar">
        <PropertyDetails />
      </div>
    </>
  )
}
