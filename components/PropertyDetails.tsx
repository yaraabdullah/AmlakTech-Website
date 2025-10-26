import { useState } from 'react'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/PropertyDetails.module.css'

export default function PropertyDetails() {
  const [activeTab, setActiveTab] = useState('overview')

  const propertyData = {
    name: 'شقة الرياض الفاخرة',
    location: 'في الترجس، الرياض المملكة العربية السعودية',
    status: 'مؤجر',
    type: 'شقة سكنية',
    area: '120 متر مربع',
    rooms: '3 غرف',
    bathrooms: '2',
    purchaseDate: '15 يناير 2022',
    propertyValue: '750,000 ريال'
  }

  const occupancyData = {
    average: 92,
    current: 100,
    trend: 'up'
  }

  const financialData = {
    monthlyRent: '4,500 ريال',
    annualIncome: '54,000 ريال',
    maintenanceCosts: '5,200 ريال',
    taxesFees: '2,700 ريال',
    netProfit: '46,100 ريال'
  }

  const notifications = [
    {
      type: 'contract',
      title: 'موعد تجديد العقد',
      description: 'عقد الإيجار ينتهي بعد 30 يوم يرجى التواصل مع المستأجر',
      icon: '⚠️',
      urgent: true
    },
    {
      type: 'maintenance',
      title: 'طلب صيانة معلق',
      description: 'طلب صيانة للتكييف الهواء في الغرفة الرئيسية.',
      icon: '🔧',
      urgent: false
    },
    {
      type: 'invoice',
      title: 'فاتورة مستحقة',
      description: 'فاتورة صيانة المصعد مستحقة الدفع في 15/07/2023 .',
      icon: '📄',
      urgent: false
    }
  ]

  const maintenanceSchedule = [
    {
      title: 'صيانة نظام التكييف',
      description: 'تنظيف وصيانة دورية لنظام التكييف المركزي',
      date: '15 يوليو 2023',
      time: '10:00 صباحاً',
      company: 'شركة البرودة للتكييف',
      contact: '+966 55 123 4567',
      status: 'موعد'
    },
    {
      title: 'فحص نظام الإنذار',
      description: 'فحص دوري النظام إنذار الحريق',
      date: '22 يوليو 2023',
      time: '2:00 مساءً',
      company: 'شركة الأمان للسلامة',
      contact: '+966 50 987 6543',
      status: 'بانتظار التأكيد'
    }
  ]

  const tenants = [
    {
      name: 'أحمد محمد علي',
      email: 'ahmed@sample.com',
      avatar: '/icons/profile-placeholder.svg',
      startDate: '01/01/2023',
      endDate: '31/12/2023',
      monthlyRent: '4,500 ريال',
      paymentStatus: 'مدفوع'
    }
  ]

  const aiRecommendations = [
    {
      category: 'تحسين الدخل',
      title: 'زيادة الإيجار',
      description: 'بناء على تحليل أسعار السوق في منطقتك. يمكنك زيادة الإيجار بنسبة 5-7% عند تجديد العقد دون التأثير على معدل الإشغال.',
      action: 'عرض التحليل الكامل'
    },
    {
      category: 'تحسين كفاءة الطاقة',
      title: 'تحسين الطاقة',
      description: 'يمكن تحسين كفاءة الطاقة في العقار لتقليل التكاليف.',
      action: 'عرض الحلول المقترحة'
    }
  ]

  return (
    <div className={styles.propertyDetailsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="property-details" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Property Header */}
          <div className={styles.propertyHeader}>
            <div className={styles.propertyInfo}>
              <div className={styles.propertyTitle}>
                <h1 className={styles.propertyName}>{propertyData.name}</h1>
                <p className={styles.propertyLocation}>{propertyData.location}</p>
              </div>
            </div>
            
            <div className={styles.propertyActions}>
              <button className={styles.editBtn}>
                تعديل العقار
              </button>
              <button className={styles.addTenantBtn}>
                <span className={styles.addIcon}>+</span>
                إضافة مستأجر
              </button>
            </div>
          </div>

          {/* Property Overview Cards */}
          <div className={styles.overviewCards}>
            {/* Property Status Card */}
            <div className={styles.statusCard}>
              <h2 className={styles.cardTitle}>حالة العقار</h2>
              <div className={styles.statusBadge}>
                <span className={styles.statusText}>{propertyData.status}</span>
              </div>
              
              <div className={styles.propertyDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>نوع العقار:</span>
                  <span className={styles.detailValue}>{propertyData.type}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>المساحة:</span>
                  <span className={styles.detailValue}>{propertyData.area}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>عدد الغرف:</span>
                  <span className={styles.detailValue}>{propertyData.rooms}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>الحمامات:</span>
                  <span className={styles.detailValue}>{propertyData.bathrooms}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>تاريخ الشراء:</span>
                  <span className={styles.detailValue}>{propertyData.purchaseDate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>قيمة العقار:</span>
                  <span className={styles.detailValue}>{propertyData.propertyValue}</span>
                </div>
              </div>
            </div>

            {/* Occupancy Rate Card */}
            <div className={styles.occupancyCard}>
              <h2 className={styles.cardTitle}>معدل الإشغال</h2>
              
              <div className={styles.occupancyChart}>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartLine}></div>
                  <div className={styles.chartArea}></div>
                </div>
              </div>
              
              <div className={styles.occupancyStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>متوسط الإشغال</span>
                  <span className={styles.statValue}>{occupancyData.average}%</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>الإشغال الحالي</span>
                  <span className={styles.statValue}>{occupancyData.current}%</span>
                </div>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className={styles.financialCard}>
              <h2 className={styles.cardTitle}>ملخص مالي</h2>
              
              <div className={styles.financialDetails}>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>الإيجار الشهري:</span>
                  <span className={styles.financialValue}>{financialData.monthlyRent}</span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>الدخل السنوي</span>
                  <span className={styles.financialValue}>{financialData.annualIncome}</span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>تكاليف الصيانة</span>
                  <span className={styles.financialValue}>{financialData.maintenanceCosts}</span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>الضرائب والرسوم</span>
                  <span className={styles.financialValue}>{financialData.taxesFees}</span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>صافي الربح.</span>
                  <span className={styles.financialValue}>{financialData.netProfit}</span>
                </div>
              </div>
              
              <button className={styles.reportBtn}>
                عرض التقرير المالي الكامل
              </button>
            </div>
          </div>

          {/* Notifications and Maintenance Section */}
          <div className={styles.notificationsMaintenanceSection}>
            {/* Notifications Card */}
            <div className={styles.notificationsCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>التنبيهات</h2>
                <div className={styles.notificationCount}>
                  <span className={styles.bellIcon}>🔔</span>
                  <span className={styles.count}>3 تنبيهات</span>
                </div>
              </div>
              
              <div className={styles.notificationsList}>
                {notifications.map((notification, index) => (
                  <div key={index} className={`${styles.notificationItem} ${notification.urgent ? styles.urgent : ''}`}>
                    <div className={styles.notificationIcon}>{notification.icon}</div>
                    <div className={styles.notificationContent}>
                      <h4 className={styles.notificationTitle}>{notification.title}</h4>
                      <p className={styles.notificationDescription}>{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={styles.viewAllBtn}>
                عرض جميع التنبيهات
              </button>
            </div>

            {/* Scheduled Maintenance Card */}
            <div className={styles.maintenanceCard}>
              <h2 className={styles.cardTitle}>الصيانة المجدولة</h2>
              
              <div className={styles.maintenanceList}>
                {maintenanceSchedule.map((maintenance, index) => (
                  <div key={index} className={styles.maintenanceItem}>
                    <div className={styles.maintenanceContent}>
                      <h4 className={styles.maintenanceTitle}>{maintenance.title}</h4>
                      <p className={styles.maintenanceDescription}>{maintenance.description}</p>
                      <div className={styles.maintenanceDetails}>
                        <div className={styles.maintenanceDetail}>
                          <span className={styles.detailLabel}>التاريخ:</span>
                          <span className={styles.detailValue}>{maintenance.date}</span>
                        </div>
                        <div className={styles.maintenanceDetail}>
                          <span className={styles.detailLabel}>الوقت:</span>
                          <span className={styles.detailValue}>{maintenance.time}</span>
                        </div>
                        <div className={styles.maintenanceDetail}>
                          <span className={styles.detailLabel}>الشركة:</span>
                          <span className={styles.detailValue}>{maintenance.company}</span>
                        </div>
                        <div className={styles.maintenanceDetail}>
                          <span className={styles.detailLabel}>الاتصال:</span>
                          <span className={styles.detailValue}>{maintenance.contact}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.maintenanceStatus}>
                      <span className={`${styles.statusBadge} ${styles[maintenance.status.toLowerCase()]}`}>
                        {maintenance.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={styles.scheduleBtn}>
                + جدولة صيانة جديدة
              </button>
            </div>
          </div>

          {/* Current Tenants Section */}
          <div className={styles.tenantsSection}>
            <div className={styles.tenantsHeader}>
              <h2 className={styles.sectionTitle}>المستأجرين الحاليين</h2>
              <div className={styles.tenantsFilters}>
                <select className={styles.filterSelect}>
                  <option>جميع المستأجرين</option>
                  <option>النشطين</option>
                  <option>المنتهية عقودهم</option>
                </select>
                <select className={styles.filterSelect}>
                  <option>تصفية</option>
                  <option>حسب التاريخ</option>
                  <option>حسب الإيجار</option>
                </select>
              </div>
            </div>
            
            <div className={styles.tenantsTable}>
              <div className={styles.tableHeader}>
                <div>المستأجر</div>
                <div>تاريخ البدء</div>
                <div>تاريخ الانتهاء</div>
                <div>الإيجار الشهري</div>
                <div>حالة الدفع</div>
                <div>إجراءات</div>
              </div>
              
              {tenants.map((tenant, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.tenantInfo}>
                    <img src={tenant.avatar} alt={tenant.name} className={styles.tenantAvatar} />
                    <div className={styles.tenantDetails}>
                      <div className={styles.tenantName}>{tenant.name}</div>
                      <div className={styles.tenantEmail}>{tenant.email}</div>
                    </div>
                  </div>
                  <div className={styles.tenantStartDate}>{tenant.startDate}</div>
                  <div className={styles.tenantEndDate}>{tenant.endDate}</div>
                  <div className={styles.tenantRent}>{tenant.monthlyRent}</div>
                  <div className={styles.paymentStatus}>
                    <span className={`${styles.statusBadge} ${styles.paid}`}>{tenant.paymentStatus}</span>
                  </div>
                  <div className={styles.tenantActions}>
                    <button className={styles.actionBtn}>👁️</button>
                    <button className={styles.actionBtn}>✏️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations Section */}
          <div className={styles.aiRecommendationsSection}>
            <div className={styles.aiHeader}>
              <h2 className={styles.sectionTitle}>توصيات الذكاء الاصطناعي</h2>
              <div className={styles.aiIcon}>🤖</div>
            </div>
            
            <div className={styles.recommendationsGrid}>
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className={styles.recommendationCard}>
                  <div className={styles.recommendationHeader}>
                    <h3 className={styles.recommendationCategory}>{recommendation.category}</h3>
                    <div className={styles.recommendationIcon}>
                      {recommendation.category === 'تحسين الدخل' ? '💰' : '💡'}
                    </div>
                  </div>
                  
                  <div className={styles.recommendationContent}>
                    <h4 className={styles.recommendationTitle}>{recommendation.title}</h4>
                    <p className={styles.recommendationDescription}>{recommendation.description}</p>
                    <button className={styles.recommendationAction}>
                      {recommendation.action}
                    </button>
                  </div>
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
