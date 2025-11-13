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
          <form className={styles.layout} onSubmit={handleCompleteSigning}>
            <section className={styles.content}>
              <h1 className={styles.pageTitle}>توقيع عقد الإيجار</h1>
              
              <div className={styles.statusBanner}>
                <div className={styles.statusBannerIcon}>🤖</div>
                <p>تم التحقق من جميع بنود العقد بواسطة الذكاء الاصطناعي وهو جاهز للتوقيع الآن.</p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>عقد إيجار سكني</h2>
                  <p className={styles.agreementDate}>تم الاتفاق في يوم الأربعاء الموافق {formatDate(draft.createdAt || new Date().toISOString())} م بين كل من:</p>
                </div>

                <div className={styles.contractMeta}>
                  <span>رقم العقد: سيتم توليده آلياً</span>
                  <span>مدة الإيجار: {formatDate(draft.startDate)} - {formatDate(draft.endDate)}</span>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>الطرف الأول (المالك)</span>
                    <p className={styles.detailValue}>{ownerDisplayName}</p>
                    <span className={styles.detailHint}>{property.owner?.email || 'البريد سيتم مشاركته بعد التوقيع'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>الطرف الثاني (المستأجر)</span>
                    <p className={styles.detailValue}>
                      {tenant.firstName} {tenant.lastName}
                    </p>
                    <span className={styles.detailHint}>{tenant.phoneNumber}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>بيانات العقار</span>
                    <p className={styles.detailValue}>{draft.propertyName || property.type || 'شقة'}</p>
                    <span className={styles.detailHint}>
                      {draft.propertyAddress || `${property.neighborhood || ''}, ${property.city || ''}, المملكة العربية السعودية`}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>قيمة الإيجار</span>
                    <p className={styles.detailValue}>{formatCurrency(draft.monthlyRent ?? property.monthlyRent ?? property.price)}</p>
                    <span className={styles.detailHint}>دورية الدفع: {frequencyLabel}</span>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h3>التواقيع</h3>
                <div className={styles.signatures}>
                  <div className={styles.signatureBox}>
                    <span className={styles.detailLabel}>الطرف الأول (المالك)</span>
                    <div className={styles.signaturePlaceholder}>
                      <span>شركة أملاك تك</span>
                      <small>تم التوقيع في {formatDate(new Date().toISOString())}</small>
                    </div>
                  </div>
                  <div className={styles.signatureBox}>
                    <span className={styles.detailLabel}>الطرف الثاني (المستأجر)</span>
                    <div className={`${styles.signaturePlaceholder} ${styles.waitingSignature}`}>
                      <span>{signatureValue ? signatureValue : 'في انتظار توقيعك'}</span>
                      <small>{signatureValue ? 'تم إدخال التوقيع' : 'الرجاء إدخال التوقيع أعلاه'}</small>
                    </div>
                  </div>
                </div>
              </div>

              {submitError && <div className={styles.errorAlertMobile}>{submitError}</div>}
              {submitSuccess && <div className={styles.successAlertMobile}>{submitSuccess}</div>}
            </section>

            <aside className={styles.sidebar}>
              <div className={styles.userCard}>
                <div className={styles.userAvatar}>{tenant.firstName.charAt(0)}</div>
                <div>
                  <h3>{`${tenant.firstName} ${tenant.lastName}`.trim()}</h3>
                  <span>{tenant.email || 'بريد غير متوفر'}</span>
                </div>
                <div className={styles.verifyBadge}>تم التحقق ✅</div>
              </div>

              <div className={styles.signatureSection}>
                <div className={styles.signatureTabs}>
                  <button
                    type="button"
                    className={`${styles.signatureTab} ${signatureMethod === 'draw' ? styles.activeTab : ''}`}
                    onClick={() => setSignatureMethod('draw')}
                  >
                    رسم
                  </button>
                  <button
                    type="button"
                    className={`${styles.signatureTab} ${signatureMethod === 'type' ? styles.activeTab : ''}`}
                    onClick={() => setSignatureMethod('type')}
                  >
                    كتابة
                  </button>
                </div>

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
                    placeholder="منطقة التوقيع - سيتم حفظ توقيعك الإلكتروني"
                    value={signatureValue}
                    onChange={(event) => setSignatureValue(event.target.value)}
                    rows={4}
                  />
                )}

                <div className={styles.checkboxRow}>
                  <input
                    id="acknowledge"
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(event) => setAcknowledged(event.target.checked)}
                  />
                  <label htmlFor="acknowledge">
                    أقر أنا {tenant.firstName} {tenant.lastName} باستخدام التوقيع الإلكتروني لإبرام هذا العقد، وأفهم أنه ملزم
                    قانونياً.
                  </label>
                </div>
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

              <div className={styles.sidebarActions}>
                <button type="button" className={styles.secondaryBtn} onClick={handleSaveDraft}>
                  حفظ كمسودة
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'جاري التوقيع...' : 'إكمال التوقيع'}
                </button>
              </div>

              {submitError && <div className={styles.errorAlert}>{submitError}</div>}
              {submitSuccess && <div className={styles.successAlert}>{submitSuccess}</div>}
            </aside>
          </form>
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

