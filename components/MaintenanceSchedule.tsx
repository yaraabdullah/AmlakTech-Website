import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/MaintenanceSchedule.module.css'

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

  const properties = [
    { id: '1', name: 'عمارة الرياض' },
    { id: '2', name: 'مجمع الأمل' },
    { id: '3', name: 'برج النخيل' }
  ]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Maintenance request submitted:', formData)
    // Handle form submission here
  }

  const generateCalendarDays = () => {
    const days = []
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const calendarDays = generateCalendarDays()

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
                    >
                      <option value="">اختر العقار</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
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
                      <h4 className={styles.monthYear}>يوليو 2025</h4>
                    </div>
                    
                    <div className={styles.calendarGrid}>
                      <div className={styles.dayHeader}>الأحد</div>
                      <div className={styles.dayHeader}>الاثنين</div>
                      <div className={styles.dayHeader}>الثلاثاء</div>
                      <div className={styles.dayHeader}>الأربعاء</div>
                      <div className={styles.dayHeader}>الخميس</div>
                      <div className={styles.dayHeader}>الجمعة</div>
                      <div className={styles.dayHeader}>السبت</div>
                      
                      {calendarDays.map((day) => (
                        <div
                          key={day}
                          className={`${styles.calendarDay} ${
                            day >= 28 && day <= 31 ? styles.highlighted : ''
                          } ${day === 29 ? styles.selected : ''}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
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

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.submitIcon}>📅</span>
                جدولة الصيانة
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

              {upcomingMaintenance.map((maintenance, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.propertyName}>{maintenance.property}</div>
                  <div className={styles.unitName}>{maintenance.unit}</div>
                  <div className={styles.maintenanceType}>
                    <span className={styles.typeIcon}>{maintenance.typeIcon}</span>
                    <span className={styles.typeName}>{maintenance.type}</span>
                  </div>
                  <div className={styles.maintenanceDate}>{maintenance.date}</div>
                  <div className={styles.maintenanceStatus}>
                    <span className={`${styles.statusBadge} ${styles[maintenance.statusColor]}`}>
                      {maintenance.status}
                    </span>
                  </div>
                  <div className={styles.maintenanceActions}>
                    <button className={styles.actionBtn}>✏️</button>
                    <button className={styles.actionBtn}>👁️</button>
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
