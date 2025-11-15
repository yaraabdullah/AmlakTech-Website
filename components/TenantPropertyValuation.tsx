import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/TenantPropertyValuation.module.css'

interface Contract {
  id: string
  propertyId: string
  unitId?: string | null
  unit?: {
    id: string
    unitNumber: string
  } | null
  property?: {
    id: string
    name: string
    address?: string
    city?: string
    area?: number
    rooms?: number
    bathrooms?: number
    images?: string[]
    owner?: {
      id: string
      first_name: string
      last_name: string
    }
  } | null
  status?: string
}

const PROPERTY_CRITERIA = [
  { id: 'location', label: 'الموقع' },
  { id: 'cleanliness', label: 'النظافة' },
  { id: 'maintenance', label: 'الصيانة' },
  { id: 'facilities', label: 'المرافق' },
  { id: 'value', label: 'القيمة مقابل السعر' },
]

const OWNER_CRITERIA = [
  { id: 'responsiveness', label: 'سرعة الاستجابة' },
  { id: 'professionalism', label: 'الاحترافية' },
  { id: 'transparency', label: 'الشفافية' },
  { id: 'privacy', label: 'احترام الخصوصية' },
  { id: 'communication', label: 'سهولة التواصل' },
]

const SATISFACTION_LEVELS = [
  { id: 'excellent', emoji: '😎', label: 'ممتاز' },
  { id: 'good', emoji: '😊', label: 'جيد' },
  { id: 'neutral', emoji: '😐', label: 'محايد' },
  { id: 'bad', emoji: '😞', label: 'سيء' },
  { id: 'very-bad', emoji: '😡', label: 'سيء جداً' },
]

