import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/TenantMaintenanceRequest.module.css'

interface Unit {
  id: string
  unitNumber: string
  propertyId: string
  property?: {
    id: string
    name: string
    address?: string
  }
}

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
  } | null
  status?: string
}

const PROBLEM_TYPES = [
  { id: 'plumbing', label: 'سباكة', icon: '/icons/plumber.svg' },
  { id: 'doors-windows', label: 'أبواب ونوافذ', icon: '/icons/doors.svg' },
  { id: 'ac', label: 'تكييف', icon: '/icons/conditioning.svg' },
  { id: 'electricity', label: 'كهرباء', icon: '/icons/electracity.svg' },
  { id: 'pest-control', label: 'مكافحة حشرات', icon: '/icons/PestControl.svg' },
  { id: 'other', label: 'أخرى', icon: '/icons/other.svg' },
]

export default function TenantMaintenanceRequest() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<string>('')
  const [problemType, setProblemType] = useState<string>('')
  const [problemDescription, setProblemDescription] = useState('')
  const [priority, setPriority] = useState<'normal' | 'medium' | 'urgent'>('normal')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
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
      
      // Fetch tenant contracts to get units - only active contracts
      const contractsResponse = await fetch(`/api/contracts?tenantUserId=${userId}&status=نشط`)
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setContracts(contractsData)
        
        // Extract unique units from active contracts only
        const unitsMap = new Map<string, Unit>()
        contractsData.forEach((contract: Contract) => {
          // Only include contracts with units and properties
          if (contract.unitId && contract.unit && contract.property && contract.status === 'نشط') {
            const unitKey = contract.unitId
            if (!unitsMap.has(unitKey)) {
              unitsMap.set(unitKey, {
                id: contract.unit.id,
                unitNumber: contract.unit.unitNumber || '',
                propertyId: contract.propertyId,
                property: {
                  id: contract.property.id,
                  name: contract.property.name || 'عقار',
                  address: contract.property.address || '',
                },
              })
            }
          }
        })
        setUnits(Array.from(unitsMap.values()))
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error)
    } finally {
      setLoading(false)
    }
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
            analyzeWithAI([...photos, ...newPhotos])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const analyzeWithAI = async (photoFiles: File[]) => {
    if (!problemDescription && photoFiles.length === 0) {
      setAiAnalysis('')
      return
    }

    // Simulate AI analysis - in production, this would call an actual AI service
    setTimeout(() => {
      if (problemType === 'plumbing' || problemDescription.includes('مياه') || problemDescription.includes('سباكة')) {
        setAiAnalysis('بناء على وصفك والصور المرفقة، يبدو أن المشكلة متعلقة بتسرب مياه في الحمام. ننصح بتحديد موعد مع فني السباكة في أقرب وقت ممكن لتجنب أضرار إضافية.')
      } else if (problemType === 'electricity' || problemDescription.includes('كهرباء')) {
        setAiAnalysis('بناء على وصفك، يبدو أن المشكلة متعلقة بالكهرباء. ننصح بتحديد موعد مع فني الكهرباء في أقرب وقت ممكن.')
      } else if (problemType === 'ac' || problemDescription.includes('تكييف')) {
        setAiAnalysis('بناء على وصفك، يبدو أن المشكلة متعلقة بنظام التكييف. ننصح بتحديد موعد مع فني التكييف.')
      } else {
        setAiAnalysis('بناء على وصفك والصور المرفقة، سيتم تحليل المشكلة وتحديد الفني المناسب لحلها.')
      }
    }, 1000)
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoPreviews(newPreviews)
    analyzeWithAI(newPhotos)
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

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!selectedUnit) {
        alert('يرجى اختيار الوحدة السكنية')
        return
      }
      if (!problemType) {
        alert('يرجى اختيار نوع المشكلة')
        return
      }
      if (!problemDescription.trim()) {
        alert('يرجى إدخال وصف المشكلة')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Get property ID from selected unit
      const unit = units.find(u => u.id === selectedUnit)
      if (!unit) {
        alert('خطأ في اختيار الوحدة')
        return
      }

      // Fetch property to get ownerId
      const propertyResponse = await fetch(`/api/properties/${unit.propertyId}`)
      if (!propertyResponse.ok) {
        alert('خطأ في جلب معلومات العقار')
        return
      }
      const property = await propertyResponse.json()

      // Get tenant info for contact details
      const tenantResponse = await fetch(`/api/tenants?userId=${userId}`)
      let contactName = ''
      let contactPhone = ''
      if (tenantResponse.ok) {
        const tenant = await tenantResponse.json()
        contactName = `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim()
        contactPhone = tenant.phoneNumber || ''
      }

      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: unit.propertyId,
          ownerId: property.ownerId,
          unit: unit.unitNumber,
          type: PROBLEM_TYPES.find(t => t.id === problemType)?.label || problemType,
          priority: priority,
          problemDescription: problemDescription,
          contactName: contactName,
          contactPhone: contactPhone,
        }),
      })

      if (response.ok) {
        alert('تم إرسال طلب الصيانة بنجاح')
        router.push('/tenant/lease-records')
      } else {
        const error = await response.json()
        alert(error.error || 'فشل إرسال طلب الصيانة')
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error)
      alert('حدث خطأ أثناء إرسال طلب الصيانة')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (problemDescription || photos.length > 0) {
      analyzeWithAI(photos)
    }
  }, [problemDescription, problemType])

  if (loading) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="maintenance-request" />
        <div className={styles.loading}>جاري التحميل...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <TenantNavigation currentPage="maintenance-request" />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>طلب صيانة جديد</h1>
            <p className={styles.pageSubtitle}>
              يرجى ملء النموذج أدناه لتقديم طلب صيانة للوحدة الخاصة بك
            </p>
          </div>

          {/* Steps Indicator */}
          <div className={styles.stepsIndicator}>
            <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLabel}>تفاصيل المشكلة</div>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLabel}>تحديد الموعد</div>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLabel}>المراجعة والتأكيد</div>
            </div>
          </div>

          {/* Form Content */}
          <div className={styles.formContainer}>
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                {/* Residential Unit */}
                <div className={styles.formSection}>
                  <label className={styles.label}>الوحدة السكنية</label>
                  {units.length === 0 ? (
                    <div className={styles.noUnitsMessage}>
                      <p>لا توجد وحدات سكنية نشطة في عقد الإيجار الخاص بك.</p>
                      <p className={styles.noUnitsSubtext}>يرجى التأكد من وجود عقد إيجار نشط.</p>
                    </div>
                  ) : (
                    <>
                      <select
                        className={styles.select}
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                      >
                        <option value="">اختر الوحدة السكنية</option>
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.property?.name || 'عقار'} - الوحدة {unit.unitNumber}
                            {unit.property?.address ? ` (${unit.property.address})` : ''}
                          </option>
                        ))}
                      </select>
                      {selectedUnit && (
                        <div className={styles.selectedUnitInfo}>
                          <span>✓ تم اختيار الوحدة</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Problem Type */}
                <div className={styles.formSection}>
                  <label className={styles.label}>نوع المشكلة</label>
                  <div className={styles.problemTypeGrid}>
                    {PROBLEM_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className={`${styles.problemTypeCard} ${problemType === type.id ? styles.selected : ''}`}
                        onClick={() => setProblemType(type.id)}
                      >
                        <img src={type.icon} alt={type.label} className={styles.problemTypeIcon} />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem Description */}
                <div className={styles.formSection}>
                  <label className={styles.label}>وصف المشكلة</label>
                  <textarea
                    className={styles.textarea}
                    rows={6}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="يرجى وصف المشكلة بالتفصيل لمساعدتنا على فهم احتياجاتك بشكل أفضل..."
                  />
                  <div className={styles.aiNote}>
                    <span className={styles.aiNoteIcon}>🤖</span>
                    <span>سيقوم نظام الذكاء الاصطناعي بتحليل وصفك لتحديد الفني المناسب لحل المشكلة.</span>
                  </div>
                </div>

                {/* Priority Level */}
                <div className={styles.formSection}>
                  <label className={styles.label}>مستوى الأولوية</label>
                  <div className={styles.priorityOptions}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="priority"
                        value="normal"
                        checked={priority === 'normal'}
                        onChange={(e) => setPriority(e.target.value as 'normal')}
                      />
                      <span>عادي</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="priority"
                        value="medium"
                        checked={priority === 'medium'}
                        onChange={(e) => setPriority(e.target.value as 'medium')}
                      />
                      <span>متوسط</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="priority"
                        value="urgent"
                        checked={priority === 'urgent'}
                        onChange={(e) => setPriority(e.target.value as 'urgent')}
                      />
                      <span>عاجل</span>
                      {priority === 'urgent' && (
                        <span className={styles.urgentBadge}>رسوم إضافية</span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Attach Photos */}
                <div className={styles.formSection}>
                  <label className={styles.label}>إرفاق صور (اختياري)</label>
                  <div
                    className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className={styles.uploadContent}>
                      <div className={styles.uploadIcon}>☁️</div>
                      <p className={styles.uploadText}>اسحب وأفلت الصور هنا أو</p>
                      <button
                        type="button"
                        className={styles.browseButton}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span>📁</span>
                        تصفح الملفات
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
                        يمكنك رفع حتى 5 صور (الحد الأقصى: 5 ميجابايت لكل صورة)
                      </p>
                    </div>
                  </div>

                  {/* Photo Previews */}
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

                  {/* AI Analysis */}
                  {aiAnalysis && (
                    <div className={styles.aiAnalysis}>
                      <div className={styles.aiAnalysisIcon}>🤖</div>
                      <div className={styles.aiAnalysisContent}>
                        <h4 className={styles.aiAnalysisTitle}>تحليل الذكاء الاصطناعي</h4>
                        <p className={styles.aiAnalysisText}>{aiAnalysis}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.continueButton}
                    onClick={handleContinue}
                  >
                    <span>←</span>
                    متابعة لتحديد الموعد
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => router.back()}
                  >
                    إلغاء
                  </button>
                </div>

                {/* Help Section */}
                <div className={styles.helpSection}>
                  <h3 className={styles.helpTitle}>
                    <span>❓</span>
                    هل تحتاج إلى مساعدة؟
                  </h3>
                  <div className={styles.helpCards}>
                    <div className={styles.helpCard}>
                      <div className={styles.helpCardIcon}>
                        <img src="/icons/explainVideo.svg" alt="فيديو توضيحي" />
                      </div>
                      <h4>فيديو توضيحي</h4>
                      <p>شاهد كيفية تقديم طلب صيانة بالخطوات</p>
                    </div>
                    <div className={styles.helpCard}>
                      <div className={styles.helpCardIcon}>
                        <img src="/icons/CustomerService.svg" alt="تواصل معنا" />
                      </div>
                      <h4>تواصل معنا</h4>
                      <p>فريق الدعم متاح على مدار الساعة لمساعدتك</p>
                    </div>
                    <div className={styles.helpCard}>
                      <div className={styles.helpCardIcon}>
                        <img src="/icons/user%20guide.svg" alt="دليل المستخدم" />
                      </div>
                      <h4>دليل المستخدم</h4>
                      <p>اطلع على دليل استخدام نظام طلبات الصيانة</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>تحديد الموعد</h2>
                <p className={styles.stepDescription}>سيتم إضافة محتوى تحديد الموعد هنا</p>
                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.continueButton}
                    onClick={handleContinue}
                  >
                    <span>←</span>
                    متابعة
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setCurrentStep(1)}
                  >
                    رجوع
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>المراجعة والتأكيد</h2>
                <div className={styles.reviewSection}>
                  <div className={styles.reviewItem}>
                    <strong>الوحدة السكنية:</strong>
                    <span>{units.find(u => u.id === selectedUnit)?.unitNumber || '-'}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>نوع المشكلة:</strong>
                    <span>{PROBLEM_TYPES.find(t => t.id === problemType)?.label || '-'}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>الوصف:</strong>
                    <span>{problemDescription || '-'}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>الأولوية:</strong>
                    <span>
                      {priority === 'normal' ? 'عادي' : priority === 'medium' ? 'متوسط' : 'عاجل'}
                    </span>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.continueButton}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'جاري الإرسال...' : 'تأكيد وإرسال'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setCurrentStep(2)}
                  >
                    رجوع
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

