import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
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

const formatMonthName = (value?: string | null) => {
  if (!value) return '—'
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('ar-SA', { month: 'long' })
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
  const [propertyDetails, setPropertyDetails] = useState<any>(null)

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
        const contractsData = Array.isArray(tenantData.contracts) ? tenantData.contracts : []
        setContracts(contractsData)
        
        // Fetch property details with owner info for the active contract
        if (contractsData.length > 0) {
          const activeContract = contractsData.find(c => c.status === 'نشط') || contractsData[0]
          if (activeContract?.propertyId) {
            try {
              const propertyResponse = await fetch(`/api/properties/${activeContract.propertyId}`)
              if (propertyResponse.ok) {
                const propertyData = await propertyResponse.json()
                setPropertyDetails(propertyData)
              }
            } catch (err) {
              console.error('Error fetching property details:', err)
            }
          }
        }
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
    const now = new Date()
    return contracts
      .filter((contract) => {
        if (!contract.startDate || !contract.endDate) return false
        if (contract.id === activeContract?.id) return false
        const end = new Date(contract.endDate)
        // Include contracts that are expired or have status "منتهي" or "منتهى"
        return contract.status === 'منتهي' || contract.status === 'منتهى' || end < now
      })
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
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
              <div className={styles.greetingRight}>
                <div className={styles.greetingText}>
                  <h1 className={styles.greetingTitle}>
                    <span className={styles.welcomeEmoji}>👋</span> مرحباً، {tenant.firstName} {tenant.lastName}
                  </h1>
                  {tenant.user?.lastLogin && (
                    <p className={styles.lastLogin}>
                      آخر تسجيل دخول: {formatLastLogin(tenant.user.lastLogin)}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.greetingLeft}>
                <button className={styles.aiAssistantButton}>
                  <span>مساعد أملاك الذكي</span>
                  <span className={styles.robotIcon}>🤖</span>
                </button>
              </div>
            </div>
          </section>

          {activeContract ? (
            <>
              <section className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <div className={styles.metricIcon}>
                      <img 
                        src="/icons/date.svg" 
                        alt="تاريخ العقد" 
                        width={24} 
                        height={24}
                        style={{ display: 'block', width: '24px', height: '24px' }}
                      />
                    </div>
                    <span className={styles.metricLabel}>العقد الحالي</span>
                  </div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricPropertyInfo}>
                      {activeContract.property?.name || 'غير مسمى'}
                      {activeContract.property?.city && ` - ${activeContract.property.city}`}
                      {activeContract.property?.neighborhood && ` حي ${activeContract.property.neighborhood}`}
                    </div>
                    <div className={styles.metricDateRange}>
                      {leaseDurationDays !== null ? `${Math.round(leaseDurationDays / 30)} شهر` : ''} ({formatDate(activeContract.startDate)} - {formatDate(activeContract.endDate)})
                    </div>
                    <div className={styles.metricRemainingLabel}>متبقي على انتهاء العقد:</div>
                    {remainingDays !== null && remainingDays >= 0 && (
                      <div className={styles.metricTag}>
                        يوم {remainingDays}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <div className={styles.metricIcon}>
                      <img 
                        src="/icons/payment-management.svg" 
                        alt="إدارة الدفع" 
                        width={24} 
                        height={24}
                        style={{ display: 'block', width: '24px', height: '24px' }}
                      />
                    </div>
                    <span className={styles.metricLabel}>الدفعة القادمة</span>
                  </div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricSubLabel}>الإيجار الشهري</div>
                    <div className={styles.metricAmount}>
                      {nextPayment ? formatCurrency(nextPayment.amount) : formatCurrency(activeContract.monthlyRent)}
                    </div>
                    <div className={styles.metricRemainingLabel}>تاريخ الاستحقاق:</div>
                    {nextPayment ? (
                      <div className={`${styles.metricTag} ${styles.metricTagWarning}`}>
                        {formatMonthName(nextPayment.dueDate)}
                      </div>
                    ) : (
                      <div className={styles.metricTag}>لا يوجد دفعات مستحقة</div>
                    )}
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <div className={styles.metricIcon}>
                      <img 
                        src="/icons/reports.svg" 
                        alt="التقارير" 
                        width={24} 
                        height={24}
                        style={{ display: 'block', width: '24px', height: '24px' }}
                      />
                    </div>
                    <span className={styles.metricLabel}>إجمالي المدفوعات</span>
                  </div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricSubLabel}>منذ بداية العقد</div>
                    <div className={styles.metricAmount}>{formatCurrency(totalPaid)}</div>
                    <div className={styles.metricRemainingLabel}>عدد الدفعات:</div>
                    <div className={`${styles.metricTag} ${styles.metricTagSuccess}`}>
                      دفعة (كاملة) {payments.filter(p => p.status === 'مدفوعة' || p.status === 'مدفوع').length}
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.contractOverview}>
                <div className={styles.contractCard}>
                  <div className={styles.contractCardHeader}>
                    <h2>تفاصيل العقد الحالي</h2>
                    <button className={styles.downloadButton}>
                      <img src="/icons/save.svg" alt="تحميل" width={16} height={16} />
                      تحميل العقد
                    </button>
                  </div>

                  <div className={styles.contractTopGrid}>
                    <div className={styles.contractInfoItem}>
                      <div className={styles.contractInfoIcon}>
                        <img src="/icons/location.svg" alt="العقار" width={20} height={20} style={{ display: 'block' }} />
                      </div>
                      <div className={styles.contractInfoContent}>
                        <span className={styles.infoLabel}>العقار</span>
                        <p className={styles.infoValue}>
                          {activeContract.property?.name || 'غير مسمى'}
                          {activeContract.unit?.unitNumber ? ` - الطابق ${activeContract.unit.unitNumber}` : ''}
                        </p>
                        <span className={styles.infoHint}>
                          {activeContract.property?.city || ''}
                          {activeContract.property?.neighborhood ? `، حي ${activeContract.property.neighborhood}` : ''}
                          {activeContract.property?.address ? `، ${activeContract.property.address}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className={styles.contractInfoItem}>
                      <div className={styles.contractInfoIcon}>
                        <img src="/icons/person.svg" alt="المؤجر" width={20} height={20} style={{ display: 'block' }} />
                      </div>
                      <div className={styles.contractInfoContent}>
                        <span className={styles.infoLabel}>المؤجر</span>
                        <p className={styles.infoValue}>
                          {propertyDetails?.owner?.first_name && propertyDetails?.owner?.last_name
                            ? `${propertyDetails.owner.first_name} ${propertyDetails.owner.last_name}`
                            : propertyDetails?.owner?.email || 'غير محدد'}
                        </p>
                        <span className={styles.infoHint}>
                          رقم التواصل: {propertyDetails?.owner?.email || propertyDetails?.owner?.phone_number || tenant.phoneNumber || 'غير متوفر'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.contractInfoItem}>
                      <div className={styles.contractInfoIcon}>
                        <img src="/icons/smart-contracts.svg" alt="تفاصيل العقد" width={20} height={20} style={{ display: 'block' }} />
                      </div>
                      <div className={styles.contractInfoContent}>
                        <span className={styles.infoLabel}>تفاصيل العقد</span>
                        <p className={styles.infoValue}>رقم العقد: {activeContract.id}</p>
                        <span className={styles.infoHint}>موثق إلكترونيا عبر منصة إيجار</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.contractDivider}></div>

                  <div className={styles.contractBottomGrid}>
                    <div className={styles.contractTermsSection}>
                      <h3 className={styles.sectionTitle}>شروط العقد</h3>
                      <ul className={styles.contractTermsList}>
                        <li>
                          <span className={styles.checkmark}>✓</span>
                          <span>مدة العقد: {leaseDurationDays !== null ? `${Math.round(leaseDurationDays / 30)} شهر` : 'غير محدد'}</span>
                        </li>
                        <li>
                          <span className={styles.checkmark}>✓</span>
                          <span>قيمة الإيجار: {formatCurrency(activeContract.monthlyRent)} شهريا</span>
                        </li>
                        <li>
                          <span className={styles.checkmark}>✓</span>
                          <span>التأمين: {formatCurrency(activeContract.deposit || 0)} (مسترد)</span>
                        </li>
                        <li>
                          <span className={styles.checkmark}>✓</span>
                          <span>طريقة الدفع: شهري (تحويل بنكي)</span>
                        </li>
                      </ul>
                    </div>

                    <div className={styles.keyDatesSection}>
                      <h3 className={styles.sectionTitle}>تواريخ مهمة</h3>
                      <ul className={styles.keyDatesList}>
                        <li>
                          <div className={styles.dateIcon}>
                            <img src="/icons/date.svg" alt="تاريخ" width={20} height={20} style={{ display: 'block' }} />
                          </div>
                          <div className={styles.dateContent}>
                            <span className={styles.infoLabel}>تاريخ بداية العقد</span>
                            <p>{formatDate(activeContract.startDate)}</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dateIcon}>
                            <img src="/icons/date.svg" alt="تاريخ" width={20} height={20} style={{ display: 'block' }} />
                          </div>
                          <div className={styles.dateContent}>
                            <span className={styles.infoLabel}>تاريخ نهاية العقد</span>
                            <p>{formatDate(activeContract.endDate)}</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dateIcon}>
                            <img src="/icons/date.svg" alt="تاريخ" width={20} height={20} style={{ display: 'block' }} />
                          </div>
                          <div className={styles.dateContent}>
                            <span className={styles.infoLabel}>موعد تجديد العقد</span>
                            <p>قبل ٦٠ يوم من الانتهاء</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dateIcon}>
                            <img src="/icons/date.svg" alt="تاريخ" width={20} height={20} style={{ display: 'block' }} />
                          </div>
                          <div className={styles.dateContent}>
                            <span className={styles.infoLabel}>تاريخ دفع الإيجار</span>
                            <p>أول كل شهر ميلادي</p>
                          </div>
                        </li>
                      </ul>
                    </div>
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

          <section className={styles.previousContracts}>
            <div className={styles.sectionHeader}>
              <h2>العقود السابقة</h2>
            </div>

            {previousContracts.length > 0 ? (
              <div className={styles.previousContractsGrid}>
                {previousContracts.map((contract) => {
                  const contractStart = new Date(contract.startDate)
                  const contractEnd = new Date(contract.endDate)
                  const monthsDiff = Math.round((contractEnd.getTime() - contractStart.getTime()) / (1000 * 60 * 60 * 24 * 30))
                  const totalPaidForContract = (contract.payments || [])
                    .filter((payment) => payment.status === 'مدفوعة' || payment.status === 'مدفوع')
                    .reduce((sum, payment) => sum + (payment.amount ?? 0), 0)

                  return (
                    <div key={contract.id} className={styles.previousContractCard}>
                      <h3 className={styles.previousContractTitle}>
                        {contract.property?.name || 'عقار بدون اسم'}
                        {contract.property?.city && ` - ${contract.property.city}`}
                        {contract.property?.neighborhood && ` حي ${contract.property.neighborhood}`}
                      </h3>
                      <div className={styles.previousContractDuration}>
                        {monthsDiff} شهر ({formatDate(contract.startDate)} - {formatDate(contract.endDate)})
                      </div>
                      <div className={styles.previousContractStatus}>
                        <span className={styles.statusPillExpired}>منتهى</span>
                      </div>
                      <div className={styles.previousContractDetails}>
                        <div className={styles.previousContractDetailItem}>
                          <span className={styles.previousContractLabel}>الإيجار الشهري:</span>
                          <span className={styles.previousContractValue}>{formatCurrency(contract.monthlyRent)}</span>
                        </div>
                        <div className={styles.previousContractDetailItem}>
                          <span className={styles.previousContractLabel}>إجمالي المدفوعات:</span>
                          <span className={styles.previousContractValue}>{formatCurrency(totalPaidForContract)}</span>
                        </div>
                      </div>
                      <button className={styles.viewDetailsButton}>
                        عرض التفاصيل
                        <span className={styles.arrowIcon}>←</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>لا توجد عقود سابقة</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

