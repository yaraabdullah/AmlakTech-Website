import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/RevenueReports.module.css'

export default function RevenueReports() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedPeriod, setSelectedPeriod] = useState('last30days')
  const [loading, setLoading] = useState(true)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [contracts, setContracts] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [revenueMetrics, setRevenueMetrics] = useState([
    {
      title: 'الإيرادات السنوية',
      value: '0 ر.س',
      change: '0',
      trend: 'neutral',
      icon: '/icons/reports.svg',
      color: 'primary'
    },
    {
      title: 'أعمال الصيانة المكتملة',
      value: '0',
      change: '0',
      trend: 'neutral',
      icon: '/icons/maintenance.svg',
      color: 'warning'
    },
    {
      title: 'العقود النشطة',
      value: '0',
      change: '0',
      trend: 'neutral',
      icon: '/icons/smart-contracts.svg',
      color: 'info'
    },
    {
      title: 'إجمالي الإيرادات الشهرية',
      value: '0 ر.س',
      change: '0',
      trend: 'neutral',
      icon: '/icons/payment-management.svg',
      color: 'success'
    }
  ])

  // Fetch owner ID
  useEffect(() => {
    const fetchOwnerId = async () => {
      try {
        if (typeof window !== 'undefined') {
          const userId = localStorage.getItem('userId')
          const userType = localStorage.getItem('userType')
          
          if (userId && userType === 'owner') {
            setOwnerId(userId)
            return
          }
        }

        const response = await fetch('/api/user/get-owner-id')
        if (response.ok) {
          const data = await response.json()
          setOwnerId(data.id)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching owner ID:', error)
        router.push('/login')
      }
    }
    fetchOwnerId()
  }, [])

  // Fetch all data
  useEffect(() => {
    if (ownerId) {
      fetchAllData()
    }
  }, [ownerId, selectedYear, selectedPeriod])

  const fetchAllData = async () => {
    if (!ownerId) return

    try {
      setLoading(true)
      
      // Fetch contracts
      const contractsResponse = await fetch(`/api/contracts?ownerId=${ownerId}`)
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setContracts(contractsData)
      }

      // Fetch payments
      const paymentsResponse = await fetch(`/api/payments?ownerId=${ownerId}`)
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json()
        setPayments(paymentsData)
      }

      // Fetch maintenance requests
      const maintenanceResponse = await fetch(`/api/maintenance?ownerId=${ownerId}`)
      if (maintenanceResponse.ok) {
        const maintenanceData = await maintenanceResponse.json()
        setMaintenanceRequests(maintenanceData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate revenue metrics
  useEffect(() => {
    if (payments.length > 0 || contracts.length > 0 || maintenanceRequests.length > 0) {
      calculateMetrics()
    }
  }, [payments, contracts, maintenanceRequests, selectedYear, selectedPeriod])

  const calculateMetrics = () => {
    const currentYear = parseInt(selectedYear)
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYearFull = currentDate.getFullYear()

    // Annual revenue (paid payments in selected year)
    const annualRevenue = payments
      .filter(p => {
        if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
        if (!p.paidDate) return false
        const paidYear = new Date(p.paidDate).getFullYear()
        return paidYear === currentYear
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)

    // Monthly revenue (paid payments in current month)
    const monthlyRevenue = payments
      .filter(p => {
        if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
        if (!p.paidDate) return false
        const paidDate = new Date(p.paidDate)
        return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYearFull
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)

    // Previous month revenue for comparison
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYearFull - 1 : currentYearFull
    const prevMonthlyRevenue = payments
      .filter(p => {
        if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
        if (!p.paidDate) return false
        const paidDate = new Date(p.paidDate)
        return paidDate.getMonth() === prevMonth && paidDate.getFullYear() === prevYear
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)

    // Previous year revenue
    const prevYearRevenue = payments
      .filter(p => {
        if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
        if (!p.paidDate) return false
        const paidYear = new Date(p.paidDate).getFullYear()
        return paidYear === currentYear - 1
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)

    // Active contracts
    const activeContractsCount = contracts.filter(c => c.status === 'نشط').length

    // Completed maintenance
    const completedMaintenance = maintenanceRequests.filter(m => 
      m.status === 'مكتملة' || m.status === 'completed'
    ).length

    // Calculate percentages
    const monthlyChange = prevMonthlyRevenue > 0 
      ? ((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue * 100).toFixed(1)
      : '0'
    
    const annualChange = prevYearRevenue > 0
      ? ((annualRevenue - prevYearRevenue) / prevYearRevenue * 100).toFixed(1)
      : '0'

    setRevenueMetrics([
      {
        title: 'الإيرادات السنوية',
        value: `${annualRevenue.toLocaleString('ar-SA')} ر.س`,
        change: prevYearRevenue > 0 ? `${annualChange}% مقارنة بالعام الماضي` : 'لا توجد بيانات سابقة',
        trend: parseFloat(annualChange) > 0 ? 'up' : parseFloat(annualChange) < 0 ? 'down' : 'neutral',
        icon: '/icons/reports.svg',
        color: 'primary'
      },
      {
        title: 'أعمال الصيانة المكتملة',
        value: completedMaintenance.toString(),
        change: completedMaintenance > 0 ? `${completedMaintenance} طلب مكتمل` : 'لا توجد أعمال صيانة مكتملة',
        trend: completedMaintenance > 0 ? 'up' : 'neutral',
        icon: '/icons/maintenance.svg',
        color: 'warning'
      },
      {
        title: 'العقود النشطة',
        value: activeContractsCount.toString(),
        change: activeContractsCount > 0 ? `${activeContractsCount} عقد نشط` : 'لا توجد عقود نشطة',
        trend: activeContractsCount > 0 ? 'up' : 'neutral',
        icon: '/icons/smart-contracts.svg',
        color: 'info'
      },
      {
        title: 'إجمالي الإيرادات الشهرية',
        value: `${monthlyRevenue.toLocaleString('ar-SA')} ر.س`,
        change: prevMonthlyRevenue > 0 
          ? `${monthlyChange}% مقارنة بالشهر الماضي`
          : 'لا توجد بيانات سابقة',
        trend: parseFloat(monthlyChange) > 0 ? 'up' : parseFloat(monthlyChange) < 0 ? 'down' : 'neutral',
        icon: '/icons/payment-management.svg',
        color: 'success'
      }
    ])
  }

  // Get active contracts for display
  const getActiveContracts = () => {
    return contracts
      .filter(c => c.status === 'نشط')
      .slice(0, 4)
      .map(contract => {
        const getTenantName = () => {
          if (contract.tenant) {
            return `${contract.tenant.firstName} ${contract.tenant.lastName}`
          } else if (contract.tenantName) {
            return contract.tenantName
          }
          return 'غير معروف'
        }

        const formatDate = (dateString: string) => {
          if (!dateString) return '-'
          try {
            const date = new Date(dateString)
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
          } catch {
            return dateString
          }
        }

        return {
          company: getTenantName(),
          type: contract.type,
          amount: `${contract.monthlyRent?.toLocaleString('ar-SA') || '0'} ر.س`,
          endDate: `ينتهي في ${formatDate(contract.endDate)}`
        }
      })
  }

  // Calculate AI insights from real data
  const getAiInsights = () => {
    const insights: any[] = []

    // Expiring contracts insight
    const expiringContracts = contracts.filter(c => {
      if (c.status !== 'نشط' || !c.endDate) return false
      const endDate = new Date(c.endDate)
      const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0
    })

    if (expiringContracts.length > 0) {
      insights.push({
        title: 'تنبيهات',
        description: `${expiringContracts.length} عقد سينتهي خلال الشهر القادم. ننصح بالتواصل مع المستأجرين لتجديد العقود مبكراً.`,
        color: 'warning'
      })
    }

    // Revenue opportunity
    const totalMonthlyRevenue = contracts
      .filter(c => c.status === 'نشط')
      .reduce((sum, c) => sum + (c.monthlyRent || 0), 0)

    if (totalMonthlyRevenue > 0) {
      const potentialAnnual = totalMonthlyRevenue * 12
      insights.push({
        title: 'توقعات الإيرادات',
        description: `بناءً على العقود النشطة الحالية، الإيرادات السنوية المتوقعة: ${potentialAnnual.toLocaleString('ar-SA')} ر.س`,
        color: 'info'
      })
    }

    // Maintenance insight
    const pendingMaintenance = maintenanceRequests.filter(m => 
      m.status === 'قيد الانتظار' || m.status === 'pending'
    ).length

    if (pendingMaintenance > 0) {
      insights.push({
        title: 'فرص تحسين',
        description: `هناك ${pendingMaintenance} طلب صيانة قيد الانتظار. إتمام هذه الطلبات قد يحسن رضا المستأجرين.`,
        color: 'success'
      })
    }

    return insights.length > 0 ? insights : [
      {
        title: 'تحليل البيانات',
        description: 'جاري تحليل بياناتك لتقديم توصيات مخصصة.',
        color: 'info'
      }
    ]
  }

  const activeContracts = getActiveContracts()
  const aiInsights = getAiInsights()

  return (
    <div className={styles.revenueReportsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="revenue-reports" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* AI Assistant Banner */}
          <div className={styles.aiBanner}>
            <div className={styles.aiBannerContent}>
              <div className={styles.aiBannerTitle}>
                <span>مساعد الذكاء الاصطناعي الخاص بك</span>
              </div>
              <p className={styles.aiBannerDescription}>
                يمكن للمساعد الذكي تحليل بياناتك وتقديم توصيات لتحسين الإيرادات وإدارة العقود بشكل أفضل.
              </p>
            </div>
            <button className={styles.activateAiBtn}>
              تفعيل المساعد الذكي
            </button>
          </div>

          {/* Revenue Metrics Section */}
          <div className={styles.revenueMetricsSection}>
            <div className={styles.metricsGrid}>
              {revenueMetrics.map((metric, index) => (
                <div key={index} className={`${styles.metricCard} ${styles[metric.color]}`}>
                  <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>{metric.title}</h3>
                    <div className={styles.metricIcon}>
                      <Image 
                        src={metric.icon} 
                        alt={metric.title}
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricValue}>{metric.value}</div>
                    <div className={`${styles.metricChange} ${styles[metric.trend]}`}>
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className={styles.dashboardGrid}>
            {/* Top Left: Active Contracts */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>العقود النشطة</h2>
                <a href="#" className={styles.viewAllLink} onClick={(e) => { e.preventDefault(); router.push('/owner/contract-management') }}>
                  عرض الكل <span>←</span>
                </a>
              </div>
              
              <div className={styles.contractsList}>
                {loading ? (
                  <div className={styles.loadingState}>
                    <p>جاري تحميل العقود...</p>
                  </div>
                ) : activeContracts.length > 0 ? (
                  activeContracts.map((contract, index) => (
                    <div key={index} className={styles.contractItem}>
                      <div className={styles.contractLeft}>
                        <div className={styles.contractDetails}>
                          <div className={styles.contractCompany}>{contract.company}</div>
                          <div className={styles.contractType}>{contract.type}</div>
                        </div>
                      </div>
                      <div className={styles.contractRight}>
                        <div className={styles.contractAmount}>{contract.amount}</div>
                        <div className={styles.contractEndDate}>{contract.endDate}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>لا توجد عقود نشطة حالياً</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Right: Revenue Details */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>تفصيل الإيرادات</h2>
                <select 
                  className={styles.periodSelect}
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="last30days">آخر ٣٠ يوم</option>
                  <option value="last7days">آخر ٧ أيام</option>
                  <option value="last3months">آخر ٣ أشهر</option>
                </select>
              </div>
              
              <div className={styles.chartArea}>
                {/* Chart placeholder */}
                <div className={styles.chartPlaceholder}>
                  <p>سيتم عرض الرسم البياني هنا</p>
                </div>
              </div>
            </div>

            {/* Bottom Left: Annual Revenue */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>الإيرادات السنوية</h2>
                <div className={styles.yearButtons}>
                  <button 
                    className={`${styles.yearBtn} ${selectedYear === '2023' ? styles.active : ''}`}
                    onClick={() => setSelectedYear('2023')}
                  >
                    ٢٠٢٣
                  </button>
                  <button 
                    className={`${styles.yearBtn} ${selectedYear === '2022' ? styles.active : ''}`}
                    onClick={() => setSelectedYear('2022')}
                  >
                    ٢٠٢٢
                  </button>
                  <button 
                    className={`${styles.yearBtn} ${selectedYear === '2021' ? styles.active : ''}`}
                    onClick={() => setSelectedYear('2021')}
                  >
                    ٢٠٢١
                  </button>
                </div>
              </div>
              
              <div className={styles.annualRevenueContent}>
                {loading ? (
                  <div className={styles.loadingState}>
                    <p>جاري تحميل البيانات...</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.revenueCircle}>
                      <div className={styles.revenueValue}>
                        {(() => {
                          const yearRevenue = payments
                            .filter(p => {
                              if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
                              if (!p.paidDate) return false
                              const paidYear = new Date(p.paidDate).getFullYear()
                              return paidYear === parseInt(selectedYear)
                            })
                            .reduce((sum, p) => sum + (p.amount || 0), 0)
                          return `${yearRevenue.toLocaleString('ar-SA')} ر.س`
                        })()}
                      </div>
                      <div className={styles.revenueGrowth}>
                        {(() => {
                          const currentYearRevenue = payments
                            .filter(p => {
                              if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
                              if (!p.paidDate) return false
                              return new Date(p.paidDate).getFullYear() === parseInt(selectedYear)
                            })
                            .reduce((sum, p) => sum + (p.amount || 0), 0)
                          const prevYearRevenue = payments
                            .filter(p => {
                              if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
                              if (!p.paidDate) return false
                              return new Date(p.paidDate).getFullYear() === parseInt(selectedYear) - 1
                            })
                            .reduce((sum, p) => sum + (p.amount || 0), 0)
                          return currentYearRevenue > prevYearRevenue ? '⬆️' : 
                                 currentYearRevenue < prevYearRevenue ? '⬇️' : '➡️'
                        })()}
                      </div>
                    </div>
                    <div className={styles.revenueStats}>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>العام الماضي</div>
                        <div className={styles.statValue}>
                          {(() => {
                            const prevYearRevenue = payments
                              .filter(p => {
                                if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
                                if (!p.paidDate) return false
                                return new Date(p.paidDate).getFullYear() === parseInt(selectedYear) - 1
                              })
                              .reduce((sum, p) => sum + (p.amount || 0), 0)
                            return `${prevYearRevenue.toLocaleString('ar-SA')} ر.س`
                          })()}
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>نسبة النمو</div>
                        <div className={`${styles.statValue} ${styles.growth}`}>
                          {(() => {
                            const currentYearRevenue = payments
                              .filter(p => {
                                if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
                                if (!p.paidDate) return false
                                return new Date(p.paidDate).getFullYear() === parseInt(selectedYear)
                              })
                              .reduce((sum, p) => sum + (p.amount || 0), 0)
                            const prevYearRevenue = payments
                              .filter(p => {
                                if (p.status !== 'مدفوعة' && p.status !== 'paid') return false
                                if (!p.paidDate) return false
                                return new Date(p.paidDate).getFullYear() === parseInt(selectedYear) - 1
                              })
                              .reduce((sum, p) => sum + (p.amount || 0), 0)
                            if (prevYearRevenue === 0) return '0%'
                            const growthValue = ((currentYearRevenue - prevYearRevenue) / prevYearRevenue * 100)
                            const growth = growthValue.toFixed(1)
                            return `${growthValue > 0 ? '+' : ''} ${growth}%`
                          })()}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Right: Completed Maintenance */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>أعمال الصيانة المكتملة</h2>
                <select className={styles.periodSelect}>
                  <option value="thismonth">هذا الشهر</option>
                  <option value="lastmonth">الشهر الماضي</option>
                  <option value="last3months">آخر ٣ أشهر</option>
                </select>
              </div>
              
              <div className={styles.chartArea}>
                {/* Chart placeholder */}
                <div className={styles.chartPlaceholder}>
                  <p>سيتم عرض الرسم البياني هنا</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue 2023 */}
          <div className={styles.monthlyRevenueSection}>
            <div className={styles.monthlyRevenueHeader}>
              <h2 className={styles.sectionTitle}>الإيرادات الشهرية {selectedYear}</h2>
              <div className={styles.headerActions}>
                <select className={styles.filterSelect}>
                  <option value="all">تصفية</option>
                  <option value="january">يناير</option>
                  <option value="february">فبراير</option>
                  <option value="march">مارس</option>
                </select>
                <button className={styles.exportBtn}>
                  <span>📤</span>
                  تصدير البيانات
                </button>
              </div>
            </div>
            
            <div className={styles.monthlyRevenueChart}>
              <div className={styles.chartPlaceholder}>
                <p>سيتم عرض الرسم البياني للإيرادات الشهرية هنا</p>
              </div>
            </div>
          </div>

          {/* AI Analytics Section */}
          <div className={styles.aiAnalyticsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWithIcon}>
                <Image 
                  src="/icons/ai-analytics.svg"
                  alt="تحليلات الذكاء الاصطناعي"
                  width={40}
                  height={40}
                />
                <h2 className={styles.sectionTitle}>تحليلات الذكاء الاصطناعي</h2>
              </div>
            </div>
            
            <div className={styles.aiInsightsGrid}>
              {aiInsights.map((insight, index) => (
                <div key={index} className={`${styles.aiInsightCard} ${styles[insight.color]}`}>
                  <h3 className={styles.insightTitle}>{insight.title}</h3>
                  <p className={styles.insightDescription}>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}