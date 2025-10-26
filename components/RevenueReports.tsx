import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/RevenueReports.module.css'

export default function RevenueReports() {
  const [selectedYear, setSelectedYear] = useState('2023')
  const [selectedPeriod, setSelectedPeriod] = useState('last30days')

  const revenueMetrics = [
    {
      title: 'الإيرادات السنوية',
      value: '٦٤٥,٧٨٠ ر.س',
      change: '۱۸ ٪ مقارنة بالعام الماضي',
      trend: 'up',
      icon: '/icons/reports.svg',
      color: 'primary'
    },
    {
      title: 'أعمال الصيانة المكتملة',
      value: '٧٨',
      change: '٥ % مقارنة بالشهر الماضي',
      trend: 'down',
      icon: '/icons/maintenance.svg',
      color: 'warning'
    },
    {
      title: 'العقود النشطة',
      value: '٢٤',
      change: '٣ عقود جديدة',
      trend: 'up',
      icon: '/icons/smart-contracts.svg',
      color: 'info'
    },
    {
      title: 'إجمالي الإيرادات الشهرية',
      value: '٥٨,٤٥٠ ر.س',
      change: '١٢ ٪ مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '/icons/payment-management.svg',
      color: 'success'
    }
  ]

  const activeContracts = [
    {
      company: 'شركة الرياض للتطوير',
      type: 'عقد صيانة شهري',
      amount: '١٢,٥٠٠ ر.س',
      endDate: 'ينتهي في ١٥/٠٨/٢٠٢٣'
    },
    {
      company: 'فندق النخيل',
      type: 'عقد صيانة سنوي',
      amount: '٨٥,٠٠٠ ر.س',
      endDate: 'ينتهي في ٠٣/١٢/٢٠٢٣'
    },
    {
      company: 'مدارس المستقبل',
      type: 'عقد صيانة فصلي',
      amount: '٣٨,٧٥٠ ر.س',
      endDate: 'ينتهي في ٢٢/٠٩/٢٠٢٣'
    },
    {
      company: 'مستشفى الصحة',
      type: 'عقد صيانة شهري',
      amount: '١٨,٢٠٠ ر.س',
      endDate: 'ينتهي في ٠١/٠٨/٢٠٢٣'
    }
  ]

  const aiInsights = [
    {
      title: 'توقعات الإيرادات',
      description: 'بناءً على تحليل البيانات، نتوقع زيادة في الإيرادات بنسبة 5% في الربع القادم.',
      color: 'info'
    },
    {
      title: 'فرص تحسين',
      description: 'يمكن زيادة الإيرادات من خلال تجديد 3 عقود قديمة بأسعار محدثة وتقديم خدمات إضافية.',
      color: 'success'
    },
    {
      title: 'تنبيهات',
      description: '5 عقود ستنتهي خلال الشهر القادم. ننصح بالتواصل مع العملاء لتجديد العقود مبكراً.',
      color: 'warning'
    }
  ]

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
                <a href="#" className={styles.viewAllLink}>
                  عرض الكل <span>←</span>
                </a>
              </div>
              
              <div className={styles.contractsList}>
                {activeContracts.map((contract, index) => (
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
                ))}
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
                <div className={styles.revenueCircle}>
                  <div className={styles.revenueValue}>٦٤٥,٧٨٠ ر.س</div>
                  <div className={styles.revenueGrowth}>⬆️</div>
                </div>
                <div className={styles.revenueStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>العام الماضي</div>
                    <div className={styles.statValue}>٥٤٧,٢٣٠ ر.س</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>نسبة النمو</div>
                    <div className={`${styles.statValue} ${styles.growth}`}>+ ١٨ %</div>
                  </div>
                </div>
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
              <h2 className={styles.sectionTitle}>الإيرادات الشهرية ٢٠٢٣</h2>
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
