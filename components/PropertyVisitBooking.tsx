import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/PropertyVisitBooking.module.css'

interface OwnerInfo {
  first_name?: string | null
  last_name?: string | null
}

interface PropertyVisitDetails {
  id: string
  name?: string | null
  city?: string | null
  neighborhood?: string | null
  area?: number | null
  rooms?: number | null
  bathrooms?: number | null
  monthlyRent?: number | null
  price?: number | null
  listingType?: string | null
  images?: string[] | string | null
  type?: string | null
  owner?: OwnerInfo | null
}

type VisitType = 'inPerson' | 'virtual'

const monthNames = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

const weekdayLabels = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

const timeSlots = ['9:00 ص', '10:00 ص', '11:00 ص', '12:00 م', '1:00 م', '2:00 م', '3:00 م', '4:00 م', '5:00 م']

const formatCurrency = (value?: number | null) => {
  if (!value || Number.isNaN(value)) return 'غير محدد'
  return Number(value).toLocaleString('ar-SA')
}

const parseImages = (images?: string[] | string | null): string[] => {
  if (!images) return ['/images/property-placeholder.jpg']
  if (Array.isArray(images) && images.length > 0) return images
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch (error) {
      return [images]
    }
    return [images]
  }
  return ['/images/property-placeholder.jpg']
}

