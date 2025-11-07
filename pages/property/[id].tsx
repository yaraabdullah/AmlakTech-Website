import dynamic from 'next/dynamic'

const PropertyDetailsPublic = dynamic(() => import('../../components/PropertyDetailsPublic'), {
  ssr: false,
})

export default function PropertyDetailsPage() {
  return <PropertyDetailsPublic />
}

