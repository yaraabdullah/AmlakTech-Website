import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/PropertyDetails.module.css'

interface Property {
  id: string
  name: string
  type: string
  address: string
  city: string
  area: number | null
  rooms: string | null
  bathrooms: string | null
  monthlyRent: number | null
  status: string
  description: string | null
  images: string | null
  features: string | null
  constructionYear: string | null
  createdAt: string
}

export default function PropertyDetails() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  useEffect(() => {
    fetchOwnerId()
  }, [])

  useEffect(() => {
    if (ownerId) {
      fetchProperties()
    }
  }, [ownerId])

  const fetchOwnerId = async () => {
    try {
      // Try to get user ID from localStorage (from login)
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId')
        const userType = localStorage.getItem('userType')
        
        // Only allow owners to access this page
        if (userId && userType === 'owner') {
          setOwnerId(userId)
          return
        }
      }

      // Fallback: Get first owner (for demo/testing)
      const response = await fetch('/api/user/get-owner-id')
      if (response.ok) {
        const owner = await response.json()
        setOwnerId(owner.id)
      } else {
        // No user found, redirect to login
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching owner ID:', error)
      setLoading(false)
      router.push('/login')
    }
  }

  const fetchProperties = async () => {
    if (!ownerId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/properties?ownerId=${ownerId}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
        // Auto-select first property if available
        if (data.length > 0) {
          setSelectedProperty(data[0])
        }
      } else {
        console.error('Failed to fetch properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
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

  if (loading || !ownerId) {
    return (
      <div className={styles.propertyDetailsPage}>
        <OwnerNavigation currentPage="property-details" />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className={styles.propertyDetailsPage}>
        <OwnerNavigation currentPage="property-details" />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.emptyState}>
              <h2>لا توجد عقارات</h2>
              <p>لم تقم بإضافة أي عقارات بعد</p>
              <Link href="/owner/add-property">
                <button className={styles.addPropertyBtn}>
                  إضافة عقار جديد
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Use selected property or first property
  const propertyData = selectedProperty || properties[0]
  const propertyImages = propertyData.images ? JSON.parse(propertyData.images) : []
  const propertyFeatures = propertyData.features ? JSON.parse(propertyData.features) : {}

  return (
    <div className={styles.propertyDetailsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="property-details" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={`${styles.container} ${properties.length > 1 ? styles.hasSidebar : ''}`}>
          {/* Properties List Sidebar */}
          {properties.length > 1 && (
            <div className={styles.propertiesList}>
              <h3 className={styles.listTitle}>عقاراتك</h3>
              <div className={styles.propertiesListItems}>
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className={`${styles.propertyListItem} ${selectedProperty?.id === property.id ? styles.active : ''}`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className={styles.listItemName}>{property.name}</div>
                    <div className={styles.listItemLocation}>{property.city}</div>
                    <div className={styles.listItemStatus}>{property.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={properties.length > 1 ? styles.mainContentArea : ''}>
            {/* Property Header */}
            <div className={styles.propertyHeader}>
            <div className={styles.propertyInfo}>
              <div className={styles.propertyTitle}>
                <h1 className={styles.propertyName}>{propertyData.name}</h1>
                <p className={styles.propertyLocation}>{propertyData.address}, {propertyData.city}</p>
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
                {propertyData.area && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>المساحة:</span>
                    <span className={styles.detailValue}>{propertyData.area} متر مربع</span>
                  </div>
                )}
                {propertyData.rooms && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>عدد الغرف:</span>
                    <span className={styles.detailValue}>{propertyData.rooms}</span>
                  </div>
                )}
                {propertyData.bathrooms && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>الحمامات:</span>
                    <span className={styles.detailValue}>{propertyData.bathrooms}</span>
                  </div>
                )}
                {propertyData.constructionYear && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>سنة البناء:</span>
                    <span className={styles.detailValue}>{propertyData.constructionYear}</span>
                  </div>
                )}
                {propertyData.monthlyRent && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>الإيجار الشهري:</span>
                    <span className={styles.detailValue}>{propertyData.monthlyRent.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                )}
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
                {propertyData.monthlyRent && (
                  <>
                    <div className={styles.financialItem}>
                      <span className={styles.financialLabel}>الإيجار الشهري:</span>
                      <span className={styles.financialValue}>{propertyData.monthlyRent.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                    <div className={styles.financialItem}>
                      <span className={styles.financialLabel}>الدخل السنوي</span>
                      <span className={styles.financialValue}>{(propertyData.monthlyRent * 12).toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  </>
                )}
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>تكاليف الصيانة</span>
                  <span className={styles.financialValue}>-</span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>الضرائب والرسوم</span>
                  <span className={styles.financialValue}>-</span>
                </div>
                {propertyData.monthlyRent && (
                  <div className={styles.financialItem}>
                    <span className={styles.financialLabel}>صافي الربح.</span>
                    <span className={styles.financialValue}>{(propertyData.monthlyRent * 12).toLocaleString('ar-SA')} ر.س</span>
                  </div>
                )}
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
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
