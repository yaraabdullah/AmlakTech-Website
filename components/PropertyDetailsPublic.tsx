import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/PropertyDetailsPublic.module.css'

type APIFeatures = Record<string, boolean>

interface OwnerInfo {
  id: string
  first_name?: string
  last_name?: string
  email?: string
}

interface PropertyDetails {
  id: string
  name?: string
  type?: string
  listingType?: string
  address?: string
  city?: string
  neighborhood?: string | null
  area?: number | null
  rooms?: string | null
  bathrooms?: string | null
  monthlyRent?: number | null
  price?: number | null
  status?: string | null
  description?: string | null
  images?: string | string[] | null
  features?: string | APIFeatures | null
  constructionYear?: string | null
  createdAt?: string
  owner?: OwnerInfo | null
}

interface SimilarProperty {
  id: string
  name?: string
  city?: string
  neighborhood?: string | null
  area?: number | null
  rooms?: string | null
  monthlyRent?: number | null
  price?: number | null
  images?: string | string[] | null
  listingType?: string
}

interface PropertyRating {
  id: string
  propertyId: string
  tenantUserId?: string | null
  tenantUser?: {
    id: string
    firstName: string
    lastName: string
  } | null
  overallPropertyRating: number
  positives?: string | null
  negatives?: string | null
  privacyOption: string
  createdAt: string
}

const defaultImages = ['/placeholder-property.jpg']

const formatCurrency = (value?: number | null) => {
  if (!value) return 'غير متوفر'
  return `${value.toLocaleString('ar-SA')} ريال`
}

const parseImages = (images?: string | string[] | null): string[] => {
  if (!images) return defaultImages
  if (Array.isArray(images)) return images.length > 0 ? images : defaultImages
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultImages
  } catch {
    return images ? [images] : defaultImages
  }
}

const parseFeatures = (features?: string | APIFeatures | null): APIFeatures => {
  if (!features) return {}
  if (typeof features === 'object') return features
  try {
    const parsed = JSON.parse(features)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return 'قريباً'
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'قريباً'

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    if (diff < 0) return 'قريباً'

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day
    const month = 30 * day
    const year = 365 * day

    const formatUnit = (value: number, singular: string, dual: string, few: string, many: string) => {
      if (value <= 0) return 'منذ لحظات'
      if (value === 1) return `منذ ${singular}`
      if (value === 2) return `منذ ${dual}`
      if (value <= 10) return `منذ ${value} ${few}`
      return `منذ ${value} ${many}`
    }

    if (diff < minute) return 'منذ لحظات'
    if (diff < hour) {
      const minutes = Math.floor(diff / minute)
      return formatUnit(minutes, 'دقيقة واحدة', 'دقيقتين', 'دقائق', 'دقيقة')
    }
    if (diff < day) {
      const hours = Math.floor(diff / hour)
      return formatUnit(hours, 'ساعة واحدة', 'ساعتين', 'ساعات', 'ساعة')
    }
    if (diff < week) {
      const days = Math.floor(diff / day)
      return formatUnit(days, 'يوم واحد', 'يومين', 'أيام', 'يوماً')
    }
    if (diff < month) {
      const weeks = Math.floor(diff / week)
      return formatUnit(weeks, 'أسبوع واحد', 'أسبوعين', 'أسابيع', 'أسبوع')
    }
    if (diff < year) {
      const months = Math.floor(diff / month)
      return formatUnit(months, 'شهر واحد', 'شهرين', 'أشهر', 'شهراً')
    }
    const years = Math.floor(diff / year)
    return formatUnit(years, 'سنة واحدة', 'سنتين', 'سنوات', 'سنة')
  } catch {
    return 'قريباً'
  }
}

const featureLabels: Record<string, string> = {
  parking: 'موقف سيارات',
  garden: 'حديقة',
  balcony: 'شرفة',
  pool: 'مسبح',
  elevator: 'مصعد',
  gym: 'نادي رياضي',
  security: 'أمن',
  wifi: 'واي فاي',
  ac: 'تكييف',
  jacuzzi: 'جاكوزي'
}

const landlordVerificationMessages = {
  verified: 'تم التحقق من هوية المالك عبر نظام KYC',
  unverified: 'هوية غير موثقة بعد'
}

