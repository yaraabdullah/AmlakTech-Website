import dynamic from 'next/dynamic'
import Head from 'next/head'
import type { NextPage } from 'next'

const PropertyVisitBooking = dynamic(() => import('../../../components/PropertyVisitBooking'), { ssr: false })

const PropertyVisitBookingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>حجز زيارة للعقار</title>
      </Head>
      <PropertyVisitBooking />
    </>
  )
}

export default PropertyVisitBookingPage