export default function TenantPropertyValuation() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [stayPeriodFrom, setStayPeriodFrom] = useState('')
  const [stayPeriodTo, setStayPeriodTo] = useState('')
  
  // Ratings
  const [overallPropertyRating, setOverallPropertyRating] = useState(0)
  const [propertyRatings, setPropertyRatings] = useState<Record<string, number>>({})
  const [ownerRatings, setOwnerRatings] = useState<Record<string, number>>({})
  const [satisfactionLevel, setSatisfactionLevel] = useState<string>('')
  
  // Feedback
  const [positives, setPositives] = useState('')
  const [negatives, setNegatives] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  
  // AI and Privacy
  const [improveComment, setImproveComment] = useState(true)
  const [correctGrammar, setCorrectGrammar] = useState(true)
  const [privacyOption, setPrivacyOption] = useState<'public' | 'anonymous' | 'private'>('public')
  
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId')
      const userType = localStorage.getItem('userType')
      
      if (!storedUserId || (userType !== 'tenant' && userType !== 'مستأجر')) {
        router.push('/login')
        return
      }
      
      setUserId(storedUserId)
      fetchTenantData(storedUserId)
    }
  }, [router])

  const fetchTenantData = async (userId: string) => {
    try {
      setLoading(true)
      
      const contractsResponse = await fetch(`/api/contracts?tenantUserId=${userId}`)
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setContracts(contractsData)
        
        // Set first active contract as default
        const activeContract = contractsData.find((c: Contract) => c.status === 'نشط') || contractsData[0]
        if (activeContract) {
          setSelectedContract(activeContract)
          // Fetch full property details
          if (activeContract.propertyId) {
            const propertyResponse = await fetch(`/api/properties/${activeContract.propertyId}`)
            if (propertyResponse.ok) {
              const propertyData = await propertyResponse.json()
              setSelectedContract({
                ...activeContract,
                property: {
                  ...activeContract.property,
                  ...propertyData,
                },
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStarClick = (category: string, criterion: string, rating: number) => {
    if (category === 'property') {
      setPropertyRatings(prev => ({ ...prev, [criterion]: rating }))
    } else if (category === 'owner') {
      setOwnerRatings(prev => ({ ...prev, [criterion]: rating }))
    }
  }

  const calculateOverallRating = () => {
    const allRatings = [
      ...Object.values(propertyRatings),
      ...Object.values(ownerRatings),
    ]
    if (allRatings.length === 0) return 0
    const sum = allRatings.reduce((acc, val) => acc + val, 0)
    return (sum / allRatings.length).toFixed(1)
  }

  const handlePhotoSelect = (files: FileList | null) => {
    if (!files) return

    const newPhotos: File[] = []
    const newPreviews: string[] = []

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`الصورة ${file.name} أكبر من 5 ميجابايت`)
        return
      }

      if (photos.length + newPhotos.length >= 5) {
        alert('يمكنك رفع حتى 5 صور فقط')
        return
      }

      newPhotos.push(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string)
          if (newPreviews.length === newPhotos.length) {
            setPhotos([...photos, ...newPhotos])
            setPhotoPreviews([...photoPreviews, ...newPreviews])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoPreviews(newPreviews)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePhotoSelect(e.dataTransfer.files)
    }
  }

  const handleSubmit = async () => {
    if (!selectedContract) {
      alert('يرجى اختيار العقار')
      return
    }

    if (!satisfactionLevel) {
      alert('يرجى اختيار مستوى الرضا العام')
      return
    }

    try {
      setSubmitting(true)

      // Convert photos to base64
      const photoData = await Promise.all(
        photos.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
          })
        })
      )

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: selectedContract.propertyId,
          contractId: selectedContract.id,
          tenantUserId: userId,
          stayPeriodFrom,
          stayPeriodTo,
          overallPropertyRating: parseFloat(calculateOverallRating()),
          propertyRatings,
          ownerRatings,
          satisfactionLevel,
          positives,
          negatives,
          photos: photoData,
          improveComment,
          correctGrammar,
          privacyOption,
        }),
      })

      if (response.ok) {
        alert('تم إرسال التقييم بنجاح')
        router.push('/tenant/lease-records')
      } else {
        const error = await response.json()
        alert(error.error || 'فشل إرسال التقييم')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('حدث خطأ أثناء إرسال التقييم')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (category: string, criterion: string, currentRating: number) => {
    return (
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${star <= currentRating ? styles.starFilled : styles.starEmpty}`}
            onClick={() => handleStarClick(category, criterion, star)}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="property-valuation" />
        <div className={styles.loading}>جاري التحميل...</div>
        <Footer />
      </div>
    )
  }

  if (!selectedContract || !selectedContract.property) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="property-valuation" />
        <div className={styles.noContract}>
          <p>لا توجد عقارات متاحة للتقييم</p>
        </div>
        <Footer />
      </div>
    )
  }

  const property = selectedContract.property
  const overallRating = calculateOverallRating()

  return (
    <div className={styles.page}>
      <TenantNavigation currentPage="property-valuation" />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>⭐</div>
              <div>
                <h1 className={styles.pageTitle}>تقييم العقار والمالك</h1>
                <p className={styles.pageSubtitle}>
                  مشاركة تجربتك تساعد المستأجرين الآخرين في اتخاذ قرارات أفضل. نستخدم الذكاء الاصطناعي لتحليل التقييمات وتقديم توصيات مخصصة.
                </p>
              </div>
            </div>
          </div>

          {/* Property Information Card */}
          <div className={styles.propertyCard}>
            <div className={styles.propertyCardContent}>
              <div className={styles.propertyInfo}>
                <h2 className={styles.propertyName}>{property.name}</h2>
                <div className={styles.propertyLocation}>
                  <img src="/icons/location.svg" alt="موقع" className={styles.locationIcon} />
                  <span>{property.address}, {property.city}</span>
                </div>
                <div className={styles.propertyFeatures}>
                  {property.rooms && (
                    <div className={styles.feature}>
                      <img src="/icons/bedroom.svg" alt="غرف" />
                      <span>{property.rooms} غرف نوم</span>
                    </div>
                  )}
                  {property.area && (
                    <div className={styles.feature}>
                      <img src="/icons/size.svg" alt="مساحة" />
                      <span>{property.area} متر مربع</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className={styles.feature}>
                      <img src="/icons/bathroom.svg" alt="حمام" />
                      <span>{property.bathrooms} حمام</span>
                    </div>
                  )}
                </div>
                {property.owner && (
                  <div className={styles.propertyOwner}>
                    <img src="/icons/person.svg" alt="مالك" className={styles.ownerIcon} />
                    <span>المالك: {property.owner.first_name} {property.owner.last_name}</span>
                  </div>
                )}
                <div className={styles.stayPeriod}>
                  <div className={styles.stayPeriodInput}>
                    <label>فترة الإقامة من</label>
                    <input
                      type="date"
                      value={stayPeriodFrom}
                      onChange={(e) => setStayPeriodFrom(e.target.value)}
                    />
                  </div>
                  <div className={styles.stayPeriodInput}>
                    <label>إلى</label>
                    <input
                      type="date"
                      value={stayPeriodTo}
                      onChange={(e) => setStayPeriodTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {property.images && property.images.length > 0 && (
                <div className={styles.propertyImage}>
                  <img src={property.images[0]} alt={property.name} />
                </div>
              )}
            </div>
          </div>

          {/* General Property Evaluation */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>التقييم العام للعقار</h2>
            <div className={styles.overallRating}>
              <span className={styles.ratingNumber}>{overallRating}</span>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.overallStar} ${star <= parseFloat(overallRating) ? styles.starFilled : styles.starEmpty}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Property Evaluation */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>تقييم العقار</h2>
            <div className={styles.criteriaList}>
              {PROPERTY_CRITERIA.map((criterion) => (
                <div key={criterion.id} className={styles.criterion}>
                  <span className={styles.criterionLabel}>{criterion.label}</span>
                  {renderStars('property', criterion.id, propertyRatings[criterion.id] || 0)}
                </div>
              ))}
            </div>
          </div>

          {/* Owner Evaluation */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              تقييم المالك
              <span className={styles.ownerEmojis}>😊 😐</span>
            </h2>
            <div className={styles.criteriaList}>
              {OWNER_CRITERIA.map((criterion) => (
                <div key={criterion.id} className={styles.criterion}>
                  <span className={styles.criterionLabel}>{criterion.label}</span>
                  {renderStars('owner', criterion.id, ownerRatings[criterion.id] || 0)}
                </div>
              ))}
            </div>
          </div>

          {/* Overall Satisfaction */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>ما هو مستوى رضاك العام عن تجربة الإيجار؟</h2>
            <div className={styles.satisfactionLevels}>
              {SATISFACTION_LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  className={`${styles.satisfactionButton} ${satisfactionLevel === level.id ? styles.satisfactionSelected : ''}`}
                  onClick={() => setSatisfactionLevel(level.id)}
                >
                  <span className={styles.satisfactionEmoji}>{level.emoji}</span>
                  <span className={styles.satisfactionLabel}>{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>أضف تعليقك حول تجربتك</h2>
            <div className={styles.feedbackGrid}>
              <div className={styles.feedbackBox}>
                <div className={styles.feedbackHeader}>
                  <h3>الإيجابيات</h3>
                  <img src="/icons/thumbsUp.svg" alt="إيجابيات" className={styles.feedbackIcon} />
                </div>
                <textarea
                  className={styles.feedbackTextarea}
                  rows={6}
                  value={positives}
                  onChange={(e) => setPositives(e.target.value)}
                  placeholder="الذي أعجبك في العقار والمالك؟"
                />
              </div>
              <div className={styles.feedbackBox}>
                <div className={styles.feedbackHeader}>
                  <h3>السلبيات</h3>
                  <img src="/icons/thumbsDown.svg" alt="سلبيات" className={styles.feedbackIcon} />
                </div>
                <textarea
                  className={styles.feedbackTextarea}
                  rows={6}
                  value={negatives}
                  onChange={(e) => setNegatives(e.target.value)}
                  placeholder="الذي لم يعجبك أو تقترح تحسينه؟"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>أضف صور للعقار (اختياري)</h2>
            <div
              className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={styles.uploadContent}>
                <div className={styles.uploadIcon}>☁️</div>
                <p className={styles.uploadText}>اسحب وأفلت الصور هنا، أو انقر للتصفح</p>
                <button
                  type="button"
                  className={styles.browseButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  اختر الصور
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handlePhotoSelect(e.target.files)}
                />
                <p className={styles.uploadHint}>
                  الحد الأقصى: 5 صور (بحجم أقصى 5 ميجابايت لكل صورة)
                </p>
              </div>
            </div>

            {photoPreviews.length > 0 && (
              <div className={styles.photoPreviews}>
                {photoPreviews.map((preview, index) => (
                  <div key={index} className={styles.photoPreview}>
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removePhoto}
                      onClick={() => removePhoto(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Improvement */}
          <div className={styles.section}>
            <div className={styles.aiImprovementHeader}>
              <img src="/icons/ai-analytics.svg" alt="ذكاء اصطناعي" className={styles.aiIcon} />
              <h2 className={styles.sectionTitle}>تحسين بالذكاء الاصطناعي</h2>
            </div>
            <p className={styles.aiDescription}>
              يمكن لنظامنا الذكي تحليل تعليقك وتقديم اقتراحات لتحسينه ليكون أكثر فائدة للمستخدمين الآخرين.
            </p>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={improveComment}
                  onChange={(e) => setImproveComment(e.target.checked)}
                />
                <span>تحسين التعليق</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={correctGrammar}
                  onChange={(e) => setCorrectGrammar(e.target.checked)}
                />
                <span>تصحيح الأخطاء اللغوية</span>
              </label>
            </div>
          </div>

          {/* Privacy Options */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>خيارات الخصوصية</h2>
            <div className={styles.privacyOptions}>
              <label className={`${styles.privacyOption} ${privacyOption === 'public' ? styles.privacySelected : ''}`}>
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={privacyOption === 'public'}
                  onChange={(e) => setPrivacyOption(e.target.value as 'public')}
                />
                <div className={styles.privacyContent}>
                  <img src="/icons/share.svg" alt="عام" className={styles.privacyIcon} />
                  <div>
                    <strong>عام</strong>
                    <p>سيظهر تقييمك لجميع المستخدمين</p>
                  </div>
                </div>
              </label>
              <label className={`${styles.privacyOption} ${privacyOption === 'anonymous' ? styles.privacySelected : ''}`}>
                <input
                  type="radio"
                  name="privacy"
                  value="anonymous"
                  checked={privacyOption === 'anonymous'}
                  onChange={(e) => setPrivacyOption(e.target.value as 'anonymous')}
                />
                <div className={styles.privacyContent}>
                  <img src="/icons/Privacy.svg" alt="مجهول" className={styles.privacyIcon} />
                  <div>
                    <strong>مجهول</strong>
                    <p>سيظهر تقييمك بدون اسمك</p>
                  </div>
                </div>
              </label>
              <label className={`${styles.privacyOption} ${privacyOption === 'private' ? styles.privacySelected : ''}`}>
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={privacyOption === 'private'}
                  onChange={(e) => setPrivacyOption(e.target.value as 'private')}
                />
                <div className={styles.privacyContent}>
                  <img src="/icons/Privacy.svg" alt="خاص" className={styles.privacyIcon} />
                  <div>
                    <strong>خاص</strong>
                    <p>سيظهر تقييمك للمالك فقط</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className={styles.aiAnalysisSection}>
            <div className={styles.aiAnalysisHeader}>
              <img src="/icons/ai-analytics.svg" alt="ذكاء اصطناعي" className={styles.aiAnalysisHeaderIcon} />
              <h2 className={styles.aiAnalysisTitle}>تحليلات الذكاء الاصطناعي للتقييمات</h2>
            </div>
            
            <div className={styles.aiAnalysisCards}>
              <div className={styles.aiAnalysisCard}>
                <div className={styles.aiAnalysisCardHeader}>
                  <img src="/icons/thumbsUp.svg" alt="إيجابيات" className={styles.aiAnalysisCardIcon} />
                  <h3>أكثر المميزات إيجابية</h3>
                </div>
                <ul className={styles.aiAnalysisList}>
                  <li>✓ الموقع القريب من الخدمات</li>
                  <li>✓ جودة التشطيبات العالية</li>
                  <li>✓ الأمن والحراسة على مدار الساعة</li>
                  <li>✓ المساحات الواسعة والإضاءة الطبيعية</li>
                </ul>
              </div>

              <div className={styles.aiAnalysisCard}>
                <div className={styles.aiAnalysisCardHeader}>
                  <img src="/icons/thumbsDown.svg" alt="سلبيات" className={styles.aiAnalysisCardIcon} />
                  <h3>أكثر النقاط سلبية</h3>
                </div>
                <ul className={styles.aiAnalysisList}>
                  <li>✗ تأخر الاستجابة لطلبات الصيانة</li>
                  <li>✗ ضعف العزل الصوتي بين الوحدات</li>
                  <li>✗ مشاكل في نظام التكييف</li>
                  <li>✗ قلة مواقف السيارات للزوار</li>
                </ul>
              </div>

              <div className={styles.aiAnalysisCard}>
                <div className={styles.aiAnalysisCardHeader}>
                  <img src="/icons/smart-contracts.svg" alt="اتجاهات" className={styles.aiAnalysisCardIcon} />
                  <h3>اتجاهات التقييم</h3>
                </div>
                <div className={styles.trendsList}>
                  <div className={styles.trendItem}>
                    <span>التقييم العام</span>
                    <div className={styles.trendBar}>
                      <div className={styles.trendBarFill} style={{ width: '84%' }}></div>
                    </div>
                    <span className={styles.trendValue}>4.2/5</span>
                  </div>
                  <div className={styles.trendItem}>
                    <span>رضا المستأجرين</span>
                    <div className={styles.trendBar}>
                      <div className={styles.trendBarFill} style={{ width: '78%' }}></div>
                    </div>
                    <span className={styles.trendValue}>78%</span>
                  </div>
                  <div className={styles.trendItem}>
                    <span>التوصية للآخرين</span>
                    <div className={styles.trendBar}>
                      <div className={styles.trendBarFill} style={{ width: '82%' }}></div>
                    </div>
                    <span className={styles.trendValue}>82%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.recommendationsSection}>
              <div className={styles.recommendationsHeader}>
                <span className={styles.recommendationsIcon}>💡</span>
                <h3>توصيات ذكية للمالك</h3>
              </div>
              <ul className={styles.recommendationsList}>
                <li>→ تحسين نظام الاستجابة لطلبات الصيانة وتقليل وقت الانتظار</li>
                <li>→ التفكير في تحسين العزل الصوتي في الوحدات القادمة</li>
                <li>→ إجراء فحص دوري لأنظمة التكييف قبل فصل الصيف</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.submitSection}>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={submitting}
            >
              <img src="/icons/share.svg" alt="إرسال" className={styles.submitIcon} />
              {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
