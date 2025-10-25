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
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeTitle}>مرحباً، أحمد!</h1>
              <p className={styles.welcomeSubtitle}>هذا ملخص لأداء محفظتك العقارية</p>
            </div>
            
            <div className={styles.addPropertySection}>
              <button className={styles.addPropertyBtn}>
                <span className={styles.addIcon}>+</span>
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
                  <span className={styles.sectionIcon}>🔔</span>
                </div>
                
                <div className={styles.alertsList}>
                  <div className={`${styles.alertCard} ${styles.urgent}`}>
                    <div className={styles.alertIcon}>⚠️</div>
                    <div className={styles.alertContent}>
                      <h3 className={styles.alertTitle}>صيانة عاجلة</h3>
                      <p className={styles.alertMessage}>تسرب مياه في الشقة رقم 103 - عمارة الرياض</p>
                      <a href="#" className={styles.alertLink}>عرض التفاصيل</a>
                    </div>
                  </div>
                  
                  <div className={`${styles.alertCard} ${styles.warning}`}>
                    <div className={styles.alertIcon}>⏰</div>
                    <div className={styles.alertContent}>
                      <h3 className={styles.alertTitle}>فواتير مستحقة</h3>
                      <p className={styles.alertMessage}>3 فواتير كهرباء مستحقة الدفع خلال 5 أيام</p>
                      <a href="#" className={styles.alertLink}>دفع الآن</a>
                    </div>
                  </div>
                  
                  <div className={`${styles.alertCard} ${styles.info}`}>
                    <div className={styles.alertIcon}>🧠</div>
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
                  <span className={styles.sectionIcon}>💰</span>
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
