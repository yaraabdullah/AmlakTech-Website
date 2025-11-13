import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/TenantLeaseRecords.module.css'

interface PaymentRecord {
  id: string
  amount: number
  dueDate: string
  paidDate?: string | null
  status: string
  paymentMethod?: string | null
  notes?: string | null
  contractId?: string | null
}

interface ContractRecord {
  id: string
  propertyId: string
  unitId?: string | null
  ownerId: string
  tenantId?: string | null
  tenantName?: string | null
  type: string
  status: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit?: number | null
  notes?: string | null
  property?: {
    id: string
    name?: string | null
    address?: string | null
    city?: string | null
    neighborhood?: string | null
  } | null
  unit?: {
    id: string
    unitNumber?: string | null
  } | null
  payments?: PaymentRecord[]
  createdAt?: string
  updatedAt?: string
}

interface TenantProfile {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  phoneNumber: string
  status: string
  userId?: string | null
  contracts?: ContractRecord[]
  user?: {
    lastLogin?: string | null
  } | null
}

const formatCurrency = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—'
  }
  return `${value.toLocaleString('ar-SA')} ر.س`
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    const day = date.toLocaleDateString('ar-SA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return day
  } catch {
    return '—'
  }
}

const formatLastLogin = (value: string) => {
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    const day = date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const time = date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    return `${day}. ${time}`
  } catch {
    return '—'
  }
}

const daysBetween = (from?: string | null, to?: string | null) => {
  if (!from || !to) return null
  const start = new Date(from)
  const end = new Date(to)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  const diffMs = end.getTime() - start.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

const daysFromToday = (target?: string | null) => {
  if (!target) return null
  const now = new Date()
  const date = new Date(target)
  if (Number.isNaN(date.getTime())) return null
  const diffMs = date.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'مدفوعة':
    case 'مدفوع':
      return styles.badgePaid
    case 'متأخرة':
    case 'متأخر':
      return styles.badgeOverdue
    case 'مستحقة':
    default:
      return styles.badgeDue
  }
}

const normalizeStatusLabel = (status: string) => {
  if (!status) return 'غير محدد'
  if (status === 'مدفوع') return 'مدفوعة'
  if (status === 'متأخر') return 'متأخرة'
  return status
}

