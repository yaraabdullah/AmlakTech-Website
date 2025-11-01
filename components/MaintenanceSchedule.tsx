import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/MaintenanceSchedule.module.css'

interface Property {
  id: string
  name: string
}

export default function MaintenanceSchedule() {
  const [formData, setFormData] = useState({
    property: '',
    unit: '',
    maintenanceType: '',
    priority: 'medium',
    problemDescription: '',
    contactName: '',
    phoneNumber: '',
    notifyTenant: false,
    selectedDate: '',
    timePeriod: ''
  })

  const [properties, setProperties] = useState<Property[]>([])
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [loadingMaintenance, setLoadingMaintenance] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    fetchOwnerId()
  }, [])

  useEffect(() => {
    if (ownerId) {
      fetchProperties()
      fetchMaintenanceRequests()
    }
  }, [ownerId])

  const fetchMaintenanceRequests = async () => {
    if (!ownerId) return
    
    setLoadingMaintenance(true)
    try {
      const response = await fetch(`/api/maintenance?ownerId=${ownerId}`)
      if (response.ok) {
        const data = await response.json()
        setMaintenanceRequests(data)
      } else {
        console.error('Failed to fetch maintenance requests')
        setMaintenanceRequests([])
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error)
      setMaintenanceRequests([])
    } finally {
      setLoadingMaintenance(false)
    }
  }

  const fetchOwnerId = async () => {
    try {
      // Get user ID from localStorage (from login)
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId')
        const userType = localStorage.getItem('userType')
        
        // Only allow owners to access this page
        if (userId && userType === 'owner') {
          setOwnerId(userId)
          return
        }
      }
      
      // If no userId in localStorage, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error fetching owner ID:', error)
      setLoading(false)
    }
  }

  const fetchProperties = async () => {
    if (!ownerId) return
    
    try {
      const response = await fetch(`/api/properties?ownerId=${ownerId}`)
      if (response.ok) {
        const data = await response.json()
        // Transform API response to Property format
        const propertiesList = data.map((prop: any) => ({
          id: prop.id,
          name: prop.name || `${prop.type} - ${prop.address || prop.city || ''}`
        }))
        setProperties(propertiesList)
      } else {
        console.error('Failed to fetch properties')
        setProperties([])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const units = [
    { id: '101', name: 'شقة 101' },
    { id: '102', name: 'شقة 102' },
    { id: '103', name: 'شقة 103' }
  ]

  const maintenanceTypes = [
    { id: 'electrical', name: 'كهربائي', icon: '⚡' },
    { id: 'plumbing', name: 'سباكة', icon: '💧' },
    { id: 'ac', name: 'تكييف', icon: '❄️' },
    { id: 'general', name: 'عام', icon: '🔧' }
  ]

  const upcomingMaintenance = [
    {
      property: 'Al Amal Tower',
      unit: 'Apartment 101',
      type: 'Electrical',
      typeIcon: '⚡',
      date: 'August 15, 2023',
      status: 'Pending Approval',
      statusColor: 'pending'
    },
    {
      property: 'Al Waha Complex',
      unit: 'Apartment 205',
      type: 'Plumbing',
      typeIcon: '💧',
      date: 'August 18, 2023',
      status: 'Scheduled',
      statusColor: 'scheduled'
    },
    {
      property: 'Al Takhayul Housing',
      unit: 'Apartment 310',
      type: 'AC',
      typeIcon: '❄️',
      date: 'August 20, 2023',
      status: 'Scheduled',
      statusColor: 'scheduled'
    }
  ]

  const smartAssistantFeatures = [
    {
      title: 'تحليل الأنماط',
      description: 'تحليل أنماط الصيانة المتكررة والتنبؤ بالاحتياجات المستقبلية'
    },
    {
      title: 'جدولة تلقائية',
      description: 'اقتراح أفضل الأوقات للصيانة بناء على توفر الفنيين والمستأجرين'
    },
    {
      title: 'تقدير التكاليف',
      description: 'تقدير تكاليف الصيانة بناءً على البيانات التاريخية ونوع المشكلة'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ownerId || !formData.property || !formData.maintenanceType || !formData.problemDescription) {
      setSubmitError('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Use selectedDate if provided
      let scheduledDate: string | null = null
      if (formData.selectedDate) {
        // Format: YYYY-MM-DD
        scheduledDate = formData.selectedDate
      }

      const requestData = {
        propertyId: formData.property,
        ownerId: ownerId,
        unit: formData.unit || null,
        type: formData.maintenanceType,
        priority: formData.priority,
        problemDescription: formData.problemDescription,
        contactName: formData.contactName || null,
        contactPhone: formData.phoneNumber || null,
        notifyTenant: formData.notifyTenant,
        scheduledDate: scheduledDate,
        timePeriod: formData.timePeriod || null,
      }

      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إرسال طلب الصيانة')
      }

      // Success
      setSubmitSuccess(true)
      
      // Reset form
      setFormData({
        property: '',
        unit: '',
        maintenanceType: '',
        priority: 'medium',
        problemDescription: '',
        contactName: '',
        phoneNumber: '',
        notifyTenant: false,
        selectedDate: '',
        timePeriod: ''
      })

      // Reload maintenance requests
      fetchMaintenanceRequests()

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)

    } catch (error: any) {
      console.error('Error submitting maintenance request:', error)
      setSubmitError(error.message || 'حدث خطأ في إرسال طلب الصيانة')
    } finally {
      setSubmitting(false)
    }
  }

  const [calendarDate, setCalendarDate] = useState(new Date())

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
    const formattedDate = selectedDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
    setFormData(prev => ({
      ...prev,
      selectedDate: formattedDate
    }))
  }

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  const generateCalendarDays = () => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    // Convert Sunday (0) to Arabic week (Sunday = 0, but we need to shift for RTL)
    // Arabic week: Saturday = 0, Sunday = 1, ..., Friday = 6
    const arabicFirstDay = (firstDay + 1) % 7
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < arabicFirstDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getCurrentMonthYear = () => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]
    return `${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`
  }

  const isDateSelected = (day: number | null) => {
    if (!day || !formData.selectedDate) return false
    const selectedDate = new Date(formData.selectedDate)
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === calendarDate.getMonth() &&
           selectedDate.getFullYear() === calendarDate.getFullYear()
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    const today = new Date()
    return today.getDate() === day &&
           today.getMonth() === calendarDate.getMonth() &&
           today.getFullYear() === calendarDate.getFullYear()
  }

  const calendarDays = generateCalendarDays()

  if (loading && !ownerId) {
    return (
      <div className={styles.maintenanceSchedulePage}>
        <OwnerNavigation currentPage="maintenance-schedule" />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.maintenanceSchedulePage}>
      {/* Header */}
      <OwnerNavigation currentPage="maintenance-schedule" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>جدول أعمال الصيانة</h1>
            <p className={styles.pageSubtitle}>
              إدارة وجدولة صيانة العقارات بذكاء وفعالية
            </p>
          </div>

          {/* New Maintenance Request Section */}
          <div className={styles.newMaintenanceSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🔧</span>
                <h2>طلب صيانة جديد</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.maintenanceForm}>
              {/* Success Message */}
              {submitSuccess && (
                <div style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  ✅ تم إرسال طلب الصيانة بنجاح
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  ❌ {submitError}
                </div>
              )}

              <div className={styles.formGrid}>
                {/* Left Column - Form Fields */}
                <div className={styles.formFields}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>العقار</label>
                    <select
                      name="property"
                      value={formData.property}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                      disabled={loading || properties.length === 0}
                    >
                      <option value="">
                        {loading ? 'جاري التحميل...' : properties.length === 0 ? 'لا توجد عقارات' : 'اختر العقار'}
                      </option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
                    {properties.length === 0 && !loading && (
                      <p style={{ fontSize: '0.875rem', color: '#ef4444', marginTop: '0.5rem' }}>
                        لم يتم العثور على عقارات. قم بإضافة عقار أولاً.
                      </p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>الوحدة</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                    >
                      <option value="">اختر الوحدة</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>نوع الصيانة</label>
                    <select
                      name="maintenanceType"
                      value={formData.maintenanceType}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                    >
                      <option value="">اختر نوع الصيانة</option>
                      {maintenanceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>الأولوية</label>
                    <div className={styles.priorityGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="priority"
                          value="low"
                          checked={formData.priority === 'low'}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>منخفضة</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="priority"
                          value="medium"
                          checked={formData.priority === 'medium'}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>متوسطة</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="priority"
                          value="high"
                          checked={formData.priority === 'high'}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>عالية</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>وصف المشكلة</label>
                    <textarea
                      name="problemDescription"
                      value={formData.problemDescription}
                      onChange={handleInputChange}
                      placeholder="اكتب وصفاً مفصلاً للمشكلة"
                      className={styles.textarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>اسم الشخص المسؤول</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="الاسم الكامل"
                      className={styles.fieldInput}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxx"
                      className={styles.fieldInput}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="notifyTenant"
                        checked={formData.notifyTenant}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>إرسال إشعار للمستأجر</span>
                    </label>
                  </div>
                </div>

                {/* Right Column - Calendar */}
                <div className={styles.calendarSection}>
                  <h3 className={styles.calendarTitle}>تاريخ الصيانة</h3>
                  
                  <div className={styles.calendar}>
                    <div className={styles.calendarHeader}>
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className={styles.calendarNavBtn}
                        aria-label="الشهر السابق"
                      >
                        ‹
                      </button>
                      <h4 className={styles.monthYear}>{getCurrentMonthYear()}</h4>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className={styles.calendarNavBtn}
                        aria-label="الشهر التالي"
                      >
                        ›
                      </button>
                    </div>
                    
                    <div className={styles.calendarGrid}>
                      <div className={styles.dayHeader}>السبت</div>
                      <div className={styles.dayHeader}>الأحد</div>
                      <div className={styles.dayHeader}>الاثنين</div>
                      <div className={styles.dayHeader}>الثلاثاء</div>
                      <div className={styles.dayHeader}>الأربعاء</div>
                      <div className={styles.dayHeader}>الخميس</div>
                      <div className={styles.dayHeader}>الجمعة</div>
                      
                      {calendarDays.map((day, index) => (
                        <div
                          key={`${day}-${index}`}
                          className={`${styles.calendarDay} ${
                            day === null ? styles.emptyDay : ''
                          } ${isToday(day) ? styles.today : ''} ${
                            isDateSelected(day) ? styles.selected : ''
                          }`}
                          onClick={() => day !== null && handleDateSelect(day)}
                          style={{
                            cursor: day !== null ? 'pointer' : 'default',
                            opacity: day === null ? 0.3 : 1
                          }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    {formData.selectedDate && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-family-primary)'
                      }}>
                        التاريخ المحدد: {new Date(formData.selectedDate).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  <div className={styles.timePeriod}>
                    <label className={styles.fieldLabel}>الفترة الزمنية</label>
                    <select
                      name="timePeriod"
                      value={formData.timePeriod}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                    >
                      <option value="">اختر الفترة الزمنية</option>
                      <option value="morning">صباحاً (8:00 - 12:00)</option>
                      <option value="afternoon">بعد الظهر (12:00 - 16:00)</option>
                      <option value="evening">مساءً (16:00 - 20:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={submitting || loading || properties.length === 0}
              >
                <span className={styles.submitIcon}>📅</span>
                {submitting ? 'جاري الإرسال...' : 'جدولة الصيانة'}
              </button>
            </form>
          </div>

          {/* Smart Assistant Section */}
          <div className={styles.smartAssistantSection}>
            <div className={styles.assistantHeader}>
              <div className={styles.assistantHeaderContent}>
                <div className={styles.assistantIcon}>
                  <Image 
                    src="/icons/ai-analytics.svg"
                    alt="المساعد الذكي"
                    width={40}
                    height={40}
                  />
                </div>
                <h2 className={styles.assistantTitle}>المساعد الذكي</h2>
              </div>
            </div>

            <p className={styles.assistantDescription}>
              يمكن للمساعد الذكي تحليل بيانات الصيانة وتقديم توصيات لتحسين إدارة العقارات
            </p>

            <div className={styles.assistantFeatures}>
              {smartAssistantFeatures.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance Section */}
          <div className={styles.upcomingMaintenanceSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>الصيانة القادمة</h2>
              <button className={styles.viewAllBtn}>عرض الكل</button>
            </div>

            <div className={styles.maintenanceTable}>
              <div className={styles.tableHeader}>
                <div>العقار</div>
                <div>الوحدة</div>
                <div>نوع الصيانة</div>
                <div>التاريخ</div>
                <div>الحالة</div>
                <div>الإجراءات</div>
              </div>

              {loadingMaintenance ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>
              ) : maintenanceRequests.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  لا توجد طلبات صيانة حالياً
                </div>
              ) : (
                maintenanceRequests.map((maintenance) => {
                  // Map maintenance type to icon
                  const typeIcons: { [key: string]: string } = {
                    'electrical': '⚡',
                    'plumbing': '💧',
                    'ac': '❄️',
                    'general': '🔧'
                  }
                  
                  const typeNames: { [key: string]: string } = {
                    'electrical': 'كهربائي',
                    'plumbing': 'سباكة',
                    'ac': 'تكييف',
                    'general': 'عام'
                  }

                  // Map status to color
                  const statusColors: { [key: string]: string } = {
                    'قيد الانتظار': 'pending',
                    'مجدولة': 'scheduled',
                    'مكتملة': 'completed',
                    'ملغاة': 'cancelled'
                  }

                  const formatDate = (date: string | null) => {
                    if (!date) return '-'
                    const d = new Date(date)
                    return d.toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }

                  return (
                    <div key={maintenance.id} className={styles.tableRow}>
                      <div className={styles.propertyName}>
                        {maintenance.property?.name || 'غير محدد'}
                      </div>
                      <div className={styles.unitName}>
                        {maintenance.unit || '-'}
                      </div>
                      <div className={styles.maintenanceType}>
                        <span className={styles.typeIcon}>
                          {typeIcons[maintenance.type] || '🔧'}
                        </span>
                        <span className={styles.typeName}>
                          {typeNames[maintenance.type] || maintenance.type}
                        </span>
                      </div>
                      <div className={styles.maintenanceDate}>
                        {maintenance.scheduledDate 
                          ? formatDate(maintenance.scheduledDate) 
                          : formatDate(maintenance.createdAt)}
                      </div>
                      <div className={styles.maintenanceStatus}>
                        <span className={`${styles.statusBadge} ${styles[statusColors[maintenance.status] || 'pending']}`}>
                          {maintenance.status}
                        </span>
                      </div>
                      <div className={styles.maintenanceActions}>
                        <button className={styles.actionBtn}>✏️</button>
                        <button className={styles.actionBtn}>👁️</button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
