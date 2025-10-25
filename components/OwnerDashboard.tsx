import { useState } from 'react'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import styles from '../styles/OwnerDashboard.module.css'

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const kpiData = [
    {
      title: 'العقارات',
      value: '12',
      change: '+2 منذ آخر شهر',
      trend: 'up',
      icon: '🏢',
      color: 'blue'
    },
    {
      title: 'معدل الإشغال',
      value: '92%',
      change: '+5% منذ آخر شهر',
      trend: 'up',
      icon: '📊',
      color: 'green'
    },
    {
      title: 'الإيجارات المحصلة',
      value: '45,200 ريال',
      change: '+8% منذ آخر شهر',
      trend: 'up',
      icon: '💰',
      color: 'blue'
    },
    {
      title: 'المصروفات',
      value: '12,450 ريال',
      change: '+3% منذ آخر شهر',
      trend: 'up',
      icon: '📄',
      color: 'red'
    }
  ]

  const alerts = [
    {
      type: 'urgent',
      title: 'تسرب مياه في الشقة رقم 103',
      description: 'عمارة الرياض - يحتاج إلى معالجة فورية',
      action: 'عرض التفاصيل'
    },
    {
      type: 'warning',
      title: '3 فواتير كهرباء مستحقة الدفع',
      description: 'خلال 5 أيام',
      action: 'دفع الآن'
    },
    {
      type: 'info',
      title: 'توصية ذكية',
      description: 'يمكنك زيادة الإيجار بنسبة 5% في 3 عقارات بناء على اسعار السوق',
      action: 'عرض التحليل'
    }
  ]

  const properties = [
    {
      name: 'عمارة الرياض',
      units: 8,
      occupancy: 100,
      monthlyRevenue: '15,000',
      status: 'ممتاز'
    },
    {
      name: 'مجمع الأمل',
      units: 12,
      occupancy: 85,
      monthlyRevenue: '18,500',
      status: 'جيد'
    },
    {
      name: 'برج النخيل',
      units: 6,
      occupancy: 70,
      monthlyRevenue: '11,700',
      status: 'متوسط'
    }
  ]

  const aiRecommendations = [
    {
      title: 'تحليل الأسعار',
      description: 'زيادة الإيجار بنسبة 5% في منطقة الريلان',
      action: 'عرض التحليل الكامل'
    },
    {
      title: 'توقعات الصيانة',
      description: 'مشاكل محتملة في نظام التكييف - برج النخيل الشهر القادم',
      action: 'عرض الحلول المقترحة'
    }
  ]

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <OwnerNavigation currentPage="dashboard" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Header Section with Button and Welcome */}
          <div className={styles.headerSection}>
            <div className={styles.addPropertySection}>
              <button className={styles.addPropertyBtn}>
                <span className={styles.addIcon}>+</span>
                إضافة عقار جديد
              </button>
            </div>
            
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeTitle}>مرحباً، أحمد!</h1>
              <p className={styles.welcomeSubtitle}>هذا ملخص لأداء محفظتك العقارية</p>
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
                  <h2 className={styles.sectionTitle}>التنبيهات العامة</h2>
                  <select className={styles.filterSelect}>
                    <option>أخرة أشهر</option>
                    <option>هذا الشهر</option>
                    <option>هذا الأسبوع</option>
                  </select>
                </div>
                
                <div className={styles.alertsList}>
                  {alerts.map((alert, index) => (
                    <div key={index} className={`${styles.alertCard} ${styles[alert.type]}`}>
                      <div className={styles.alertIcon}>
                        {alert.type === 'urgent' ? '⚠️' : 
                         alert.type === 'warning' ? '⚠️' : '💡'}
                      </div>
                      <div className={styles.alertContent}>
                        <h4 className={styles.alertTitle}>{alert.title}</h4>
                        <p className={styles.alertDescription}>{alert.description}</p>
                        <button className={styles.alertAction}>{alert.action}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Properties Overview */}
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
                  
                  {properties.map((property, index) => (
                    <div key={index} className={styles.tableRow}>
                      <div className={styles.propertyName}>{property.name}</div>
                      <div className={styles.propertyUnits}>{property.units}</div>
                      <div className={styles.occupancyCell}>
                        <div className={styles.occupancyBar}>
                          <div 
                            className={styles.occupancyFill} 
                            style={{width: `${property.occupancy}%`}}
                          ></div>
                        </div>
                        <span className={styles.occupancyText}>{property.occupancy}%</span>
                      </div>
                      <div className={styles.monthlyRevenue}>{property.monthlyRevenue} ر.س</div>
                      <div className={`${styles.status} ${styles[property.status.toLowerCase()]}`}>
                        {property.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Cash Flow Section */}
              <div className={styles.cashFlowSection}>
                <h2 className={styles.sectionTitle}>التدفق النقدي</h2>
                <div className={styles.cashFlowPlaceholder}>
                  <p>سيتم عرض التدفق النقدي هنا</p>
                </div>
              </div>

              {/* AI Assistant Section */}
              <div className={styles.aiAssistantSection}>
                <div className={styles.aiHeader}>
                  <h2 className={styles.sectionTitle}>المساعد الذكي</h2>
                  <div className={styles.aiIcon}>🤖</div>
                </div>
                
                <p className={styles.aiDescription}>
                  مرحباً أحمد! إليك بعض التوصيات الذكية لتحسين أداء محفظتك العقارية
                </p>
                
                <div className={styles.recommendationsList}>
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className={styles.recommendationCard}>
                      <h4 className={styles.recommendationTitle}>{rec.title}</h4>
                      <p className={styles.recommendationDescription}>{rec.description}</p>
                      <button className={styles.recommendationAction}>{rec.action}</button>
                    </div>
                  ))}
                </div>
                
                <button className={styles.getMoreBtn}>
                  الحصول على المزيد من التوصيات
                </button>
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
                <a href="#" aria-label="لينكد إن">💼</a>
                <a href="#" aria-label="يوتيوب">📺</a>
              </div>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الشركة</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">عن الشركة</a></li>
                <li><a href="#">فريق العمل</a></li>
                <li><a href="#">الوظائف</a></li>
                <li><a href="#">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الموارد</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">مركز المساعدة</a></li>
                <li><a href="#">المدونة</a></li>
                <li><a href="#">دليل المستخدم</a></li>
                <li><a href="#">الندوات الإلكترونية</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الحلول</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">لملاك العقارات</a></li>
                <li><a href="#">للمستأجرين</a></li>
                <li><a href="#">لمزودي الخدمات</a></li>
                <li><a href="#">لمديري العقارات</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>المنتجات</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">إدارة العقارات</a></li>
                <li><a href="#">إدارة الإيجارات</a></li>
                <li><a href="#">إدارة الصيانة</a></li>
                <li><a href="#">التحليلات والتقارير</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
