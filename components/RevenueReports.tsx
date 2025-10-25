import { useState } from 'react'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import styles from '../styles/RevenueReports.module.css'

export default function RevenueReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const revenueMetrics = [
    {
      title: 'إجمالي الإيرادات',
      value: '58,450 ريال',
      change: '+12% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '💰',
      color: 'success'
    },
    {
      title: 'متوسط الإيجار الشهري',
      value: '3,200 ريال',
      change: '+8% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '🏠',
      color: 'primary'
    },
    {
      title: 'عدد العقود النشطة',
      value: '24',
      change: '+3 عقود جديدة',
      trend: 'up',
      icon: '📄',
      color: 'info'
    },
    {
      title: 'معدل تحصيل الإيرادات',
      value: '96%',
      change: '+2% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '📊',
      color: 'warning'
    }
  ]

  const revenueData = [
    {
      property: 'فيلا الرياض - شارع الملك فهد',
      tenant: 'عبدالله محمد',
      amount: '8,500 ريال',
      status: 'مدفوع',
      dueDate: '2024-01-15',
      statusColor: 'paid'
    },
    {
      property: 'شقة جدة - حي الزهراء',
      tenant: 'فاطمة علي',
      amount: '4,200 ريال',
      status: 'مدفوع',
      dueDate: '2024-01-10',
      statusColor: 'paid'
    },
    {
      property: 'مكتب الدمام - كورنيش الدمام',
      tenant: 'شركة التقنية المتقدمة',
      amount: '6,800 ريال',
      status: 'متأخر',
      dueDate: '2024-01-05',
      statusColor: 'overdue'
    },
    {
      property: 'شقة مكة - حي العزيزية',
      tenant: 'خالد الغامدي',
      amount: '3,500 ريال',
      status: 'قيد المراجعة',
      dueDate: '2024-01-20',
      statusColor: 'pending'
    }
  ]

  const periodOptions = [
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
    { value: 'quarterly', label: 'ربعي' },
    { value: 'yearly', label: 'سنوي' }
  ]

  return (
    <div className={styles.revenueReportsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="revenue-reports" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>تقارير الإيرادات</h1>
            <div className={styles.headerControls}>
              <div className={styles.periodSelector}>
                <label>الفترة الزمنية:</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className={styles.periodSelect}
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Revenue Metrics Section */}
          <div className={styles.revenueMetricsSection}>
            <div className={styles.metricsGrid}>
              {revenueMetrics.map((metric, index) => (
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

          {/* Revenue Details Section */}
          <div className={styles.revenueDetailsSection}>
            <h2 className={styles.sectionTitle}>تفاصيل الإيرادات</h2>
            
            <div className={styles.revenueTable}>
              <div className={styles.tableHeader}>
                <div>العقار</div>
                <div>المستأجر</div>
                <div>المبلغ</div>
                <div>الحالة</div>
                <div>تاريخ الاستحقاق</div>
              </div>

              {revenueData.map((item, index) => (
                <div key={index} className={`${styles.tableRow} ${styles[item.statusColor]}`}>
                  <div className={styles.propertyName}>{item.property}</div>
                  <div className={styles.tenantName}>{item.tenant}</div>
                  <div className={styles.amount}>{item.amount}</div>
                  <div className={styles.status}>
                    <span className={`${styles.statusBadge} ${styles[item.statusColor]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className={styles.dueDate}>{item.dueDate}</div>
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
                <h3 className={styles.chartTitle}>معدل التحصيل</h3>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartIcon}>📈</div>
                  <p>رسم بياني لمعدل التحصيل</p>
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
