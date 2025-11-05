import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/PropertySearch.module.css'

interface Property {
  id: string
  name: string
  type: string
  address: string
  city: string
  area: number | null
  rooms: string | null
  bathrooms: string | null
  monthlyRent: number | null
  status: string
  description: string | null
  images: string | null
  features: string | null
  propertySubType: string | null
  createdAt: string
}

export default function PropertySearch() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  
  // Search filters
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    rooms: '',
    priceFrom: '',
    priceTo: '',
    areaFrom: '',
    areaTo: '',
    furnished: 'all'
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters, sortBy])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      // Fetch all properties that are available for rent (public display)
      const response = await fetch('/api/properties?publicDisplay=true')
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
        setFilteredProperties(data)
      } else {
        console.error('Failed to fetch properties')
        setProperties([])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city?.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(p => 
        p.type === filters.propertyType || p.propertySubType === filters.propertyType
      )
    }

    // Filter by rooms
    if (filters.rooms) {
      filtered = filtered.filter(p => 
        p.rooms === filters.rooms
      )
    }

    // Filter by price range
    if (filters.priceFrom) {
      const priceFrom = parseFloat(filters.priceFrom)
      filtered = filtered.filter(p => 
        p.monthlyRent && p.monthlyRent >= priceFrom
      )
    }
    if (filters.priceTo) {
      const priceTo = parseFloat(filters.priceTo)
      filtered = filtered.filter(p => 
        p.monthlyRent && p.monthlyRent <= priceTo
      )
    }

    // Filter by area range
    if (filters.areaFrom) {
      const areaFrom = parseFloat(filters.areaFrom)
      filtered = filtered.filter(p => 
        p.area && p.area >= areaFrom
      )
    }
    if (filters.areaTo) {
      const areaTo = parseFloat(filters.areaTo)
      filtered = filtered.filter(p => 
        p.area && p.area <= areaTo
      )
    }

    // Sort properties
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'price-low') {
        return (a.monthlyRent || 0) - (b.monthlyRent || 0)
      } else if (sortBy === 'price-high') {
        return (b.monthlyRent || 0) - (a.monthlyRent || 0)
      }
      return 0
    })

    setFilteredProperties(filtered)
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      rooms: '',
      priceFrom: '',
      priceTo: '',
      areaFrom: '',
      areaTo: '',
      furnished: 'all'
    })
  }

  const getPropertyImage = (property: Property) => {
    if (property.images) {
      try {
        const images = typeof property.images === 'string' 
          ? JSON.parse(property.images) 
          : property.images
        if (Array.isArray(images) && images.length > 0) {
          return images[0]
        }
      } catch (e) {
        // Invalid JSON, use default
      }
    }
    return '/placeholder-property.jpg'
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'اليوم'
      if (diffDays === 1) return 'منذ يوم واحد'
      if (diffDays < 7) return `منذ ${diffDays} أيام`
      if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`
      if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} شهر`
      return `منذ ${Math.floor(diffDays / 365)} سنة`
    } catch {
      return 'قريباً'
    }
  }

  // Get unique values for filters
  const cities = Array.from(new Set(properties.map(p => p.city).filter(Boolean)))
  const propertyTypes = Array.from(new Set(properties.map(p => p.type).filter(Boolean)))

  return (
    <div className={styles.propertySearchPage}>
      <TenantNavigation currentPage="search-properties" />
      
      <main className={styles.mainContent}>
        {/* Banner Section */}
        <div className={styles.bannerSection}>
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>ابحث عن العقار المثالي</h1>
            <p className={styles.bannerDescription}>
              تستخدم الذكاء الاصطناعي لمساعدتك في العثور على أفضل العقارات 🏠
            </p>
          </div>
        </div>

        {/* Advanced Search Form */}
        <div className={styles.searchSection}>
          <div className={styles.searchCard}>
            <div className={styles.searchHeader}>
              <h2 className={styles.searchTitle}>البحث المتقدم</h2>
              <button 
                className={styles.toggleBtn}
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                {showAdvancedSearch ? '▲' : '▼'}
              </button>
            </div>

            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchGrid}>
                {/* First Row */}
                <div className={styles.formGroup}>
                  <label htmlFor="city">المدينة</label>
                  <select
                    id="city"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  >
                    <option value="">جميع المدن</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="priceRange">نطاق السعر</label>
                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      id="priceFrom"
                      value={filters.priceFrom}
                      onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                      placeholder="من"
                    />
                    <input
                      type="number"
                      id="priceTo"
                      value={filters.priceTo}
                      onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                      placeholder="إلى"
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className={styles.formGroup}>
                  <label htmlFor="propertyType">نوع العقار</label>
                  <select
                    id="propertyType"
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  >
                    <option value="">جميع الأنواع</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="rooms">عدد الغرف</label>
                  <select
                    id="rooms"
                    value={filters.rooms}
                    onChange={(e) => handleFilterChange('rooms', e.target.value)}
                  >
                    <option value="">أي عدد</option>
                    <option value="1">1 غرفة</option>
                    <option value="2">2 غرف</option>
                    <option value="3">3 غرف</option>
                    <option value="4">4 غرف</option>
                    <option value="5+">5+ غرف</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="area">المساحة (متر مربع)</label>
                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      id="areaFrom"
                      value={filters.areaFrom}
                      onChange={(e) => handleFilterChange('areaFrom', e.target.value)}
                      placeholder="من"
                    />
                    <input
                      type="number"
                      id="areaTo"
                      value={filters.areaTo}
                      onChange={(e) => handleFilterChange('areaTo', e.target.value)}
                      placeholder="إلى"
                    />
                  </div>
                </div>

                {/* Third Row - Status */}
                <div className={styles.formGroup}>
                  <label>الحالة</label>
                  <div className={styles.radioGroup}>
                    <label>
                      <input
                        type="radio"
                        name="furnished"
                        value="all"
                        checked={filters.furnished === 'all'}
                        onChange={(e) => handleFilterChange('furnished', e.target.value)}
                      />
                      الكل
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="furnished"
                        value="furnished"
                        checked={filters.furnished === 'furnished'}
                        onChange={(e) => handleFilterChange('furnished', e.target.value)}
                      />
                      مفروش
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="furnished"
                        value="unfurnished"
                        checked={filters.furnished === 'unfurnished'}
                        onChange={(e) => handleFilterChange('furnished', e.target.value)}
                      />
                      غير مفروش
                    </label>
                  </div>
                </div>

                {/* Search Button */}
                <div className={styles.formGroup}>
                  <button type="submit" className={styles.searchBtn}>
                    🔍 بحث
                  </button>
                </div>
              </div>

              {/* Bottom Section */}
              <div className={styles.searchFooter}>
                <div className={styles.aiHint}>
                  🤖 بحث ذكي مدعوم بالذكاء الاصطناعي
                </div>
                <div className={styles.advancedOptionsLink}>
                  ⚙️ خيارات بحث متقدمة
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Search Results */}
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              نتائج البحث ({filteredProperties.length} عقار)
            </h2>
            <div className={styles.sortGroup}>
              <label htmlFor="sortBy">ترتيب حسب:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <p>جاري تحميل العقارات...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className={styles.propertiesGrid}>
              {filteredProperties.map((property) => (
                <div key={property.id} className={styles.propertyCard}>
                  <div className={styles.propertyImage}>
                    <Image
                      src={getPropertyImage(property)}
                      alt={property.name}
                      width={400}
                      height={300}
                      className={styles.image}
                    />
                    <div className={styles.propertyBadge}>
                      {property.type === 'للبيع' ? 'للبيع' : 'للإيجار'}
                    </div>
                    <button className={styles.favoriteBtn}>❤️</button>
                  </div>

                  <div className={styles.propertyContent}>
                    <div className={styles.propertyPrice}>
                      {property.monthlyRent 
                        ? `${property.monthlyRent.toLocaleString('ar-SA')} ريال/شهر`
                        : 'السعر غير متوفر'
                      }
                    </div>

                    <h3 className={styles.propertyName}>{property.name}</h3>
                    
                    <div className={styles.propertyLocation}>
                      في {property.city || 'غير محدد'}
                    </div>

                    <div className={styles.propertyFeatures}>
                      {property.rooms && (
                        <span className={styles.feature}>
                          🛏️ {property.rooms} غرف
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className={styles.feature}>
                          🚿 {property.bathrooms} حمام
                        </span>
                      )}
                      {property.area && (
                        <span className={styles.feature}>
                          📐 {property.area} م²
                        </span>
                      )}
                    </div>

                    <div className={styles.propertyMeta}>
                      {property.propertySubType && (
                        <span className={styles.metaTag}>{property.propertySubType}</span>
                      )}
                      <span className={styles.metaDate}>
                        {formatDate(property.createdAt)}
                      </span>
                    </div>

                    <button
                      className={styles.viewDetailsBtn}
                      onClick={() => router.push(`/property/${property.id}`)}
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>لا توجد عقارات متطابقة مع بحثك</p>
              <button onClick={clearFilters} className={styles.clearBtn}>
                مسح الفلاتر
              </button>
            </div>
          )}

          {/* Pagination placeholder */}
          {filteredProperties.length > 0 && (
            <div className={styles.pagination}>
              <button className={styles.paginationBtn}>السابق</button>
              <div className={styles.paginationNumbers}>
                <button className={`${styles.paginationNumber} ${styles.active}`}>1</button>
                <button className={styles.paginationNumber}>2</button>
                <button className={styles.paginationNumber}>3</button>
              </div>
              <button className={styles.paginationBtn}>التالي</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
