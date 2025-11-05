import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/ContractManagement.module.css'

export default function ContractManagement() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [contracts, setContracts] = useState<any[]>([])
  const [filteredContracts, setFilteredContracts] = useState<any[]>([])
  const [contractMetrics, setContractMetrics] = useState([
    {
      title: 'العقود النشطة',
      value: '0',
      change: '0',
      trend: 'neutral',
    },
    {
      title: 'تنتهي قريباً',
      value: '0',
      change: '0',
      trend: 'neutral',
    },
    {
      title: 'العقود المنتهية',
      value: '0',
      change: '0',
      trend: 'neutral',
    }
  ])
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [formData, setFormData] = useState({
    searchQuery: '',
    city: '',
    propertyType: '',
    rooms: '',
    priceFrom: '',
    priceTo: '',
    areaFrom: '',
    areaTo: '',
    furnished: 'all'
  })

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

  // Helper functions
  const getTenantName = (contract: any) => {
    if (contract.tenant) {
      return `${contract.tenant.firstName} ${contract.tenant.lastName}`
    } else if (contract.tenantName) {
      return contract.tenantName
    }
    return 'غير معروف'
  }

  const getStatusColor = (status: string) => {
    if (status === 'نشط') return 'active'
    if (status === 'منتهي' || status === 'expired') return 'expired'
    if (status === 'قيد التوقيع' || status === 'معلق' || status === 'pending') return 'pending'
    if (status === 'مسودة' || status === 'draft') return 'draft'
    return 'neutral'
  }

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

  const getDaysUntilExpiry = (endDate: string) => {
    if (!endDate) return null
    try {
      const end = new Date(endDate)
      const today = new Date()
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diff
    } catch {
      return null
    }
  }

  // Fetch contracts
  useEffect(() => {
    if (ownerId) {
      fetchContracts()
    }
  }, [ownerId])

  // Filter contracts based on active tab and search query
  useEffect(() => {
    let filtered = contracts

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(contract => {
        const status = contract.status
        if (activeTab === 'active') return status === 'نشط'
        if (activeTab === 'pending') return status === 'قيد التوقيع' || status === 'معلق'
        if (activeTab === 'expired') return status === 'منتهي'
        if (activeTab === 'drafts') return status === 'مسودة'
        return true
      })
    }

    // Filter by search query
    if (formData.searchQuery.trim()) {
      const query = formData.searchQuery.toLowerCase()
      filtered = filtered.filter(contract => {
        const tenantName = getTenantName(contract).toLowerCase()
        const propertyName = contract.property?.name?.toLowerCase() || ''
        const contractType = contract.type?.toLowerCase() || ''
        return tenantName.includes(query) || 
               propertyName.includes(query) || 
               contractType.includes(query)
      })
    }

    // Filter by city
    if (formData.city) {
      filtered = filtered.filter(contract => 
        contract.property?.city?.toLowerCase().includes(formData.city.toLowerCase())
      )
    }

    // Filter by property type
    if (formData.propertyType) {
      filtered = filtered.filter(contract => 
        contract.property?.type === formData.propertyType || 
        contract.property?.propertySubType === formData.propertyType
      )
    }

    // Filter by rooms
    if (formData.rooms) {
      filtered = filtered.filter(contract => 
        contract.property?.rooms === formData.rooms
      )
    }

    // Filter by price range
    if (formData.priceFrom) {
      const priceFrom = parseFloat(formData.priceFrom)
      filtered = filtered.filter(contract => 
        contract.property?.monthlyRent && contract.property.monthlyRent >= priceFrom
      )
    }
    if (formData.priceTo) {
      const priceTo = parseFloat(formData.priceTo)
      filtered = filtered.filter(contract => 
        contract.property?.monthlyRent && contract.property.monthlyRent <= priceTo
      )
    }

    // Filter by area range
    if (formData.areaFrom) {
      const areaFrom = parseFloat(formData.areaFrom)
      filtered = filtered.filter(contract => 
        contract.property?.area && contract.property.area >= areaFrom
      )
    }
    if (formData.areaTo) {
      const areaTo = parseFloat(formData.areaTo)
      filtered = filtered.filter(contract => 
        contract.property?.area && contract.property.area <= areaTo
      )
    }

    // Filter by furnished status
    if (formData.furnished !== 'all') {
      filtered = filtered.filter(contract => {
        const propertyStatus = contract.property?.status?.toLowerCase() || ''
        if (formData.furnished === 'furnished') {
          return propertyStatus.includes('مفروش')
        } else if (formData.furnished === 'unfurnished') {
          return propertyStatus.includes('غير مفروش') || (!propertyStatus.includes('مفروش') && propertyStatus)
        }
        return true
      })
    }

    setFilteredContracts(filtered)
  }, [contracts, activeTab, formData])

  // Calculate metrics
  useEffect(() => {
    if (contracts.length > 0) {
      const active = contracts.filter(c => c.status === 'نشط').length
      const expiring = contracts.filter(c => {
        if (c.status !== 'نشط' || !c.endDate) return false
        const endDate = new Date(c.endDate)
        const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0
      }).length
      const expired = contracts.filter(c => c.status === 'منتهي' || (c.endDate && new Date(c.endDate) < new Date())).length

      setContractMetrics([
        {
          title: 'العقود النشطة',
          value: active.toString(),
          change: active > 0 ? `${active} عقد نشط` : 'لا توجد عقود نشطة',
          trend: active > 0 ? 'up' : 'neutral',
        },
        {
          title: 'تنتهي قريباً',
          value: expiring.toString(),
          change: expiring > 0 ? `${expiring} عقد خلال 30 يوم` : 'لا توجد عقود تنتهي قريباً',
          trend: expiring > 0 ? 'up' : 'neutral',
        },
        {
          title: 'العقود المنتهية',
          value: expired.toString(),
          change: expired > 0 ? `${expired} عقد منتهي` : 'لا توجد عقود منتهية',
          trend: 'neutral',
        }
      ])
    }
  }, [contracts])

  const fetchContracts = async () => {
    if (!ownerId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/contracts?ownerId=${ownerId}`)
      if (response.ok) {
        const data = await response.json()
        setContracts(data)
      } else {
        console.error('Failed to fetch contracts')
        setContracts([])
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate renewal notifications from real contracts
  const renewalNotifications = contracts
    .filter(contract => {
      if (!contract.endDate) return false
      const daysUntilExpiry = getDaysUntilExpiry(contract.endDate)
      return daysUntilExpiry !== null && daysUntilExpiry <= 45 && daysUntilExpiry >= -30
    })
    .map(contract => {
      const daysUntilExpiry = getDaysUntilExpiry(contract.endDate)
      const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0
      const isUrgent = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0

      return {
        type: isExpired ? 'expired' : 'expiring',
        title: isExpired 
          ? `عقد ${contract.type} منتهي` 
          : `عقد ${contract.type} ينتهي قريباً`,
        description: isExpired
          ? `العقد # ${contract.id.slice(0, 8)} انتهى في ${formatDate(contract.endDate)} (منذ ${Math.abs(daysUntilExpiry!)} يوم)`
          : `العقد # ${contract.id.slice(0, 8)} سينتهي في ${formatDate(contract.endDate)} (خلال ${daysUntilExpiry} يوم)`,
        icon: isExpired ? '⚠️' : '🔔',
        urgent: isUrgent || isExpired,
        actions: isExpired ? ['تجديد العقد', 'أرشفة العقد'] : ['تجديد العقد', 'تذكيري لاحقاً'],
        contractId: contract.id
      }
    })
    .slice(0, 5) // Show max 5 notifications

  const contractTemplates = [
    {
      title: 'عقد إيجار سكني',
      description: 'قالب قياسي لعقود الإيجار السكني يتوافق مع القوانين المحلية',
      features: ['سهل التخصيص', 'معتمد قانونياً'],
      icon: '/icons/مالك عقار.svg',
      action: 'استخدام القالب'
    },
    {
      title: 'عقد بيع عقاري',
      description: 'قالب شامل لعقود البيع العقاري مع ضمانات قانونية كاملة',
      features: ['حماية عالية', 'معتمد قانونياً'],
      icon: '/icons/مالك عقار.svg',
      action: 'استخدام القالب'
    },
    {
      title: 'عقد إيجار تجاري',
      description: 'قالب متكامل لعقود الإيجار التجاري مع شروط مفصلة',
      features: ['شروط مفصلة', 'معتمد قانونياً'],
      icon: '/icons/مالك عقار.svg',
      action: 'استخدام القالب'
    }
  ]

  const tabs = [
    { id: 'all', title: 'جميع العقود', active: activeTab === 'all' },
    { id: 'active', title: 'النشطة', active: activeTab === 'active' },
    { id: 'pending', title: 'قيد التوقيع', active: activeTab === 'pending' },
    { id: 'expired', title: 'المنتهية', active: activeTab === 'expired' },
    { id: 'drafts', title: 'المسودات', active: activeTab === 'drafts' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      furnished: e.target.value
    }))
  }

  const clearFilters = () => {
    setFormData({
      searchQuery: '',
      city: '',
      propertyType: '',
      rooms: '',
      priceFrom: '',
      priceTo: '',
      areaFrom: '',
      areaTo: '',
      furnished: 'all'
    })
  }

  // Get unique values for filters
  const cities = Array.from(new Set(contracts.map(c => c.property?.city).filter(Boolean)))
  const propertyTypes = Array.from(new Set(contracts.map(c => c.property?.type || c.property?.propertySubType).filter(Boolean)))

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div className={styles.contractManagementPage}>
      {/* Header */}
      <OwnerNavigation currentPage="contract-management" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>إدارة العقود</h1>
          </div>

          {/* Contract Overview Section */}
          <div className={styles.contractOverviewSection}>
            <div className={styles.searchAndCreate}>
              <div className={styles.searchSection}>
                <div className={styles.searchIcon}>🔍</div>
                <input
                  type="text"
                  name="searchQuery"
                  value={formData.searchQuery}
                  onChange={handleInputChange}
                  placeholder="البحث عن عقود"
                  className={styles.searchInput}
                />
              </div>
              <button 
                className={styles.createContractBtn}
                onClick={() => router.push('/owner/add-tenant')}
              >
                <span className={styles.addIcon}>+</span>
                إنشاء عقد جديد
              </button>
            </div>

            {/* Advanced Search Form */}
            <div className={styles.advancedSearchSection}>
              <div className={styles.advancedSearchHeader}>
                <h3 className={styles.advancedSearchTitle}>البحث المتقدم</h3>
                <button 
                  className={styles.toggleAdvancedBtn}
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                  {showAdvancedSearch ? '▲' : '▼'}
                </button>
              </div>

              {showAdvancedSearch && (
                <form className={styles.advancedSearchForm} onSubmit={(e) => e.preventDefault()}>
                  <div className={styles.searchGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">المدينة</label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      >
                        <option value="">جميع المدن</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="propertyType">نوع العقار</label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                      >
                        <option value="">جميع الأنواع</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="rooms">عدد الغرف</label>
                      <select
                        id="rooms"
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleInputChange}
                      >
                        <option value="">أي عدد</option>
                        <option value="1">1 غرفة</option>
                        <option value="2">2 غرف</option>
                        <option value="3">3 غرف</option>
                        <option value="4">4 غرف</option>
                        <option value="5+">5+ غرف</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="priceFrom">نطاق السعر - من</label>
                      <input
                        type="number"
                        id="priceFrom"
                        name="priceFrom"
                        value={formData.priceFrom}
                        onChange={handleInputChange}
                        placeholder="من"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="priceTo">نطاق السعر - إلى</label>
                      <input
                        type="number"
                        id="priceTo"
                        name="priceTo"
                        value={formData.priceTo}
                        onChange={handleInputChange}
                        placeholder="إلى"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="areaFrom">المساحة (م²) - من</label>
                      <input
                        type="number"
                        id="areaFrom"
                        name="areaFrom"
                        value={formData.areaFrom}
                        onChange={handleInputChange}
                        placeholder="من"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="areaTo">المساحة (م²) - إلى</label>
                      <input
                        type="number"
                        id="areaTo"
                        name="areaTo"
                        value={formData.areaTo}
                        onChange={handleInputChange}
                        placeholder="إلى"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>الحالة</label>
                      <div className={styles.radioGroup}>
                        <label>
                          <input
                            type="radio"
                            name="furnished"
                            value="all"
                            checked={formData.furnished === 'all'}
                            onChange={handleRadioChange}
                          />
                          الكل
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="furnished"
                            value="furnished"
                            checked={formData.furnished === 'furnished'}
                            onChange={handleRadioChange}
                          />
                          مفروش
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="furnished"
                            value="unfurnished"
                            checked={formData.furnished === 'unfurnished'}
                            onChange={handleRadioChange}
                          />
                          غير مفروش
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.searchActions}>
                    <button 
                      type="button" 
                      className={styles.searchBtn}
                      onClick={() => setShowAdvancedSearch(false)}
                    >
                      🔍 بحث
                    </button>
                    {(formData.city || formData.propertyType || formData.priceFrom || formData.areaFrom || formData.furnished !== 'all') && (
                      <button 
                        type="button" 
                        className={styles.clearBtn}
                        onClick={clearFilters}
                      >
                        مسح الفلاتر
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Contract Metrics */}
            <div className={styles.metricsGrid}>
              {contractMetrics.map((metric, index) => (
                <div key={index} className={styles.metricCard}>
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

          {/* Smart Assistant Section */}
          <div className={styles.smartAssistantSection}>
            <div className={styles.assistantHeader}>
              <div className={styles.assistantIcon}>💡</div>
              <h2 className={styles.assistantTitle}>المساعد الذكي لإدارة العقود</h2>
            </div>
            
            <div className={styles.assistantDescription}>
              <p>
                استخدم تقنية الذكاء الاصطناعي لتحليل وإدارة عقودك بكفاءة أعلى، سيساعدك المساعد الذكي في تحديد العقود التي تحتاج إلى تجديد وتوقع المشكلات المحتملة.
              </p>
            </div>
            
            <button className={styles.activateAssistantBtn}>
              تفعيل المساعد الذكي
            </button>
          </div>

          {/* Contracts List Section */}
          <div className={styles.contractsListSection}>
            {/* Tabs */}
            <div className={styles.tabsContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${tab.active ? styles.active : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Contracts Table */}
            <div className={styles.contractsTable}>
              <div className={styles.tableHeader}>
                <div>اسم العقد</div>
                <div>المستأجر</div>
                <div>العقار</div>
                <div>الحالة</div>
                <div>تاريخ الانتهاء</div>
                <div>الإجراءات</div>
              </div>

              {loading ? (
                <div className={styles.loadingState}>
                  <p>جاري تحميل العقود...</p>
                </div>
              ) : filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => {
                  const statusColor = getStatusColor(contract.status)
                  return (
                    <div key={contract.id} className={`${styles.tableRow} ${styles[statusColor]}`}>
                      <div className={styles.contractName}>{contract.type}</div>
                      <div className={styles.tenantName}>{getTenantName(contract)}</div>
                      <div className={styles.propertyName}>
                        {contract.property?.name || contract.property?.address || '-'}
                      </div>
                      <div className={styles.contractStatus}>
                        <span className={`${styles.statusBadge} ${styles[statusColor]}`}>
                          {contract.status}
                        </span>
                      </div>
                      <div className={styles.endDate}>{formatDate(contract.endDate)}</div>
                      <div className={styles.actions}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => router.push(`/owner/property-details?contractId=${contract.id}`)}
                          title="عرض التفاصيل"
                        >
                          👁️
                        </button>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => router.push(`/owner/add-tenant?contractId=${contract.id}&edit=true`)}
                          title="تعديل"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    {formData.searchQuery.trim() 
                      ? 'لا توجد نتائج للبحث' 
                      : activeTab === 'all'
                      ? 'لا توجد عقود حالياً'
                      : `لا توجد عقود ${activeTab === 'active' ? 'نشطة' : activeTab === 'expired' ? 'منتهية' : activeTab === 'pending' ? 'قيد التوقيع' : 'مسودات'}`}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredContracts.length > 0 && (
              <div className={styles.pagination}>
                <span className={styles.paginationInfo}>
                  عرض 1-{filteredContracts.length} من {contracts.length} عقد
                </span>
              </div>
            )}
          </div>

          {/* Renewal Notifications Section */}
          <div className={styles.renewalNotificationsSection}>
            <h2 className={styles.sectionTitle}>إشعارات التجديد</h2>
            
            <div className={styles.notificationsList}>
              {renewalNotifications.length > 0 ? (
                renewalNotifications.map((notification, index) => (
                  <div key={index} className={`${styles.notificationCard} ${styles[notification.type]}`}>
                    <div className={styles.notificationIcon}>{notification.icon}</div>
                    <div className={styles.notificationContent}>
                      <h3 className={styles.notificationTitle}>{notification.title}</h3>
                      <p className={styles.notificationDescription}>{notification.description}</p>
                      <div className={styles.notificationActions}>
                        {notification.actions.map((action, actionIndex) => (
                          <button 
                            key={actionIndex} 
                            className={styles.notificationAction}
                            onClick={() => {
                              if (action === 'تجديد العقد' && notification.contractId) {
                                router.push(`/owner/add-tenant?contractId=${notification.contractId}&renew=true`)
                              }
                            }}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyNotifications}>
                  <p>لا توجد إشعارات تجديد حالياً</p>
                </div>
              )}
            </div>
          </div>

          {/* Contract Templates Section */}
          <div className={styles.contractTemplatesSection}>
            <h2 className={styles.sectionTitle}>قوالب العقود المتاحة</h2>
            
            <div className={styles.templatesGrid}>
              {contractTemplates.map((template, index) => (
                <div key={index} className={styles.templateCard}>
                  <div className={styles.templateContent}>
                    <h3 className={styles.templateTitle}>{template.title}</h3>
                    <p className={styles.templateDescription}>{template.description}</p>
                    <div className={styles.templateFeatures}>
                      {template.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button className={styles.useTemplateBtn}>
                      {template.action}
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
