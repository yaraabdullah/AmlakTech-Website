import { useState } from 'react'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import styles from '../styles/PropertyAnalytics.module.css'

export default function PropertyAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedProperty, setSelectedProperty] = useState('all')

  const analyticsMetrics = [
    {
      title: 'إجمالي الإيرادات',
      value: '45,000 ريال',
      change: '+12% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '💰',
      color: 'success'
    },
    {
      title: 'معدل الإشغال',
      value: '92%',
      change: '+5% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '📊',
      color: 'primary'
    },
    {
      title: 'متوسط الإيجار',
      value: '3,200 ريال',
      change: '+8% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '🏠',
      color: 'info'
    },
    {
      title: 'تكلفة الصيانة',
      value: '2,800 ريال',
      change: '-3% مقارنة بالشهر الماضي',
      trend: 'down',
      icon: '🔧',
      color: 'warning'
    }
  ]

  const aiInsights = [
    {
      type: 'opportunity',
      title: 'فرصة لزيادة الإيرادات',
      description: 'العقار في شارع الملك فهد يمكن أن يحقق إيرادات أعلى بنسبة 15% إذا تم تحديث المطبخ',
      confidence: '85%',
      impact: 'عالي',
      icon: '💡',
      action: 'عرض التفاصيل'
    },
    {
      type: 'warning',
      title: 'انخفاض في معدل الإشغال',
      description: 'معدل الإشغال في العقار رقم 3 انخفض بنسبة 8% هذا الشهر مقارنة بالشهر الماضي',
      confidence: '92%',
      impact: 'متوسط',
      icon: '⚠️',
      action: 'تحليل الأسباب'
    },
    {
      type: 'recommendation',
      title: 'توصية لتحسين الكفاءة',
      description: 'يمكن توفير 20% من تكاليف الطاقة عبر تركيب نظام إضاءة ذكي',
      confidence: '78%',
      impact: 'عالي',
      icon: '🎯',
      action: 'تطبيق التوصية'
    }
  ]

  const propertyPerformance = [
    {
      name: 'فيلا الرياض - شارع الملك فهد',
      occupancy: '95%',
      revenue: '8,500 ريال',
      maintenance: '1,200 ريال',
      rating: '4.8',
      status: 'ممتاز',
      statusColor: 'excellent'
    },
    {
      name: 'شقة جدة - حي الزهراء',
      occupancy: '88%',
      revenue: '4,200 ريال',
      maintenance: '800 ريال',
      rating: '4.5',
      status: 'جيد جداً',
      statusColor: 'very-good'
    },
    {
      name: 'مكتب الدمام - كورنيش الدمام',
      occupancy: '92%',
      revenue: '6,800 ريال',
      maintenance: '1,500 ريال',
      rating: '4.6',
      status: 'جيد جداً',
      statusColor: 'very-good'
    },
    {
      name: 'شقة مكة - حي العزيزية',
      occupancy: '75%',
      revenue: '3,500 ريال',
      maintenance: '2,100 ريال',
      rating: '3.9',
      status: 'يحتاج تحسين',
      statusColor: 'needs-improvement'
    }
  ]

  const marketTrends = [
    {
      category: 'أسعار الإيجار',
      trend: 'ارتفاع',
      percentage: '+5.2%',
      description: 'زيادة في متوسط أسعار الإيجار في المنطقة',
      icon: '📈'
    },
    {
      category: 'معدل الإشغال',
      trend: 'استقرار',
      percentage: '+0.8%',
      description: 'معدل الإشغال مستقر مع زيادة طفيفة',
      icon: '➡️'
    },
    {
      category: 'تكاليف الصيانة',
      trend: 'انخفاض',
      percentage: '-2.1%',
      description: 'انخفاض في تكاليف الصيانة العامة',
      icon: '📉'
    }
  ]

  const periodOptions = [
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
    { value: 'quarterly', label: 'ربعي' },
    { value: 'yearly', label: 'سنوي' }
  ]

  const propertyOptions = [
    { value: 'all', label: 'جميع العقارات' },
    { value: 'villa-riyadh', label: 'فيلا الرياض' },
    { value: 'apartment-jeddah', label: 'شقة جدة' },
    { value: 'office-dammam', label: 'مكتب الدمام' },
    { value: 'apartment-makkah', label: 'شقة مكة' }
  ]

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  const handlePropertyChange = (property: string) => {
    setSelectedProperty(property)
  }

  return (
    <div className={styles.propertyAnalyticsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="property-analytics" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>تحليلات العقار</h1>
            <div className={styles.headerControls}>
              <div className={styles.periodSelector}>
                <label>الفترة الزمنية:</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className={styles.periodSelect}
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.propertySelector}>
                <label>العقار:</label>
                <select 
                  value={selectedProperty} 
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className={styles.propertySelect}
                >
                  {propertyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Analytics Metrics Section */}
          <div className={styles.analyticsMetricsSection}>
            <div className={styles.metricsGrid}>
              {analyticsMetrics.map((metric, index) => (
                <div key={index} className={`${styles.metricCard} ${styles[metric.color]}`}>
                  <div className={styles.metricIcon}>{metric.icon}</div>
                  <div className={styles.metricContent}>
                    <h3 className={styles.metricTitle}>{metric.title}</h3>
                    <div className={styles.metricValue}>{metric.value}</div>
                    <div className={`${styles.metricChange} ${styles[metric.trend]}`}>
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Section */}
          <div className={styles.aiInsightsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>🤖</div>
              <h2 className={styles.sectionTitle}>رؤى الذكاء الاصطناعي</h2>
            </div>
            
            <div className={styles.insightsGrid}>
              {aiInsights.map((insight, index) => (
                <div key={index} className={`${styles.insightCard} ${styles[insight.type]}`}>
                  <div className={styles.insightHeader}>
                    <div className={styles.insightIcon}>{insight.icon}</div>
                    <div className={styles.insightMeta}>
                      <span className={styles.confidence}>الثقة: {insight.confidence}</span>
                      <span className={styles.impact}>التأثير: {insight.impact}</span>
                    </div>
                  </div>
                  <h3 className={styles.insightTitle}>{insight.title}</h3>
                  <p className={styles.insightDescription}>{insight.description}</p>
                  <button className={styles.insightAction}>
                    {insight.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Property Performance Section */}
          <div className={styles.propertyPerformanceSection}>
            <h2 className={styles.sectionTitle}>أداء العقارات</h2>
            
            <div className={styles.performanceTable}>
              <div className={styles.tableHeader}>
                <div>اسم العقار</div>
                <div>معدل الإشغال</div>
                <div>الإيرادات</div>
                <div>تكلفة الصيانة</div>
                <div>التقييم</div>
                <div>الحالة</div>
              </div>

              {propertyPerformance.map((property, index) => (
                <div key={index} className={`${styles.tableRow} ${styles[property.statusColor]}`}>
                  <div className={styles.propertyName}>{property.name}</div>
                  <div className={styles.occupancyRate}>{property.occupancy}</div>
                  <div className={styles.revenue}>{property.revenue}</div>
                  <div className={styles.maintenanceCost}>{property.maintenance}</div>
                  <div className={styles.rating}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <span className={styles.ratingValue}>{property.rating}</span>
                  </div>
                  <div className={styles.status}>
                    <span className={`${styles.statusBadge} ${styles[property.statusColor]}`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends Section */}
          <div className={styles.marketTrendsSection}>
            <h2 className={styles.sectionTitle}>اتجاهات السوق</h2>
            
            <div className={styles.trendsGrid}>
              {marketTrends.map((trend, index) => (
                <div key={index} className={styles.trendCard}>
                  <div className={styles.trendIcon}>{trend.icon}</div>
                  <div className={styles.trendContent}>
                    <h3 className={styles.trendCategory}>{trend.category}</h3>
                    <div className={styles.trendValue}>
                      <span className={styles.trendDirection}>{trend.trend}</span>
                      <span className={styles.trendPercentage}>{trend.percentage}</span>
                    </div>
                    <p className={styles.trendDescription}>{trend.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className={styles.chartsSection}>
            <h2 className={styles.sectionTitle}>الرسوم البيانية</h2>
            
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>الإيرادات الشهرية</h3>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartIcon}>📊</div>
                  <p>رسم بياني للإيرادات الشهرية</p>
                </div>
              </div>
              
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>معدل الإشغال</h3>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartIcon}>📈</div>
                  <p>رسم بياني لمعدل الإشغال</p>
                </div>
              </div>
              
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>تكاليف الصيانة</h3>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartIcon}>🔧</div>
                  <p>رسم بياني لتكاليف الصيانة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>أملاك تك</h4>
              <p className={styles.footerDescription}>
                منصة متكاملة تستثمر تقنيات الذكاء الاصطناعي وتعلم الآلة لإدارة العقارات والخدمات العقارية
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="فيسبوك">📘</a>
                <a href="#" aria-label="تويتر">🐦</a>
                <a href="#" aria-label="إنستغرام">📷</a>
                <a href="#" aria-label="لينكد إن">💼</a>
                <a href="#" aria-label="يوتيوب">📺</a>
              </div>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>المنتجات</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">إدارة الإيجارات</a></li>
                <li><a href="#">إدارة الصيانة</a></li>
                <li><a href="#">التحليلات والتقارير</a></li>
                <li><a href="#">تطبيق الجوال</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الحلول</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">لملاك العقارات</a></li>
                <li><a href="#">للمستأجرين</a></li>
                <li><a href="#">لمزودي الخدمات</a></li>
                <li><a href="#">لمديري العقارات</a></li>
                <li><a href="#">للشركات العقارية</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الموارد</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">مركز المساعدة</a></li>
                <li><a href="#">المدونة</a></li>
                <li><a href="#">دليل المستخدم</a></li>
                <li><a href="#">الندوات الإلكترونية</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الشركة</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">عن الشركة</a></li>
                <li><a href="#">فريق العمل</a></li>
                <li><a href="#">الوظائف</a></li>
                <li><a href="#">اتصل بنا</a></li>
                <li><a href="#">الشركاء</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
