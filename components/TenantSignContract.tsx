import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/TenantSignContract.module.css'

interface DraftContract {
  propertyId: string
  propertyName: string
  propertyAddress?: string
  ownerId: string
  ownerName?: string
  monthlyRent?: number
  startDate: string
  endDate: string
  paymentFrequency: 'monthly' | 'quarterly' | 'yearly' | string
  deposit?: string
  notes?: string
  createdAt?: string
}

interface PropertyInfo {
  id: string
  name?: string | null
  address?: string | null
  city?: string | null
  neighborhood?: string | null
  monthlyRent?: number | null
  price?: number | null
  insurance?: number | null
  ownerId: string
  owner?: {
    id: string
    first_name?: string | null
    last_name?: string | null
    email?: string | null
  } | null
}

interface TenantInfo {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  phoneNumber: string
}

const paymentFrequencyLabels: Record<string, string> = {
  monthly: 'شهري',
  quarterly: 'ربع سنوي',
  yearly: 'سنوي',
}

const formatDate = (value?: string) => {
  if (!value) return 'غير محدد'
  try {
    return new Date(value).toLocaleDateString('ar-SA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

const formatCurrency = (value?: number | null) => {
  if (value === undefined || value === null) return 'غير متوفر'
  return `${value.toLocaleString('ar-SA')} ر.س`
}

export default function TenantSignContract() {
  const router = useRouter()
  const { propertyId } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<DraftContract | null>(null)
  const [property, setProperty] = useState<PropertyInfo | null>(null)
  const [tenant, setTenant] = useState<TenantInfo | null>(null)
  const [signatureMethod, setSignatureMethod] = useState<'draw' | 'type'>('draw')
  const [signatureValue, setSignatureValue] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const frequencyLabel = useMemo(() => {
    if (!draft?.paymentFrequency) return 'غير محدد'
    return paymentFrequencyLabels[draft.paymentFrequency] || draft.paymentFrequency
  }, [draft])

  useEffect(() => {
    if (!router.isReady) return
    if (typeof window === 'undefined') return

    const initialise = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const userType = localStorage.getItem('userType')
        if (!userId || !(userType === 'tenant' || userType === 'مستأجر')) {
          router.replace('/login')
          return
        }

        const storedDraft = localStorage.getItem('draftContract')
        if (!storedDraft) {
          setError('لم يتم العثور على بيانات الحجز. يرجى العودة إلى صفحة العقار وإعادة المحاولة.')
          return
        }

        const parsedDraft: DraftContract = JSON.parse(storedDraft)
        const targetPropertyId =
          typeof propertyId === 'string' && propertyId.length > 0 ? propertyId : parsedDraft.propertyId

        setDraft(parsedDraft)
        setAdditionalNotes(parsedDraft.notes || '')

        const [propertyResponse, tenantResponse] = await Promise.all([
          fetch(`/api/properties/${targetPropertyId}`),
          fetch(`/api/tenants?userId=${userId}`),
        ])

        if (!propertyResponse.ok) {
          const errorData = await propertyResponse.json().catch(() => ({}))
          throw new Error(errorData.error || 'فشل في جلب بيانات العقار')
        }

        const propertyData: PropertyInfo = await propertyResponse.json()
        setProperty(propertyData)

        if (tenantResponse.status === 404) {
          // Create tenant record automatically from stored user profile
          const storedUser = localStorage.getItem('user')
          if (!storedUser) {
            throw new Error('لا يمكن إنشاء العقد بدون ملف مستأجر. يرجى تحديث بيانات حسابك أولاً.')
          }
          const userProfile = JSON.parse(storedUser) as {
            firstName?: string
            lastName?: string
            email?: string
            phone?: string
            nationalId?: string
          }

          if (!userProfile.phone) {
            throw new Error('لا يمكن إنشاء ملف المستأجر بدون رقم هاتف. يرجى تحديث بيانات حسابك.')
          }

          const createResponse = await fetch('/api/tenants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: userProfile.firstName || 'المستأجر',
              lastName: userProfile.lastName || '',
              email: userProfile.email,
              phoneNumber: userProfile.phone,
              nationalId: userProfile.nationalId,
              userId,
            }),
          })

          if (!createResponse.ok) {
            const createError = await createResponse.json().catch(() => ({}))
            throw new Error(createError.error || 'فشل في إنشاء ملف المستأجر.')
          }

          const createdTenant = await createResponse.json()
          setTenant({
            id: createdTenant.id,
            firstName: createdTenant.firstName,
            lastName: createdTenant.lastName,
            email: createdTenant.email,
            phoneNumber: createdTenant.phoneNumber,
          })
        } else if (tenantResponse.ok) {
          const tenantData = await tenantResponse.json()
          setTenant({
            id: tenantData.id,
            firstName: tenantData.firstName,
            lastName: tenantData.lastName,
            email: tenantData.email,
            phoneNumber: tenantData.phoneNumber,
          })
        } else {
          const tenantError = await tenantResponse.json().catch(() => ({}))
          throw new Error(tenantError.error || 'فشل في جلب بيانات المستأجر.')
        }
      } catch (err: any) {
        console.error('Error loading sign-contract data:', err)
        setError(err.message || 'حدث خطأ أثناء تحميل البيانات.')
      } finally {
        setLoading(false)
      }
    }

    initialise()
  }, [router, propertyId])

  const handleSaveDraft = () => {
    if (typeof window === 'undefined' || !draft) return
    const updatedDraft = {
      ...draft,
      notes: additionalNotes,
      signatureMethod,
      signatureValue,
      acknowledged,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('draftContract', JSON.stringify(updatedDraft))
    setSubmitSuccess('تم حفظ مسودة العقد بنجاح.')
    setTimeout(() => setSubmitSuccess(null), 2000)
  }

  const handleCompleteSigning = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft || !property || !tenant) {
      setSubmitError('بيانات العقد غير مكتملة. يرجى التحقق وإعادة المحاولة.')
      return
    }
    if (!acknowledged) {
      setSubmitError('يرجى الموافقة على استخدام التوقيع الإلكتروني قبل المتابعة.')
      return
    }
    if (!signatureValue.trim()) {
      setSubmitError('يرجى إدخال توقيعك الإلكتروني.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const monthlyRentValue =
        draft.monthlyRent ??
        (property.monthlyRent !== null && property.monthlyRent !== undefined ? property.monthlyRent : undefined) ??
        property.price ??
        0

      const depositValue =
        draft.deposit && draft.deposit !== ''
          ? draft.deposit
          : property.insurance !== null && property.insurance !== undefined
          ? property.insurance.toString()
          : undefined

      const combinedNotes = [
        draft.notes,
        additionalNotes,
        `دورية الدفع: ${frequencyLabel}`,
        `طريقة التوقيع: ${signatureMethod === 'draw' ? 'رسم التوقيع' : 'كتابة التوقيع'}`,
      ]
        .filter(Boolean)
        .join(' | ')

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          ownerId: property.ownerId,
          tenantId: tenant.id,
          tenantName: `${tenant.firstName} ${tenant.lastName}`.trim(),
          tenantEmail: tenant.email,
          tenantPhone: tenant.phoneNumber,
          type: 'إيجار سكني',
          startDate: draft.startDate,
          endDate: draft.endDate,
          monthlyRent: monthlyRentValue.toString(),
          deposit: depositValue,
          notes: combinedNotes ? `${combinedNotes} | التوقيع: ${signatureValue.trim()}` : `التوقيع: ${signatureValue.trim()}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'فشل في حفظ العقد.')
      }

      setSubmitSuccess('تم توقيع العقد وإرساله بنجاح! سيتم نقلك إلى سجل العقود.')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('draftContract')
      }
      setTimeout(() => {
        router.push('/tenant/lease-records')
      }, 1600)
    } catch (err: any) {
      console.error('Error completing contract:', err)
      setSubmitError(err.message || 'حدث خطأ أثناء إكمال التوقيع.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="sign-contract" />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>جاري تجهيز عقد الإيجار...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !draft || !property || !tenant) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="sign-contract" />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.errorState}>
              <h2>تعذر إكمال عملية التوقيع</h2>
              <p>{error || 'لم يتم العثور على البيانات المطلوبة لإكمال العقد.'}</p>
              <button className={styles.primaryBtn} onClick={() => router.push('/search-properties')}>
                العودة للبحث عن عقار
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const ownerDisplayName =
    property.owner && (property.owner.first_name || property.owner.last_name)
      ? `${property.owner.first_name || ''} ${property.owner.last_name || ''}`.trim()
      : 'شركة أملاك تك'

  return (
    <div className={styles.page}>
      <TenantNavigation currentPage="sign-contract" />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>توقيع عقد الإيجار</h1>
          
          <form id="signContractForm" className={styles.layout} onSubmit={handleCompleteSigning}>
            <aside className={styles.signatureCard}>
              <div className={styles.signatureHeader}>
                <h3>إضافة توقيعك</h3>
                <button type="button" className={styles.helpIcon} aria-label="مساعدة">?</button>
              </div>

              <div className={styles.identitySection}>
                <h4>تأكيد الهوية:</h4>
                <div className={styles.identityCard}>
                  <div className={styles.identityInfo}>
                    <div className={styles.identityText}>
                      <p className={styles.identityName}>{`${tenant.firstName} ${tenant.lastName}`.trim()}</p>
                      <p className={styles.identityEmail}>{tenant.email || 'بريد غير متوفر'}</p>
                    </div>
                    <div className={styles.userAvatar}>{tenant.firstName.charAt(0)}</div>
                  </div>
                  <div className={styles.verifyBadge}>تم التحقق</div>
                </div>
              </div>

              <div className={styles.signatureSection}>
                <h4>طريقة التوقيع:</h4>
                <div className={styles.signatureTabs}>
                  <button
                    type="button"
                    className={`${styles.signatureTab} ${signatureMethod === 'type' ? styles.activeTab : ''}`}
                    onClick={() => setSignatureMethod('type')}
                  >
                    كتابة
                  </button>
                  <button
                    type="button"
                    className={`${styles.signatureTab} ${signatureMethod === 'draw' ? styles.activeTab : ''}`}
                    onClick={() => setSignatureMethod('draw')}
                  >
                    رسم
                  </button>
                </div>

                <div className={styles.signatureAreaWrapper}>
                  {signatureMethod === 'type' ? (
                    <input
                      className={styles.signatureInput}
                      placeholder="اكتب توقيعك هنا"
                      value={signatureValue}
                      onChange={(event) => setSignatureValue(event.target.value)}
                    />
                  ) : (
                    <textarea
                      className={styles.signaturePad}
                      placeholder="قم بالرسم هنا"
                      value={signatureValue}
                      onChange={(event) => setSignatureValue(event.target.value)}
                      rows={6}
                    />
                  )}
                  {signatureMethod === 'draw' && signatureValue && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => setSignatureValue('')}
                    >
                      🗑️ مسح
                    </button>
                  )}
                </div>

                <div className={styles.checkboxRow}>
                  <input
                    id="acknowledge"
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(event) => setAcknowledged(event.target.checked)}
                  />
                  <label htmlFor="acknowledge">
                    أنا. {tenant.firstName} {tenant.lastName} ، أوافق على استخدام توقيعي الإلكتروني لتوقيع هذا المستند وأقر بأنه ملزم قانونياً. 🔒
                  </label>
                </div>

                <button 
                  type="submit" 
                  className={styles.signContractBtn}
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault()
                    if (acknowledged && signatureValue.trim()) {
                      handleCompleteSigning(e as any)
                    } else {
                      setSubmitError('يرجى إدخال التوقيع والموافقة على الشروط أولاً.')
                    }
                  }}
                >
                  ✏️ توقيع العقد
                </button>
              </div>

              <div className={styles.featuresSection}>
                <div className={styles.featuresHeader}>
                  <span className={styles.featuresIcon}>💡</span>
                  <h4>مميزات التوقيع الإلكتروني</h4>
                </div>
                <ul className={styles.featuresList}>
                  <li>✓ توثيق آمن بتقنية التشفير المتقدمة</li>
                  <li>✓ معتمد قانونياً وفق أنظمة المملكة</li>
                  <li>✓ حفظ تلقائي للعقود في حسابك</li>
                </ul>
              </div>

              <div className={styles.notesSection}>
                <label>ملاحظات إضافية</label>
                <textarea
                  placeholder="يمكنك إضافة أي شروط أو ملاحظات مهمة قبل الإرسال."
                  rows={4}
                  value={additionalNotes}
                  onChange={(event) => setAdditionalNotes(event.target.value)}
                />
              </div>

              {submitError && <div className={styles.errorAlert}>{submitError}</div>}
              {submitSuccess && <div className={styles.successAlert}>{submitSuccess}</div>}
            </aside>

            <section className={styles.contractBox}>
              <div className={styles.statusBanner}>
                <div className={styles.statusBannerIcon}>🤖</div>
                <p>تم التحقق من جميع بنود العقد بواسطة الذكاء الاصطناعي وهو جاهز للتوقيع الآن.</p>
              </div>

              <div className={styles.contractContent}>
                <div className={styles.cardHeader}>
                  <h2>عقد إيجار سكني</h2>
                  <p className={styles.agreementDate}>تم الاتفاق في يوم الأربعاء الموافق {formatDate(draft.createdAt || new Date().toISOString())} م بين كل من:</p>
                </div>

                <div className={styles.contractDetails}>
                  <div className={styles.contractDetailRow}>
                    <span className={styles.contractDetailLabel}>الطرف الأول (المؤجر):</span>
                    <span className={styles.contractDetailValue}>{ownerDisplayName}، سجل تجاري رقم: {property.owner?.email || '1234567890'}</span>
                  </div>
                  <div className={styles.contractDetailRow}>
                    <span className={styles.contractDetailLabel}>الطرف الثاني (المستأجر):</span>
                    <span className={styles.contractDetailValue}>{tenant.firstName} {tenant.lastName}، هوية رقم: {tenant.phoneNumber}</span>
                  </div>
                  <div className={styles.contractDetailRow}>
                    <span className={styles.contractDetailLabel}>بيانات العقار:</span>
                    <span className={styles.contractDetailValue}>{draft.propertyName || property.name || 'شقة سكنية'} - {draft.propertyAddress || `${property.neighborhood || ''}, ${property.city || ''}, المملكة العربية السعودية`}</span>
                  </div>
                  <div className={styles.contractDetailRow}>
                    <span className={styles.contractDetailLabel}>مدة الإيجار:</span>
                    <span className={styles.contractDetailValue}>سنة ميلادية تبدأ من تاريخ {formatDate(draft.startDate)} م وتنتهي في {formatDate(draft.endDate)} م</span>
                  </div>
                  <div className={styles.contractDetailRow}>
                    <span className={styles.contractDetailLabel}>قيمة الإيجار:</span>
                    <span className={styles.contractDetailValue}>{formatCurrency(draft.monthlyRent ?? property.monthlyRent ?? property.price)} تدفع على أقساط شهرية</span>
                  </div>
                </div>

                <div className={styles.signaturesSection}>
                  <button type="button" className={styles.signaturesButton}>التوقيعات</button>
                  <div className={styles.signatures}>
                    <div className={styles.signatureBox}>
                      <span className={styles.detailLabel}>توقيع الطرف الأول (المؤجر)</span>
                      <div className={styles.signaturePlaceholder}>
                        <span>شركة أملاك تك</span>
                        <small>تم التوقيع: {formatDate(new Date().toISOString())}</small>
                      </div>
                    </div>
                    <div className={styles.signatureBox}>
                      <span className={styles.detailLabel}>توقيع الطرف الثاني (المستأجر)</span>
                      <div className={`${styles.signaturePlaceholder} ${styles.waitingSignature}`}>
                        <span>{signatureValue ? signatureValue : 'انقر للتوقيع'}</span>
                        <small>{signatureValue ? 'تم إدخال التوقيع' : 'بانتظار التوقيع..'}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {submitError && <div className={styles.errorAlertMobile}>{submitError}</div>}
              {submitSuccess && <div className={styles.successAlertMobile}>{submitSuccess}</div>}
            </section>
          </form>

          <div className={styles.bottomActions}>
            <button type="submit" form="signContractForm" className={styles.primaryBtn} disabled={isSubmitting}>
              ✓ {isSubmitting ? 'جاري التوقيع...' : 'إكمال التوقيع'}
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={handleSaveDraft}>
              حفظ كمسودة
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => router.back()}>
              ← العودة للمراجعة
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function depositValueLabel(draft: DraftContract, property: PropertyInfo) {
  if (draft.deposit && draft.deposit !== '') {
    const numeric = Number(draft.deposit)
    return Number.isNaN(numeric) ? draft.deposit : formatCurrency(numeric)
  }
  if (property.insurance !== null && property.insurance !== undefined) {
    return formatCurrency(property.insurance)
  }
  return 'غير محدد'
}

