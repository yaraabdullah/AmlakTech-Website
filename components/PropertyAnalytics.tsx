import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/PropertyAnalytics.module.css'

export default function PropertyAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const kpiData = [
    {
      title: 'مؤشر المخاطر',
      badge: 'متوسط',
      badgeColor: 'yellow',
      value: '42',
      change: '3.5%↑',
      changeColor: 'orange',
      note: 'عوامل خطر تحتاج إلى معالجة 3'
    },
    {
      title: 'الدخل الشهري',
      value: '125,750 ₪',
      change: '8.7%↑',
      changeColor: 'green',
      note: '130,500 توقعات الشهر القادم ₪',
      hasInfo: true
    },
    {
      title: 'معدل الإشغال',
      badge: '5% عن الربع السابق +',
      badgeColor: 'green',
      value: '87%',
      change: '2.3%↑',
      changeColor: 'green',
      progress: 87
    }
  ]

  const topUnits = [
    {
      occupancy: '100%',
      return: '5,800 ₪',
      unit: 'برج السلام - شقة 501'
    },
    {
      occupancy: '100%',
      return: '4,950 ₪',
      unit: 'مجمع الفردوس - شقة 203'
    },
    {
      occupancy: '100%',
      return: '12,500 ₪',
      unit: 'فيلا الياسمين'
    },
    {
      occupancy: '100%',
      return: '4,750 ₪',
      unit: 'برج السلام - شقة 302'
    }
  ]

  const aiRecommendations = [
    {
      title: 'تحسين الطاقة',
      description: 'تركيب ألواح شمسية في مجمع الفردوس لتقليل تكاليف الطاقة.',
      icon: '/icons/ai-analytics.svg',
      tag: '24 شهر : ROI',
      tagColor: 'yellow'
    },
    {
      title: 'تحسين الصيانة',
      description: 'تقليل تكاليف الصيانة من خلال جدولة الصيانة الوقائية للوحدات الأقدم.',
      icon: '/icons/ai-analytics.svg',
      tag: 'شهرياً 3,800 ₪-',
      tagColor: 'blue'
    },
    {
      title: 'زيادة الإيجار',
      description: 'زيادة الإيجار في برج السلام بنسبة 5% لتتماشى مع أسعار السوق الحالية.',
      icon: '/icons/ai-analytics.svg',
      tag: 'شهرياً 6,250 ₪+',
      tagColor: 'green'
    }
  ]

  const riskAnalysis = [
    {
      level: 'خطر عالي',
      levelColor: 'red',
      action: 'معالجة الآن',
      description: '30 وحدات في برج السلام ستنتهي عقودها خلال 3 يوم.',
      linkText: 'معالجة',
      linkColor: 'red'
    },
    {
      level: 'خطر متوسط',
      levelColor: 'orange',
      action: 'خطة صيانة',
      description: 'مكيفات الهواء في مجمع الفردوس تحتاج إلى صيانة قريبا.',
      linkText: 'جدولة',
      linkColor: 'orange'
    },
    {
      level: 'خطر منخفض',
      levelColor: 'blue',
      action: 'مراقبة',
      description: 'أسعار العقارات في منطقة فيلا الياسمين في انخفاض طفيف.',
      linkText: 'تحليل السوق',
      linkColor: 'blue'
    }
  ]

  return (
    <div className={styles.propertyAnalyticsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="property-analytics" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* AI Banner */}
          <div className={styles.aiBanner}>
            <div className={styles.aiBannerIcon}>
              <Image 
                src="/icons/ai-analytics.svg"
                alt="الذكاء الاصطناعي"
                width={30}
                height={30}
              />
            </div>
            <p className={styles.aiBannerText}>
              الذكاء الاصطناعي اكتشف فرصة لزيادة الإيرادات في برج السلام بنسبة 2%
            </p>
            <button className={styles.closeBtn}>×</button>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>لوحة تحليلات العقارات</h1>
              <p className={styles.lastUpdated}>آخر تحديث: 28 يوليو 2025, 11:00 صباحًا</p>
            </div>
            <button className={styles.filterBtn}>
              إضافة فلتر <span>▼</span>
            </button>
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <button className={styles.exportBtn}>
              تصدير التقرير <span>▼</span>
            </button>
            <select className={styles.selectBtn}>
              <option>جميع العقارات</option>
            </select>
            <select className={styles.selectBtn}>
              <option>2025 الربع الثالث</option>
            </select>
          </div>

          {/* KPI Cards */}
          <div className={styles.kpiSection}>
            <div className={styles.kpiGrid}>
              {kpiData.map((kpi, index) => (
                <div key={index} className={styles.kpiCard}>
                  <h3 className={styles.kpiTitle}>
                    {kpi.title}
                    {kpi.hasInfo && <span className={styles.infoIcon}>i</span>}
                  </h3>
                  {kpi.badge && (
                    <span className={`${styles.kpiBadge} ${styles[kpi.badgeColor]}`}>
                      {kpi.badge}
                    </span>
                  )}
                  <div className={styles.kpiValue}>{kpi.value}</div>
                  <div className={`${styles.kpiChange} ${styles[kpi.changeColor]}`}>
                    {kpi.change}
                  </div>
                  {kpi.note && (
                    <p className={styles.kpiNote}>{kpi.note}</p>
                  )}
                  {kpi.progress && (
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: `${kpi.progress}%`}}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Best Units */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>أفضل الوحدات أداء</h2>
                  <a href="#" className={styles.viewAllLink}>عرض الكل</a>
                </div>
                
                <div className={styles.unitsTable}>
                  <div className={styles.tableHeader}>
                    <div>الإشغال</div>
                    <div>العائد</div>
                    <div>الوحدة</div>
                  </div>
                  
                  {topUnits.map((unit, index) => (
                    <div key={index} className={styles.tableRow}>
                      <span className={styles.occupancyBadge}>100%</span>
                      <div className={styles.returnValue}>{unit.return}</div>
                      <div className={styles.unitName}>{unit.unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Forecast */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>توقعات الإيرادات ( 12 شهر قادم)</h2>
                  <div className={styles.headerActions}>
                    <span>⋯</span>
                    <span>📥</span>
                  </div>
                </div>
                <div className={styles.chartPlaceholder}>
                  <p>سيتم عرض الرسم البياني هنا</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Occupancy by Property */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>الإشغال حسب العقار</h2>
                </div>
                <div className={styles.chartPlaceholder}>
                  <p>سيتم عرض الرسم البياني هنا</p>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.titleWithIcon}>
                    <h2 className={styles.sectionTitle}>توصيات الذكاء الاصطناعي لتحسين العائد</h2>
                    <Image 
                      src="/icons/ai-analytics.svg"
                      alt="توصيات الذكاء الاصطناعي"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                
                <div className={styles.recommendationsList}>
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className={styles.recommendationCard}>
                      <div className={styles.recHeader}>
                        <h3 className={styles.recTitle}>{rec.title}</h3>
                        <div className={styles.recIcon}>
                          <Image 
                            src={rec.icon}
                            alt={rec.title}
                            width={20}
                            height={20}
                          />
                        </div>
                      </div>
                      <p className={styles.recDescription}>{rec.description}</p>
                      <span className={`${styles.recTag} ${styles[rec.tagColor]}`}>
                        {rec.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <button className={styles.executeAllBtn}>
                  تنفيذ جميع التوصيات
                </button>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className={styles.riskSection}>
            <h2 className={styles.sectionTitle}>تحليل المخاطر</h2>
            
            <div className={styles.riskCards}>
              {riskAnalysis.map((risk, index) => (
                <div key={index} className={`${styles.riskCard} ${styles[risk.levelColor]}`}>
                  <div className={styles.riskHeader}>
                    <h3 className={styles.riskLevel}>{risk.level}</h3>
                    <span className={`${styles.actionBadge} ${styles[risk.levelColor]}`}>
                      {risk.action}
                    </span>
                  </div>
                  <p className={styles.riskDescription}>{risk.description}</p>
                  <a href="#" className={`${styles.riskLink} ${styles[risk.linkColor]}`}>
                    {risk.linkText} ←
                  </a>
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
