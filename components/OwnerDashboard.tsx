import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/OwnerDashboard.module.css'

interface DashboardStats {
  kpis: {
    totalProperties: number
    occupancyRate: number
    collectedRents: number
    expenses: number
    monthlyRevenue: number
  }
  alerts: {
    urgent: number
    dueInvoices: number
  }
  cashFlow: Array<{
    month: string
    income: number
    expenses: number
    net: number
  }>
  propertiesOverview: Array<{
    id: string
    name: string
    units: string
    occupancy: string
    monthlyRevenue: string
    status: string
  }>
  activeContracts: number
}

export default function OwnerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [urgentMaintenance, setUrgentMaintenance] = useState<any[]>([])
  const [dueInvoices, setDueInvoices] = useState<any[]>([])
  const [ownerId, setOwnerId] = useState<string | null>(null)

  useEffect(() => {
    fetchOwnerId()
  }, [])

  useEffect(() => {
    if (ownerId) {
      fetchDashboardData()
    }
  }, [ownerId])

  const fetchOwnerId = async () => {
    try {
      const response = await fetch('/api/user/get-owner-id')
      if (response.ok) {
        const owner = await response.json()
        setOwnerId(owner.id)
      }
    } catch (error) {
      console.error('Error fetching owner ID:', error)
      setLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    if (!ownerId) return

    try {
      setLoading(true)
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`/api/dashboard/stats?ownerId=${ownerId}`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch urgent maintenance
      const maintenanceResponse = await fetch(`/api/maintenance?ownerId=${ownerId}&status=قيد الانتظار`)
      if (maintenanceResponse.ok) {
        const maintenanceData = await maintenanceResponse.json()
        const urgent = maintenanceData.filter((m: any) => m.priority === 'urgent').slice(0, 1)
        setUrgentMaintenance(urgent)
      }

      // Fetch due invoices
      const paymentsResponse = await fetch(`/api/payments?ownerId=${ownerId}&status=مستحقة`)
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json()
        const fiveDaysFromNow = new Date()
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)
        const due = paymentsData.filter((p: any) => {
          const dueDate = new Date(p.dueDate)
          return dueDate <= fiveDaysFromNow && dueDate >= new Date()
        }).slice(0, 3)
        setDueInvoices(due)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProperty = () => {
    router.push('/owner/add-property')
  }

  if (loading || !ownerId) {
    return (
      <div className={styles.dashboard}>
        <OwnerNavigation currentPage="dashboard" />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const kpiData = stats ? [
    {
      title: 'العقارات',
      value: stats.kpis.totalProperties.toString(),
      change: '',
      trend: 'up',
      icon: '🏢',
      color: 'blue'
    },
    {
      title: 'معدل الإشغال',
      value: `${stats.kpis.occupancyRate}%`,
      change: '',
      trend: 'up',
      icon: '📊',
      color: 'green'
    },
    {
      title: 'الإيجارات المحصلة',
      value: `${stats.kpis.collectedRents.toLocaleString('ar-SA')} ر.س`,
      change: '',
      trend: 'up',
      icon: '💰',
      color: 'blue'
    },
    {
      title: 'المصروفات',
      value: `${stats.kpis.expenses.toLocaleString('ar-SA')} ر.س`,
      change: '',
      trend: 'up',
      icon: '📄',
      color: 'red'
    }
  ] : []

  const getStatusClass = (status: string) => {
    if (status === 'ممتاز') return styles.excellent
    if (status === 'جيد') return styles.good
    return styles.average
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <OwnerNavigation currentPage="dashboard" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Header Section with Button and Welcome */}
          <div className={styles.headerSection}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeTitle}>مرحباً، أحمد!</h1>
              <p className={styles.welcomeSubtitle}>هذا ملخص لأداء محفظتك العقارية</p>
            </div>
            
            <div className={styles.addPropertySection}>
              <button className={styles.addPropertyBtn} onClick={handleAddProperty}>
                إضافة عقار جديد
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className={styles.kpiSection}>
            <div className={styles.kpiGrid}>
              {kpiData.map((kpi, index) => (
                <div key={index} className={styles.kpiCard}>
                  <div className={styles.kpiContent}>
                    <h3 className={styles.kpiTitle}>{kpi.title}</h3>
                    <div className={styles.kpiValue}>{kpi.value}</div>
                    <div className={`${styles.kpiChange} ${styles[kpi.trend]}`}>
                      {kpi.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className={styles.dashboardGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Alerts Section */}
              <div className={styles.alertsSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>التنبيهات الهامة</h2>
                </div>
                
                <div className={styles.alertsList}>
                  {urgentMaintenance.length > 0 && urgentMaintenance.map((maintenance, index) => (
                    <div key={index} className={`${styles.alertCard} ${styles.urgent}`}>
                      <div className={styles.alertContent}>
                        <h3 className={styles.alertTitle}>صيانة عاجلة</h3>
                        <p className={styles.alertMessage}>
                          {maintenance.problemDescription} - {maintenance.property?.name || maintenance.unit}
                        </p>
                        <a href="#" className={styles.alertLink}>عرض التفاصيل</a>
                      </div>
                    </div>
                  ))}
                  
                  {dueInvoices.length > 0 && (
                    <div className={`${styles.alertCard} ${styles.warning}`}>
                      <div className={styles.alertContent}>
                        <h3 className={styles.alertTitle}>فواتير مستحقة</h3>
                        <p className={styles.alertMessage}>
                          {dueInvoices.length} {dueInvoices.length === 1 ? 'فاتورة' : 'فواتير'} مستحقة الدفع خلال 5 أيام
                        </p>
                        <a href="#" className={styles.alertLink}>دفع الآن</a>
                      </div>
                    </div>
                  )}
                  
                  <div className={`${styles.alertCard} ${styles.info}`}>
                    <div className={styles.alertContent}>
                      <h3 className={styles.alertTitle}>توصية الذكاء الاصطناعي</h3>
                      <p className={styles.alertMessage}>يمكنك زيادة الإيجار بنسبة 5% في 3 عقارات بناءً على أسعار السوق</p>
                      <a href="#" className={styles.alertLink}>عرض التحليل</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Cash Flow Section */}
              <div className={styles.cashFlowSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>التدفق النقدي</h2>
                </div>
                
                <div className={styles.cashFlowContent}>
                  <div className={styles.timeFilter}>
                    <select className={styles.timeSelect}>
                      <option value="6months">آخر 6 أشهر</option>
                      <option value="1year">آخر سنة</option>
                      <option value="2years">آخر سنتين</option>
                    </select>
                    <span className={styles.dropdownIcon}>▼</span>
                  </div>
                  
                  <div className={styles.chartArea}>
                    {/* Chart placeholder - would be replaced with actual chart component */}
                    <div className={styles.chartPlaceholder}>
                      <p>سيتم عرض مخطط التدفق النقدي هنا</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Second Dashboard Row */}
          <div className={styles.dashboardGrid}>
            {/* Left Column - Smart Assistant */}
            <div className={styles.leftColumn}>
              <div className={styles.aiAssistantSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>المساعد الذكي</h2>
                  <span className={styles.sectionIcon}>🤖</span>
                </div>
                
                <div className={styles.aiContent}>
                  <p className={styles.aiDescription}>
                    مرحباً أحمد! إليك بعض التوصيات الذكية لتحسين أداء محفظتك العقارية
                  </p>
                  
                  <div className={styles.recommendationsList}>
                    <div className={styles.recommendationCard}>
                      <h4 className={styles.recommendationTitle}>تحليل أسعار الإيجارات</h4>
                      <p className={styles.recommendationDescription}>
                        أسعار الإيجارات في منطقة "الرياض" ارتفعت يمكنك زيادة الإيجارات في عقاراتك بنسبة 7%
                      </p>
                    </div>
                    
                    <div className={styles.recommendationCard}>
                      <h4 className={styles.recommendationTitle}>توقعات الصيانة</h4>
                      <p className={styles.recommendationDescription}>
                        تحليل البيانات يشير إلى احتمالية حدوث مشاكل في نظام التكييف في "برج النخيل" خلال الشهر القادم
                      </p>
                    </div>
                    
                    <div className={styles.recommendationCard}>
                      <h4 className={styles.recommendationTitle}>فرص استثمارية</h4>
                      <p className={styles.recommendationDescription}>
                        هناك فرص استثمارية جديدة في المنطقة الشمالية من الرياض
                      </p>
                    </div>
                  </div>
                  
                  <button className={styles.getMoreBtn}>
                    الحصول على المزيد من التوصيات
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Properties Overview */}
            <div className={styles.rightColumn}>
              <div className={styles.propertiesSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>نظرة عامة على العقارات</h2>
                  <button className={styles.viewAllBtn}>عرض الكل</button>
                </div>
                
                <div className={styles.propertiesTable}>
                  <div className={styles.tableHeader}>
                    <div>العقار</div>
                    <div>الوحدات</div>
                    <div>الإشغال</div>
                    <div>الإيرادات الشهرية</div>
                    <div>الحالة</div>
                  </div>
                  
                  {stats?.propertiesOverview.map((property, index) => {
                    const occupancyPercent = parseInt(property.occupancy.replace('%', ''))
                    return (
                      <div key={property.id || index} className={styles.tableRow}>
                        <div className={styles.propertyName}>
                          <span className={styles.propertyIcon}>🏢</span>
                          {property.name}
                        </div>
                        <div className={styles.propertyUnits}>{property.units}</div>
                        <div className={styles.occupancyCell}>
                          <div className={styles.occupancyBar}>
                            <div className={styles.occupancyFill} style={{width: `${occupancyPercent}%`}}></div>
                          </div>
                          <span className={styles.occupancyText}>{property.occupancy}</span>
                        </div>
                        <div className={styles.monthlyRevenue}>{property.monthlyRevenue}</div>
                        <div className={`${styles.status} ${getStatusClass(property.status)}`}>{property.status}</div>
                      </div>
                    )
                  })}
                  
                  {(!stats || stats.propertiesOverview.length === 0) && (
                    <div className={styles.tableRow}>
                      <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', gridColumn: '1 / -1' }}>
                        لا توجد عقارات بعد. أضف عقارك الأول!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
