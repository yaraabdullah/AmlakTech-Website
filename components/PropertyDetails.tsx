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
  const [scheduledMaintenance, setScheduledMaintenance] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [loadingContracts, setLoadingContracts] = useState(false)

  useEffect(() => {
    fetchOwnerId()
  }, [])

  useEffect(() => {
    if (ownerId) {
      fetchProperties()
      fetchScheduledMaintenance()
    }
  }, [ownerId])

  useEffect(() => {
    if (ownerId) {
      fetchScheduledMaintenance()
      fetchContracts()
    }
  }, [selectedProperty, ownerId])

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

  const fetchScheduledMaintenance = async () => {
    if (!ownerId) return

    try {
      // Fetch scheduled maintenance (status: مجدولة)
      const params = new URLSearchParams({
        ownerId: ownerId,
        status: 'مجدولة'
      })
      
      // If a specific property is selected, filter by property
      if (selectedProperty?.id) {
        params.append('propertyId', selectedProperty.id)
      }

      const response = await fetch(`/api/maintenance?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setScheduledMaintenance(data)
      } else {
        console.error('Failed to fetch scheduled maintenance')
      }
    } catch (error) {
      console.error('Error fetching scheduled maintenance:', error)
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

  // Format maintenance data from database
  const formatMaintenanceDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    const date = new Date(dateString)
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const formatMaintenanceTime = (timePeriod: string | null) => {
    if (!timePeriod) return 'غير محدد'
    const timeMap: { [key: string]: string } = {
      'morning': 'صباحاً',
      'afternoon': 'بعد الظهر',
      'evening': 'مساءً'
    }
    return timeMap[timePeriod] || timePeriod
  }

  // Fetch contracts (tenants) for selected property
  const fetchContracts = async () => {
    if (!ownerId) {
      console.log('Missing ownerId')
      setContracts([])
      return
    }

    try {
      setLoadingContracts(true)
      // Try fetching all contracts for this owner first (without propertyId filter)
      let url = `/api/contracts?ownerId=${ownerId}`
      
      // If property is selected, filter by propertyId
      if (selectedProperty?.id) {
        url += `&propertyId=${selectedProperty.id}`
      }
      
      console.log('Fetching contracts from:', url)
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Contracts fetched from API:', data)
        console.log('Number of contracts:', data.length)
        console.log('Contract details:', data.map((c: any) => ({
          id: c.id,
          propertyId: c.propertyId,
          tenantId: c.tenantId,
          tenantName: c.tenant?.firstName + ' ' + c.tenant?.lastName || c.tenantName,
          status: c.status
        })))
        
        // Show all contracts (no filter for now)
        setContracts(data)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to fetch contracts:', response.status, errorData)
        setContracts([])
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setContracts([])
    } finally {
      setLoadingContracts(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch (error) {
      return dateString
    }
  }

  // Get payment status (simplified - you can enhance this based on payments table)
  const getPaymentStatus = (contract: any) => {
    // For now, return 'مدفوع' as default
    // You can enhance this by checking the payments table
    return 'مدفوع'
  }

  // Get tenant display name
  const getTenantName = (contract: any) => {
    if (contract.tenant) {
      return `${contract.tenant.firstName} ${contract.tenant.lastName}`
    } else if (contract.tenantName) {
      return contract.tenantName
    }
    return 'غير معروف'
  }

  // Get tenant email
  const getTenantEmail = (contract: any) => {
    if (contract.tenant?.email) {
      return contract.tenant.email
    } else if (contract.tenantEmail) {
      return contract.tenantEmail
    }
    return '-'
  }

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
              <button 
                className={styles.editBtn}
                onClick={() => {
                  const propertyToEdit = selectedProperty || properties[0]
                  if (propertyToEdit?.id) {
                    router.push(`/owner/edit-property?id=${propertyToEdit.id}`)
                  }
                }}
              >
                تعديل العقار
              </button>
              <button 
                className={styles.addTenantBtn}
                onClick={() => {
                  const propertyToUse = selectedProperty || properties[0]
                  if (propertyToUse?.id) {
                    router.push(`/owner/add-tenant?propertyId=${propertyToUse.id}`)
                  } else {
                    router.push('/owner/add-tenant')
                  }
                }}
              >
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
                {scheduledMaintenance.length > 0 ? (
                  scheduledMaintenance.map((maintenance) => (
                    <div key={maintenance.id} className={styles.maintenanceItem}>
                      <div className={styles.maintenanceContent}>
                        <h4 className={styles.maintenanceTitle}>
                          {maintenance.type} - {maintenance.property?.name || 'عقار'}
                        </h4>
                        <p className={styles.maintenanceDescription}>{maintenance.problemDescription}</p>
                        <div className={styles.maintenanceDetails}>
                          {maintenance.scheduledDate && (
                            <div className={styles.maintenanceDetail}>
                              <span className={styles.detailLabel}>التاريخ:</span>
                              <span className={styles.detailValue}>{formatMaintenanceDate(maintenance.scheduledDate)}</span>
                            </div>
                          )}
                          {maintenance.timePeriod && (
                            <div className={styles.maintenanceDetail}>
                              <span className={styles.detailLabel}>الوقت:</span>
                              <span className={styles.detailValue}>{formatMaintenanceTime(maintenance.timePeriod)}</span>
                            </div>
                          )}
                          {maintenance.contactName && (
                            <div className={styles.maintenanceDetail}>
                              <span className={styles.detailLabel}>المسؤول:</span>
                              <span className={styles.detailValue}>{maintenance.contactName}</span>
                            </div>
                          )}
                          {maintenance.contactPhone && (
                            <div className={styles.maintenanceDetail}>
                              <span className={styles.detailLabel}>الاتصال:</span>
                              <span className={styles.detailValue}>{maintenance.contactPhone}</span>
                            </div>
                          )}
                          {maintenance.unit && (
                            <div className={styles.maintenanceDetail}>
                              <span className={styles.detailLabel}>الوحدة:</span>
                              <span className={styles.detailValue}>{maintenance.unit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.maintenanceStatus}>
                        <span className={`${styles.statusBadge} ${styles[maintenance.status.toLowerCase().replace(' ', '')] || styles.default}`}>
                          {maintenance.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyMaintenance}>
                    <p>لا توجد صيانة مجدولة حالياً</p>
                  </div>
                )}
              </div>
              
              <button 
                className={styles.scheduleBtn}
                onClick={() => {
                  if (selectedProperty?.id) {
                    router.push(`/owner/maintenance-schedule?propertyId=${selectedProperty.id}`)
                  } else {
                    router.push('/owner/maintenance-schedule')
                  }
                }}
              >
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
              
              {loadingContracts ? (
                <div className={styles.emptyTenants}>
                  <p>جاري تحميل بيانات المستأجرين...</p>
                </div>
              ) : contracts.length > 0 ? (
                contracts.map((contract) => (
                  <div key={contract.id} className={styles.tableRow}>
                    <div className={styles.tenantInfo}>
                      <div className={styles.tenantAvatar}>
                        {getTenantName(contract).charAt(0)}
                      </div>
                      <div className={styles.tenantDetails}>
                        <div className={styles.tenantName}>{getTenantName(contract)}</div>
                        <div className={styles.tenantEmail}>{getTenantEmail(contract)}</div>
                      </div>
                    </div>
                    <div className={styles.tenantStartDate}>{formatDate(contract.startDate)}</div>
                    <div className={styles.tenantEndDate}>{formatDate(contract.endDate)}</div>
                    <div className={styles.tenantRent}>
                      {contract.monthlyRent ? `${contract.monthlyRent.toLocaleString('ar-SA')} ريال` : '-'}
                    </div>
                    <div className={styles.paymentStatus}>
                      <span className={`${styles.statusBadge} ${styles.paid}`}>
                        {getPaymentStatus(contract)}
                      </span>
                    </div>
                    <div className={styles.tenantActions}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => router.push(`/owner/contract-management?contractId=${contract.id}`)}
                        title="عرض التفاصيل"
                      >
                        👁️
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => router.push(`/owner/contract-management?contractId=${contract.id}&edit=true`)}
                        title="تعديل"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyTenants}>
                  <p>لا يوجد مستأجرين حالياً لهذا العقار</p>
                </div>
              )}
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