export default function PropertyDetailsPublic() {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>([])
  const [ratings, setRatings] = useState<PropertyRating[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    paymentFrequency: 'monthly',
    deposit: '',
    notes: ''
  })
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const propertyId = Array.isArray(id) ? id[0] : id

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/properties/${propertyId}`)
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات العقار')
        }
        const data = await response.json()
        setProperty(data)

        const similarResponse = await fetch(`/api/properties?publicDisplay=true`)
        if (similarResponse.ok) {
          const similarData: SimilarProperty[] = await similarResponse.json()
          const filtered = similarData
            .filter((item) => item.id !== propertyId && (item.city === data.city || item.neighborhood === data.neighborhood))
            .slice(0, 3)
          setSimilarProperties(filtered)
        } else {
          setSimilarProperties([])
        }

        // Fetch ratings for this property
        const ratingsResponse = await fetch(`/api/ratings?propertyId=${propertyId}`)
        if (ratingsResponse.ok) {
          const ratingsData: PropertyRating[] = await ratingsResponse.json()
          // Filter out private ratings (only show public and anonymous)
          const publicRatings = ratingsData.filter((rating) => rating.privacyOption !== 'private')
          setRatings(publicRatings)
        } else {
          setRatings([])
        }
      } catch (err: any) {
        console.error('Error fetching property details:', err)
        setError(err.message || 'حدث خطأ غير متوقع')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleContactChange = (field: keyof typeof contactForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleContactSubmit = (event: FormEvent) => {
    event.preventDefault()
    // Placeholder submission logic
    alert('تم إرسال رسالتك إلى المالك!')
    setContactForm({ name: '', phone: '', email: '', message: '' })
  }

  const handleOpenBookingModal = () => {
    if (typeof window === 'undefined') return
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')

    if (!userId || !(userType === 'tenant' || userType === 'مستأجر')) {
      router.push('/login')
      return
    }

    setBookingError(null)
    setBookingSuccess(null)
    setShowBookingModal(true)
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
    setBookingError(null)
    setBookingSuccess(null)
  }

  const handleBookingChange = (field: keyof typeof bookingForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.value
    setBookingForm((prev) => ({ ...prev, [field]: value }))
    setBookingError(null)
  }

  const handleBookingSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!property) return

    if (!bookingForm.startDate || !bookingForm.endDate) {
      setBookingError('يرجى اختيار تاريخ بداية ونهاية العقد.')
      return
    }

    const start = new Date(bookingForm.startDate)
    const end = new Date(bookingForm.endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      setBookingError('تاريخ نهاية العقد يجب أن يكون بعد تاريخ البداية.')
      return
    }

    if (typeof window !== 'undefined') {
      const propertyAddress = [property.neighborhood, property.city, 'المملكة العربية السعودية'].filter(Boolean).join(', ')
      const ownerName =
        property.owner ? `${property.owner.first_name || ''} ${property.owner.last_name || ''}`.trim() : 'مالك العقار'

      const draftContract = {
        propertyId: property.id,
        propertyName: property.name || 'عقار مميز',
        propertyAddress,
        ownerId: property.owner?.id || '',
        ownerName,
        monthlyRent: property.monthlyRent || property.price || 0,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        paymentFrequency: bookingForm.paymentFrequency,
        deposit: bookingForm.deposit,
        notes: bookingForm.notes,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem('draftContract', JSON.stringify(draftContract))
      setBookingSuccess('تم حفظ بيانات العقد المبدئية. جاري الانتقال إلى صفحة التوقيع...')
      setTimeout(() => {
        setShowBookingModal(false)
        router.push(`/tenant/sign-contract?propertyId=${property.id}`)
      }, 600)
    }
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <TenantNavigation />
        <main className={styles.loadingState}>
          <p>جاري تحميل بيانات العقار...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className={styles.pageWrapper}>
        <TenantNavigation />
        <main className={styles.errorState}>
          <p>{error || 'لم يتم العثور على العقار المطلوب'}</p>
          <button className={styles.backBtn} onClick={() => router.push('/property-search')}>
            العودة إلى البحث
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  const images = parseImages(property.images)
  const features = parseFeatures(property.features)
  const landlordName = property.owner ? `${property.owner.first_name || ''} ${property.owner.last_name || ''}`.trim() : 'مالك العقار'
  const isForSale = property.listingType === 'للبيع'
  const priceValue = isForSale ? formatCurrency(property.price) : formatCurrency(property.monthlyRent)
  const priceSuffix = isForSale ? '' : 'شهرياً/'
  const furnishedStatus = property.status?.includes('مفروش') ? 'مفروشة' : property.status?.includes('غير مفروش') ? 'غير مفروشة' : null

  const formattedAddress = [property.neighborhood, property.city, 'المملكة العربية السعودية'].filter(Boolean).join(', ')

  // Calculate average rating
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, rating) => sum + rating.overallPropertyRating, 0) / ratings.length).toFixed(1)
    : '0.0'

  // Format date in Arabic
  const formatArabicDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ]
      return `${months[date.getMonth()]} ${date.getFullYear()}`
    } catch {
      return 'تاريخ غير محدد'
    }
  }

  // Get reviewer name based on privacy
  const getReviewerName = (rating: PropertyRating): string => {
    if (rating.privacyOption === 'anonymous') {
      return 'مستأجر سابق'
    }
    if (rating.tenantUser) {
      return `${rating.tenantUser.firstName || ''} ${rating.tenantUser.lastName || ''}`.trim() || 'مستأجر سابق'
    }
    return 'مستأجر سابق'
  }

  // Get first letter for avatar
  const getAvatarLetter = (rating: PropertyRating): string => {
    if (rating.privacyOption === 'anonymous') {
      return 'م'
    }
    if (rating.tenantUser) {
      const firstName = rating.tenantUser.firstName || ''
      return firstName.charAt(0) || 'م'
    }
    return 'م'
  }

  // Get review text (positives or negatives)
  const getReviewText = (rating: PropertyRating): string => {
    if (rating.positives) return rating.positives
    if (rating.negatives) return rating.negatives
    return 'لا يوجد تعليق'
  }

  type QuickStat = {
    icon: string
    alt: string
    label: string
  }

  const quickStats = [
    {
      icon: '/icons/bedroom.svg',
      alt: 'غرف النوم',
      label: property.rooms ? `${property.rooms} غرف نوم` : 'غرف غير محددة',
    },
    {
      icon: '/icons/bathroom.svg',
      alt: 'الحمامات',
      label: property.bathrooms ? `${property.bathrooms} حمامات` : 'حمامات غير محددة',
    },
    {
      icon: '/icons/size.svg',
      alt: 'المساحة',
      label: property.area ? `${property.area} متر مربع` : 'المساحة غير متوفرة',
    },
    {
      icon: '/icons/date.svg',
      alt: 'تاريخ الإضافة',
      label: property.constructionYear ? `ثبّت في ${property.constructionYear}` : formatRelativeTime(property.createdAt),
    },
    features.parking
      ? {
          icon: '/icons/car.svg',
          alt: 'موقف السيارة',
          label: 'موقف سيارة متوفر',
        }
      : null,
  ].filter(Boolean) as QuickStat[]

  const headerActions = [
    { label: 'حفظ', icon: '/icons/save.svg' },
    { label: 'مشاركة', icon: '/icons/share.svg' },
    { label: 'طباعة', icon: '/icons/print.svg' },
    { label: 'إبلاغ', icon: '/icons/report.svg' },
  ]

  const handleBookVisit = () => {
    if (!property?.id) return
    router.push(`/property/visit/${property.id}`)
  }

  return (
    <div className={styles.pageWrapper}>
      <TenantNavigation />

      <main className={styles.mainContent}>
        <div className={styles.gallerySection}>
          <div className={styles.primaryImage}>
            <Image src={images[0]} alt={property.name || 'عقار'} width={960} height={640} className={styles.galleryImage} />
            {property.listingType && (
              <div className={styles.listingBadge}>{property.listingType === 'للبيع' ? 'للبيع' : 'للإيجار'}</div>
            )}
          </div>
          <div className={styles.secondaryImages}>
            {images.slice(1, 5).map((img, index) => (
              <div key={img + index} className={styles.secondaryImageWrapper}>
                <Image src={img} alt={`صورة ${index + 2}`} width={300} height={220} className={styles.galleryImage} />
              </div>
            ))}
            <button className={styles.viewAllBtn}>عرض جميع الصور</button>
          </div>
        </div>

        <div className={styles.layoutGrid}>
          <section className={styles.contentColumn}>
            <div className={styles.headerCard}>
              <div className={styles.headerTopRow}>
                <div className={styles.titleBlock}>
                  <h1 className={styles.propertyTitle}>{property.name || 'عقار مميز'}</h1>
                  <div className={styles.propertyLocationLine}>
                    <span className={styles.locationIcon}>
                      <Image src="/icons/location.svg" alt="موقع العقار" width={18} height={18} />
                    </span>
                    {formattedAddress || 'غير محدد'}
                  </div>
                </div>
                <div className={styles.priceSection}>
                  <span className={styles.priceValue}>{priceValue}</span>
                  {priceSuffix && <span className={styles.priceSuffix}>{priceSuffix}</span>}
                </div>
              </div>

              <div className={styles.statsRow}>
                {quickStats.map((stat) => (
                  <div key={stat.label} className={styles.statItem}>
                    <span className={styles.statIcon}>
                      <Image src={stat.icon} alt={stat.alt} width={20} height={20} />
                    </span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}

                {furnishedStatus && (
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>🛋️</span>
                    <span className={styles.statLabel}>{furnishedStatus}</span>
                  </div>
                )}
              </div>

              <div className={styles.headerActionsRow}>
                {headerActions.map((action) => (
                  <button key={action.label} className={styles.headerActionBtn}>
                    <span className={styles.actionIconWrapper}>
                      <Image src={action.icon} alt={action.label} width={20} height={20} />
                    </span>
                    <span className={styles.actionLabel}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>جولة افتراضية</h2>
                <span className={styles.vrIcon}>
                  <Image src="/icons/VR.svg" alt="جولة افتراضية" width={24} height={24} className={styles.vrIconImage} />
                </span>
              </div>
              <div className={styles.virtualTourPlaceholder}>
                <button className={styles.virtualTourBtn}>بدء الجولة الافتراضية بتقنية 360</button>
                <p>تم إنشاء الجولة بواسطة الذكاء الاصطناعي</p>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>وصف العقار</h2>
              </div>
              <p className={styles.propertyDescription}>
                {property.description || 'لا يوجد وصف متوفر لهذا العقار حالياً.'}
              </p>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>مميزات العقار</h2>
              </div>
              <ul className={styles.featuresList}>
                {Object.entries(features)
                  .filter(([, value]) => Boolean(value))
                  .map(([key]) => (
                    <li key={key}><span className={styles.checkmark}>✓</span> {featureLabels[key] || key}</li>
                  ))}
                {furnishedStatus && <li><span className={styles.checkmark}>✓</span> {furnishedStatus}</li>}
              </ul>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>الموقع</h2>
              </div>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapCaption}>عرض الخريطة قريباً</div>
              </div>
              <div className={styles.locationHighlights}>
                <div>🏫 المدارس: خلال 3 كم</div>
                <div>🏥 المستشفيات: ضمن 5 كم</div>
                <div>🛍️ المراكز التجارية: قريبة</div>
                <div>🌳 الحدائق: تقع على بعد 2 كم</div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>تقييمات المستأجرين السابقين</h2>
                {ratings.length > 0 && (
                  <span className={styles.ratingBadge}>{averageRating} ⭐</span>
                )}
              </div>
              {ratings.length > 0 ? (
                <>
                  <div className={styles.reviewsList}>
                    {ratings.slice(0, 2).map((rating) => (
                      <div key={rating.id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewerAvatar}>{getAvatarLetter(rating)}</div>
                          <div>
                            <div className={styles.reviewerName}>{getReviewerName(rating)}</div>
                            <div className={styles.reviewDate}>{formatArabicDate(rating.createdAt)}</div>
                          </div>
                          <div className={styles.reviewRating}>{rating.overallPropertyRating.toFixed(1)} ⭐</div>
                        </div>
                        <p className={styles.reviewText}>{getReviewText(rating)}</p>
                      </div>
                    ))}
                  </div>
                  {ratings.length > 2 && (
                    <button className={styles.viewAllReviewsBtn}>عرض جميع التقييمات</button>
                  )}
                </>
              ) : (
                <p className={styles.noReviewsText}>لا توجد تقييمات متاحة حالياً</p>
              )}
            </div>
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>تواصل مع المالك</h3>
              <div className={styles.landlordInfo}>
                <div className={styles.landlordAvatar}>
                  <Image src="/icons/person.svg" alt="مالك العقار" width={40} height={40} className={styles.landlordAvatarImage} />
                </div>
                <div>
                  <div className={styles.landlordName}>{landlordName || 'مالك العقار'}</div>
                  <div className={styles.landlordRole}>مالك العقار</div>
                </div>
              </div>
              <div className={styles.verificationBox}>
                <span className={styles.checkmark}>✓</span>
                <div className={styles.verificationText}>{landlordVerificationMessages.verified}</div>
              </div>

              {!isForSale && (
                <div className={styles.bookingPrompt}>
                  <h4>جاهز للاستئجار؟</h4>
                  <p>قم بإدخال بياناتك الأولية واستكمل إجراءات التوقيع الإلكتروني خلال دقائق.</p>
                  <button type="button" className={styles.bookPropertyBtn} onClick={handleOpenBookingModal}>
                    توقيع عقد الإيجار
                  </button>
                </div>
              )}

              <form className={styles.contactForm} onSubmit={handleContactSubmit}>
                <input placeholder="الاسم" value={contactForm.name} onChange={handleContactChange('name')} required />
                <input placeholder="رقم الهاتف" value={contactForm.phone} onChange={handleContactChange('phone')} />
                <input placeholder="البريد الإلكتروني" value={contactForm.email} onChange={handleContactChange('email')} />
                <textarea placeholder="رسالتك" rows={4} value={contactForm.message} onChange={handleContactChange('message')} />
                <button type="submit" className={styles.submitBtn}>إرسال رسالة</button>
              </form>

              <div className={styles.contactActions}>
                <button className={styles.altAction}>عرض رقم الهاتف</button>
                <button className={styles.altAction} onClick={handleBookVisit}>
                  حجز موعد معاينة
                </button>
              </div>
            </div>

            <div className={styles.aiAssistantCard}>
              <h3 className={styles.sectionTitle}>المساعد الذكي</h3>
              <p>استخدم مساعدنا الذكي للحصول على معلومات دقيقة ودعم في التفاوض على السعر.</p>
              <ul className={styles.aiQuestions}>
                <li>🎯 ما هو تحليل سعر العقار مقارنة بالمنطقة؟</li>
                <li>💰 ما هي التكلفة التقديرية للصيانة؟</li>
                <li>🤝 هل يمكنني التفاوض على السعر؟</li>
              </ul>
              <button className={styles.aiBtn}>اسأل المساعد</button>
            </div>

            {similarProperties.length > 0 && (
              <div className={styles.similarCard}>
                <h3 className={styles.sectionTitle}>عقارات مشابهة</h3>
                <div className={styles.similarList}>
                  {similarProperties.map((item) => {
                    const simImages = parseImages(item.images)
                    return (
                      <div key={item.id} className={styles.similarItem} onClick={() => router.push(`/property/${item.id}`)}>
                        <Image src={simImages[0]} alt={item.name || 'عقار'} width={120} height={90} className={styles.similarImage} />
                        <div className={styles.similarInfo}>
                          <div className={styles.similarName}>{item.name || 'عقار'}</div>
                          <div className={styles.similarLocation}>{[item.neighborhood, item.city].filter(Boolean).join(', ')}</div>
                          <div className={styles.similarPrice}>{item.listingType === 'للبيع' ? formatCurrency(item.price) : `${formatCurrency(item.monthlyRent)}/شهرياً`}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button className={styles.viewMoreBtn}>عرض المزيد من العقارات المشابهة</button>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />

      {showBookingModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <h3>حجز العقار وتوقيع العقد</h3>
                <p>أدخل تفاصيل العقد المبدئية لإتمام التوقيع الإلكتروني.</p>
              </div>
              <button className={styles.modalCloseBtn} type="button" onClick={handleCloseBookingModal} aria-label="إغلاق نافذة الحجز">
                ×
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleBookingSubmit}>
              <div className={styles.modalGrid}>
                <label className={styles.modalField}>
                  <span>تاريخ بداية العقد</span>
                  <input type="date" value={bookingForm.startDate} onChange={handleBookingChange('startDate')} required />
                </label>

                <label className={styles.modalField}>
                  <span>تاريخ نهاية العقد</span>
                  <input type="date" value={bookingForm.endDate} onChange={handleBookingChange('endDate')} required />
                </label>

                <label className={styles.modalField}>
                  <span>دورية الدفع</span>
                  <select value={bookingForm.paymentFrequency} onChange={handleBookingChange('paymentFrequency')}>
                    <option value="monthly">شهري</option>
                    <option value="quarterly">ربع سنوي</option>
                    <option value="yearly">سنوي</option>
                  </select>
                </label>

                <label className={styles.modalField}>
                  <span>مبلغ التأمين (اختياري)</span>
                  <input
                    type="number"
                    min="0"
                    value={bookingForm.deposit}
                    onChange={handleBookingChange('deposit')}
                    placeholder="مثال: 5000"
                  />
                </label>
              </div>

              <label className={styles.modalField}>
                <span>ملاحظات إضافية</span>
                <textarea
                  rows={3}
                  value={bookingForm.notes}
                  onChange={handleBookingChange('notes')}
                  placeholder="هل لديك أي شروط أو ملاحظات خاصة؟"
                />
              </label>

              {bookingError && <div className={styles.modalError}>{bookingError}</div>}
              {bookingSuccess && <div className={styles.modalSuccess}>{bookingSuccess}</div>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalSecondaryBtn} onClick={handleCloseBookingModal}>
                  إلغاء
                </button>
                <button type="submit" className={styles.modalPrimaryBtn}>
                  المتابعة إلى التوقيع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