const PropertyVisitBooking: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState<PropertyVisitDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [visitType, setVisitType] = useState<VisitType>('inPerson')
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>('2:00 م')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchProperty = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/properties/${id}`)
        if (!response.ok) throw new Error('فشل في جلب بيانات العقار')
        const data = await response.json()
        setProperty(data)
        setError(null)
      } catch (fetchError) {
        console.error(fetchError)
        setError('حدث خطأ أثناء تحميل بيانات العقار. يرجى المحاولة لاحقاً.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const daysMatrix = useMemo(() => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const leadingEmptyDays = startDate.getDay()
    const totalDays = endDate.getDate()

    const allDays: Array<Date | null> = []
    for (let i = 0; i < leadingEmptyDays; i += 1) {
      allDays.push(null)
    }
    for (let day = 1; day <= totalDays; day += 1) {
      allDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
    }
    while (allDays.length % 7 !== 0) {
      allDays.push(null)
    }

    const weeks: Array<Array<Date | null>> = []
    for (let index = 0; index < allDays.length; index += 7) {
      weeks.push(allDays.slice(index, index + 7))
    }
    return weeks
  }, [currentMonth])

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const delta = direction === 'prev' ? -1 : 1
      return new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    })
  }

  const handleConfirm = () => {
    if (!property || !selectedDate || !selectedTime) {
      setError('يرجى اختيار تاريخ ووقت للزيارة قبل المتابعة.')
      return
    }

    const visitSummary = {
      visitType: visitType === 'inPerson' ? 'زيارة شخصية' : 'جولة افتراضية',
      date: selectedDate.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: selectedTime,
      notes: notes.trim() || 'لا توجد ملاحظات إضافية',
    }

    console.log('Visit booking confirmed:', visitSummary)
    alert('تم إرسال طلب حجز الزيارة بنجاح! سنتواصل معك لتأكيد الموعد.')
    router.push(`/property/${property.id}`)
  }

  const formattedAddress = property
    ? [property.neighborhood, property.city, 'المملكة العربية السعودية'].filter(Boolean).join(', ')
    : ''

  const propertyImages = parseImages(property?.images)
  const landlordName = property?.owner ? `${property.owner.first_name || ''} ${property.owner.last_name || ''}`.trim() : ''
  const displayVisitType = visitType === 'inPerson' ? 'زيارة شخصية' : 'جولة افتراضية'

  let content: React.ReactNode

  if (loading) {
    content = <div className={styles.loadingState}>جار تحميل البيانات...</div>
  } else if (error) {
    content = <div className={styles.errorState}>{error}</div>
  } else if (!property) {
    content = <div className={styles.errorState}>لم يتم العثور على العقار المطلوب.</div>
  } else {
    content = (
      <div className={styles.bookingLayout}>
        <div className={styles.formColumn}>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>حجز زيارة للعقار</h1>
            <p className={styles.pageSubtitle}>اختر نوع الزيارة والتاريخ والوقت المناسب لك</p>
          </header>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>نوع الزيارة</h2>
              <span className={styles.requiredMark}>*</span>
            </div>
            <div className={styles.visitTypeGrid}>
              <button
                type="button"
                className={`${styles.visitTypeCard} ${visitType === 'inPerson' ? styles.activeCard : ''}`}
                onClick={() => setVisitType('inPerson')}
              >
                <span className={styles.visitIcon}>🏡</span>
                <div className={styles.visitContent}>
                  <span className={styles.visitTitle}>زيارة شخصية</span>
                  <span className={styles.visitDescription}>زيارة العقار على الواقع</span>
                </div>
              </button>
              <button
                type="button"
                className={`${styles.visitTypeCard} ${visitType === 'virtual' ? styles.activeCard : ''}`}
                onClick={() => setVisitType('virtual')}
              >
                <span className={styles.visitIcon}>
                  <Image src="/icons/VR.svg" alt="جولة افتراضية" width={32} height={32} className={styles.visitIconImage} />
                </span>
                <div className={styles.visitContent}>
                  <span className={styles.visitTitle}>جولة افتراضية</span>
                  <span className={styles.visitDescription}>عبر تقنية الواقع الافتراضي</span>
                </div>
              </button>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>اختر التاريخ</h2>
              <span className={styles.requiredMark}>*</span>
            </div>
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <button type="button" className={styles.calendarNavBtn} onClick={() => handleMonthChange('prev')}>
                  ‹
                </button>
                <div className={styles.calendarMonth}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button type="button" className={styles.calendarNavBtn} onClick={() => handleMonthChange('next')}>
                  ›
                </button>
              </div>
              <div className={styles.calendarGrid}>
                {weekdayLabels.map((day) => (
                  <div key={day} className={styles.calendarWeekday}>
                    {day}
                  </div>
                ))}
                {daysMatrix.map((week, weekIndex) =>
                  week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={`empty-${weekIndex}-${dayIndex}`} className={styles.calendarCell} />
                    }
                    const isSelected =
                      selectedDate &&
                      day.getDate() === selectedDate.getDate() &&
                      day.getMonth() === selectedDate.getMonth() &&
                      day.getFullYear() === selectedDate.getFullYear()
                    const isPast =
                      day < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

                    return (
                      <button
                        type="button"
                        key={day.toISOString()}
                        className={`${styles.calendarDay} ${isSelected ? styles.selectedDay : ''} ${
                          isPast ? styles.disabledDay : ''
                        }`}
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                      >
                        {day.getDate()}
                      </button>
                    )
                  }),
                )}
              </div>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>اختر الوقت</h2>
              <span className={styles.requiredMark}>*</span>
            </div>
            <div className={styles.timeSlotsGrid}>
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={`${styles.timeSlotBtn} ${selectedTime === slot ? styles.activeTimeSlot : ''}`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>ملاحظات إضافية</h2>
            </div>
            <textarea
              className={styles.notesInput}
              placeholder="أضف أي ملاحظات أو استفسارات خاصة بالزيارة..."
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </section>

          <div className={styles.assistantCard}>
            <div className={styles.assistantIcon}>🤖</div>
            <div>
              <h3 className={styles.assistantTitle}>الذكاء الاصطناعي في خدمتك</h3>
              <p className={styles.assistantText}>
                يقوم مساعدنا الذكي بتحليل تفضيلاتك وتقديم توصيات مخصصة لك بناءً على زياراتك السابقة واهتماماتك.
              </p>
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
              تأكيد الحجز
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => router.push(`/property/${property.id}`)}>
              إلغاء
            </button>
          </div>
        </div>

        <aside className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryImageWrapper}>
              <Image
                src={propertyImages[0]}
                alt={property.name || 'عقار'}
                width={400}
                height={260}
                className={styles.summaryImage}
              />
            </div>
            <div className={styles.summaryContent}>
              <h2 className={styles.summaryTitle}>{property.name || 'عقار مميز'}</h2>
              <div className={styles.summaryLocation}>
                <span className={styles.summaryLocationIcon}>
                  <Image src="/icons/location.svg" alt="موقع العقار" width={18} height={18} />
                </span>
                {formattedAddress || 'غير محدد'}
              </div>
              <ul className={styles.summaryDetails}>
                {property.rooms && (
                  <li>
                    <span className={styles.summaryDetailIcon}>
                      <Image src="/icons/bedroom.svg" alt="غرف النوم" width={20} height={20} />
                    </span>
                    {property.rooms} غرف نوم
                  </li>
                )}
                {property.bathrooms && (
                  <li>
                    <span className={styles.summaryDetailIcon}>
                      <Image src="/icons/bathroom.svg" alt="الحمامات" width={20} height={20} />
                    </span>
                    {property.bathrooms} حمام
                  </li>
                )}
                {property.area && (
                  <li>
                    <span className={styles.summaryDetailIcon}>
                      <Image src="/icons/size.svg" alt="المساحة" width={20} height={20} />
                    </span>
                    {property.area} متر مربع
                  </li>
                )}
                {landlordName && (
                  <li>
                    <span className={styles.summaryDetailIcon}>
                      <Image src="/icons/مالك عقار.svg" alt="مالك العقار" width={20} height={20} className={styles.summaryDetailIconImage} />
                    </span>
                    {landlordName}
                  </li>
                )}
              </ul>
              <div className={styles.priceBox}>
                <span className={styles.priceLabel}>{property.listingType === 'للبيع' ? 'سعر البيع' : 'الإيجار الشهري'}</span>
                <span className={styles.priceValue}>
                  {formatCurrency(property.listingType === 'للبيع' ? property.price : property.monthlyRent)} ريال
                </span>
                {property.listingType !== 'للبيع' && <span className={styles.priceSuffix}>شهرياً</span>}
              </div>
              <div className={styles.visitSummary}>
                <div>
                  <span className={styles.summaryLabel}>نوع الزيارة:</span>
                  <span>{displayVisitType}</span>
                </div>
                <div>
                  <span className={styles.summaryLabel}>التاريخ المحدد:</span>
                  <span>
                    {selectedDate
                      ? selectedDate.toLocaleDateString('ar-SA', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'لم يتم التحديد'}
                  </span>
                </div>
                <div>
                  <span className={styles.summaryLabel}>الوقت المحدد:</span>
                  <span>{selectedTime || 'لم يتم التحديد'}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    )
  }

  return <div className={styles.bookingPage}>{content}</div>
}

export default PropertyVisitBooking

