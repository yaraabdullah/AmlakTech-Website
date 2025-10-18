import Head from 'next/head'
import NotificationBar from '../components/NotificationBar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import StatsSection from '../components/StatsSection'
import FeaturesSection from '../components/FeaturesSection'
import AISection from '../components/AISection'
import TestimonialsSection from '../components/TestimonialsSection'
import PricingSection from '../components/PricingSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>أملاك تك - AmlakTech</title>
        <meta name="description" content="منصة ذكية لإدارة العقارات والخدمات العقارية باستخدام الذكاء الاصطناعي" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="ar" />
        <meta name="direction" content="rtl" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div dir="rtl" lang="ar">
        <NotificationBar />
        <Header />
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <AISection />
        <TestimonialsSection />
        <PricingSection />
        <Footer />
      </div>
    </>
  )
}