export default function TenantLeaseRecords() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tenant, setTenant] = useState<TenantProfile | null>(null)
  const [contracts, setContracts] = useState<ContractRecord[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedUserId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')

    if (!storedUserId || !(userType === 'tenant' || userType === 'مستأجر')) {
      router.replace('/login')
      return
    }

    const fetchTenantData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/tenants?userId=${storedUserId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('لم يتم العثور على بيانات المستأجر الخاصة بك.')
            setTenant(null)
            setContracts([])
            return
          }

          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.error || 'فشل في جلب بيانات المستأجر')
        }

        const tenantData: TenantProfile = await response.json()
        setTenant(tenantData)
        setContracts(Array.isArray(tenantData.contracts) ? tenantData.contracts : [])
      } catch (err: any) {
        console.error('Error fetching tenant lease records:', err)
        setError(err.message || 'حدث خطأ غير متوقع')
      } finally {
        setLoading(false)
      }
    }

    fetchTenantData()
  }, [router])

  const activeContract = useMemo(() => {
    if (!contracts.length) return null
    const now = new Date()
    const active = contracts
      .filter((contract) => {
        if (!contract.startDate || !contract.endDate) return false
        const start = new Date(contract.startDate)
        const end = new Date(contract.endDate)
        return (
          contract.status === 'نشط' &&
          !Number.isNaN(start.getTime()) &&
          !Number.isNaN(end.getTime()) &&
          start <= now &&
          end >= now
        )
      })
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

    if (active.length > 0) return active[0]

    // fallback to the most recent contract if none active
    return contracts
      .slice()
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
  }, [contracts])

  const previousContracts = useMemo(() => {
    if (!contracts.length) return []
    if (!activeContract) return contracts.slice(1)
    return contracts.filter((contract) => contract.id !== activeContract.id)
  }, [contracts, activeContract])

  const payments = useMemo(() => {
    if (!activeContract?.payments) return []
    return activeContract.payments
      .slice()
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  }, [activeContract])

  const nextPayment = useMemo(() => {
    if (!payments.length) return null
    const upcoming = payments
      .slice()
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .find((payment) => payment.status !== 'مدفوعة' && payment.status !== 'مدفوع')
    return upcoming || null
  }, [payments])

  const totalPaid = useMemo(() => {
    if (!payments.length) return 0
    return payments
      .filter((payment) => payment.status === 'مدفوعة' || payment.status === 'مدفوع')
      .reduce((sum, payment) => sum + (payment.amount ?? 0), 0)
  }, [payments])

  const remainingDays = activeContract ? daysFromToday(activeContract.endDate) : null
  const leaseDurationDays = activeContract
    ? daysBetween(activeContract.startDate, activeContract.endDate)
    : null

  if (loading) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="lease-records" />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>جاري تحميل بيانات العقود...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="lease-records" />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.errorState}>
              <h2>حدث خطأ</h2>
              <p>{error}</p>
              <button className={styles.primaryButton} onClick={() => router.reload()}>
                إعادة المحاولة
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className={styles.page}>
        <TenantNavigation currentPage="lease-records" />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.emptyState}>
              <h2>لم يتم العثور على بيانات المستأجر</h2>
              <p>يرجى التواصل مع الدعم للتأكد من ربط حسابك بالعقود الخاصة بك.</p>
              <button className={styles.primaryButton} onClick={() => router.push('/contact')}>
                تواصل مع الدعم
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <TenantNavigation currentPage="lease-records" />
      <main className={styles.main}>
        <div className={styles.container} dir="rtl">
          <section className={styles.greetingSection}>
            <div className={styles.greetingContent}>
              <div className={styles.greetingLeft}>
                <button className={styles.aiAssistantButton}>
                  <span>مساعد أملاك الذكي</span>
                  <span className={styles.robotIcon}>🤖</span>
                </button>
              </div>
              <div className={styles.greetingRight}>
                <div className={styles.greetingText}>
                  <span className={styles.welcomeEmoji}>👋</span>
                  <h1 className={styles.greetingTitle}>
                    مرحباً، {tenant.firstName} {tenant.lastName}
                  </h1>
                  {tenant.user?.lastLogin && (
                    <p className={styles.lastLogin}>
                      آخر تسجيل دخول: {formatLastLogin(tenant.user.lastLogin)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {activeContract ? (
            <>
              <section className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricIcon} aria-hidden="true">
                      🏠
                    </span>
                    <span className={styles.metricLabel}>العقد الحالي</span>
                  </div>
                  <div className={styles.metricValue}>{activeContract.property?.name || 'غير مسمى'}</div>
                  <div className={styles.metricMeta}>
                    <span>{activeContract.property?.city || ''}</span>
                    <span>•</span>
                    <span>{formatDate(activeContract.startDate)} - {formatDate(activeContract.endDate)}</span>
                  </div>
                  {remainingDays !== null && remainingDays >= 0 && (
                    <div className={styles.metricTag}>
                      متبقي {remainingDays} يوم
                    </div>
                  )}
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricIcon} aria-hidden="true">
                      💳
                    </span>
                    <span className={styles.metricLabel}>الدفع القادمة</span>
                  </div>
                  <div className={styles.metricValue}>
                    {nextPayment ? formatCurrency(nextPayment.amount) : 'لا يوجد دفعات مستحقة'}
                  </div>
                  <div className={styles.metricMeta}>
                    {nextPayment ? (
                      <>
                        <span>{formatDate(nextPayment.dueDate)}</span>
                        <span>•</span>
                        <span>{normalizeStatusLabel(nextPayment.status)}</span>
                      </>
                    ) : (
                      <span>لقد قمت بسداد جميع الدفعات الحالية</span>
                    )}
                  </div>
                  {nextPayment && (
                    <div className={`${styles.metricTag} ${styles.metricTagWarning}`}>
                      {(() => {
                        const daysUntil = daysFromToday(nextPayment.dueDate)
                        if (daysUntil === null) return '—'
                        if (daysUntil < 0) return `متأخرة ${Math.abs(daysUntil)} يوم`
                        if (daysUntil === 0) return 'تستحق اليوم'
                        return `متبقي ${daysUntil} يوم`
                      })()}
                    </div>
                  )}
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricIcon} aria-hidden="true">
                      📊
                    </span>
                    <span className={styles.metricLabel}>إجمالي المدفوعات</span>
                  </div>
                  <div className={styles.metricValue}>{formatCurrency(totalPaid)}</div>
                  <div className={styles.metricMeta}>
                    المبلغ المدفوع منذ بداية العقد
                  </div>
                  <div className={`${styles.metricTag} ${styles.metricTagSuccess}`}>
                    الإيجار الشهري {formatCurrency(activeContract.monthlyRent)}
                  </div>
                </div>
              </section>

              <section className={styles.contractOverview}>
                <div className={styles.contractCard}>
                  <div className={styles.contractCardHeader}>
                    <div>
                      <h2>تفاصيل العقد الحالي</h2>
                      <p>تابع أهم معلومات عقد الإيجار الحالي الخاص بك</p>
                    </div>
                    <button className={styles.secondaryButton}>تحميل العقد</button>
                  </div>

                  <div className={styles.contractInfoGrid}>
                    <div>
                      <span className={styles.infoLabel}>العقار</span>
                      <p className={styles.infoValue}>
                        {activeContract.property?.name || 'غير مسمى'}{' '}
                        {activeContract.unit?.unitNumber ? `- وحدة ${activeContract.unit.unitNumber}` : ''}
                      </p>
                      <span className={styles.infoHint}>{activeContract.property?.address || 'العنوان غير متوفر'}</span>
                    </div>
                    <div>
                      <span className={styles.infoLabel}>نوع العقد</span>
                      <p className={styles.infoValue}>{activeContract.type || 'غير محدد'}</p>
                      <span className={styles.infoHint}>الحالة: {activeContract.status}</span>
                    </div>
                    <div>
                      <span className={styles.infoLabel}>مدة العقد</span>
                      <p className={styles.infoValue}>
                        {formatDate(activeContract.startDate)} - {formatDate(activeContract.endDate)}
                      </p>
                      <span className={styles.infoHint}>
                        {leaseDurationDays !== null ? `${leaseDurationDays} يوم` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className={styles.infoLabel}>قيمة الإيجار</span>
                      <p className={styles.infoValue}>{formatCurrency(activeContract.monthlyRent)} / شهر</p>
                      <span className={styles.infoHint}>التأمين: {formatCurrency(activeContract.deposit)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.keyDatesCard}>
                  <h3>تواريخ مهمة</h3>
                  <ul>
                    <li>
                      <div>
                        <span className={styles.infoLabel}>تاريخ بداية العقد</span>
                        <p>{formatDate(activeContract.startDate)}</p>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className={styles.infoLabel}>تاريخ نهاية العقد</span>
                        <p>{formatDate(activeContract.endDate)}</p>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className={styles.infoLabel}>موعد التجديد المقترح</span>
                        <p>
                          {activeContract.endDate
                            ? formatDate(
                                new Date(new Date(activeContract.endDate).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
                              )
                            : '—'}
                        </p>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className={styles.infoLabel}>موعد الدفع الشهري</span>
                        <p>{nextPayment ? formatDate(nextPayment.dueDate) : 'اليوم الأول من كل شهر'}</p>
                      </div>
                    </li>
                  </ul>

                  <div className={styles.contractConditions}>
                    <h4>شروط العقد</h4>
                    <ul>
                      <li>مدة العقد 12 شهر قابلة للتجديد</li>
                      <li>طريقة الدفع تحويل بنكي</li>
                      <li>يشمل الإيجار رسوم الخدمات الأساسية</li>
                      <li>يتم خصم التأمين عند وجود تلفيات</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className={styles.paymentsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2>سجل المدفوعات</h2>
                    <p>تابع جميع الدفعات المتعلقة بهذا العقد</p>
                  </div>
                  <div className={styles.filters}>
                    <button className={styles.filterButton}>تصدير</button>
                    <button className={styles.filterButton}>تصفية</button>
                  </div>
                </div>

                {payments.length ? (
                  <div className={styles.tableWrapper}>
                    <table className={styles.paymentsTable}>
                      <thead>
                        <tr>
                          <th>رقم الدفعة</th>
                          <th>التاريخ</th>
                          <th>النوع</th>
                          <th>طريقة الدفع</th>
                          <th>المبلغ</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, index) => (
                          <tr key={payment.id}>
                            <td>{`#INV-${index + 1}`}</td>
                            <td>{formatDate(payment.dueDate)}</td>
                            <td>إيجار شهري</td>
                            <td>{payment.paymentMethod || 'تحويل بنكي'}</td>
                            <td>{formatCurrency(payment.amount)}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getPaymentStatusBadge(payment.status)}`}>
                                {normalizeStatusLabel(payment.status)}
                              </span>
                            </td>
                            <td>
                              <button className={styles.linkButton}>عرض الإيصال</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <h3>لا يوجد سجلات مدفوعات بعد</h3>
                    <p>عند إضافة دفعات جديدة ستظهر لك في هذا القسم.</p>
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className={styles.emptyState}>
              <h2>لا توجد عقود إيجار حالياً</h2>
              <p>بمجرد إضافة عقود جديدة إلى حسابك ستظهر تفاصيلها هنا.</p>
              <button className={styles.primaryButton} onClick={() => router.push('/search-properties')}>
                استكشف العقارات المتاحة
              </button>
            </section>
          )}

          {previousContracts.length > 0 && (
            <section className={styles.previousContracts}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>العقود السابقة</h2>
                  <p>لمحة عن عقودك السابقة والمدفوعات الخاصة بها</p>
                </div>
              </div>

              <div className={styles.previousContractsGrid}>
                {previousContracts.map((contract) => (
                  <div key={contract.id} className={styles.previousContractCard}>
                    <div className={styles.previousContractHeader}>
                      <span className={styles.statusPill}>{contract.status}</span>
                      <span className={styles.contractPeriod}>
                        {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                      </span>
                    </div>
                    <h3>{contract.property?.name || 'عقار بدون اسم'}</h3>
                    <p className={styles.previousContractLocation}>
                      {contract.property?.city || ''}{' '}
                      {contract.property?.neighborhood ? `- ${contract.property.neighborhood}` : ''}
                    </p>
                    <div className={styles.previousContractMeta}>
                      <div>
                        <span className={styles.infoLabel}>الإيجار الشهري</span>
                        <p>{formatCurrency(contract.monthlyRent)}</p>
                      </div>
                      <div>
                        <span className={styles.infoLabel}>إجمالي المدفوعات</span>
                        <p>
                          {formatCurrency(
                            (contract.payments || [])
                              .filter((payment) => payment.status === 'مدفوعة' || payment.status === 'مدفوع')
                              .reduce((sum, payment) => sum + (payment.amount ?? 0), 0),
                          )}
                        </p>
                      </div>
                    </div>
                    <button className={styles.linkButton}>عرض التفاصيل</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

