import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import TenantNavigation from './TenantNavigation'
import Footer from './Footer'
import styles from '../styles/AccountSettings.module.css'

export default function TenantAccountSettings() {
  const [activeSection, setActiveSection] = useState('personal')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    nationalId: '',
    phone: '',
    city: '',
    neighborhood: '',
    postalCode: '',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    
    // Notifications
    emailNotifications: true,
    contractNotifications: true,
    maintenanceNotifications: true,
    paymentNotifications: true,
    aiNotifications: true,
  })

  const settingsSections = [
    { id: 'personal', title: 'المعلومات الشخصية', icon: '/icons/Personal info.svg', active: activeSection === 'personal' },
    { id: 'security', title: 'الأمان وكلمة المرور', icon: '/icons/Passowrd.svg', active: activeSection === 'security' },
    { id: 'notifications', title: 'الإشعارات', icon: '/icons/Notifications.svg', active: activeSection === 'notifications' },
  ]

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get user ID from localStorage
      let userId: string | null = null
      
      if (typeof window !== 'undefined') {
        userId = localStorage.getItem('userId')
        const userType = localStorage.getItem('userType')
        
        // Only allow tenants
        if (!userId || (userType !== 'tenant' && userType !== 'مستأجر')) {
          router.push('/login')
          return
        }
      }

      if (userId) {
        setUserId(userId)
        
        // Fetch full user data
        const userResponse = await fetch(`/api/user/${userId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            nationalId: userData.nationalId || '',
            phone: userData.phone || '',
            city: userData.city || '',
            neighborhood: userData.neighborhood || '',
            postalCode: userData.postalCode || '',
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent, section: string) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)
    setSaving(true)

    try {
      if (section === 'personal') {
        // Update personal information
        const response = await fetch('/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            nationalId: formData.nationalId || null,
            phone: formData.phone,
            city: formData.city,
            neighborhood: formData.neighborhood,
            postalCode: formData.postalCode,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'فشل تحديث المعلومات')
        }

        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`)
          localStorage.setItem('userEmail', formData.email)
        }

        setSuccessMessage('تم تحديث المعلومات الشخصية بنجاح')
      } else if (section === 'security') {
        // Update password
        if (formData.newPassword !== formData.confirmPassword) {
          setErrorMessage('كلمات المرور غير متطابقة')
          setSaving(false)
          return
        }

        if (!formData.currentPassword) {
          setErrorMessage('يجب إدخال كلمة المرور الحالية')
          setSaving(false)
          return
        }

        const response = await fetch('/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            newPassword: formData.newPassword,
            currentPassword: formData.currentPassword,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'فشل تحديث كلمة المرور')
        }

        setSuccessMessage('تم تحديث كلمة المرور بنجاح')
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
      }
    } catch (error: any) {
      console.error(`Error updating ${section}:`, error)
      setErrorMessage(error.message || 'حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.accountSettingsPage}>
        <TenantNavigation currentPage="account-settings" />
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
    <div className={styles.accountSettingsPage}>
      {/* Header */}
      <TenantNavigation currentPage="account-settings" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>إعدادات الحساب</h1>
            <p className={styles.pageSubtitle}>
              قم بتعديل معلومات حسابك وإعدادات الأمان والخصوصية
            </p>
          </div>

          <div className={styles.settingsLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <nav className={styles.settingsNav}>
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    className={`${styles.settingsNavItem} ${section.active ? styles.active : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon && (
                      <Image
                        src={section.icon}
                        alt={section.title}
                        width={20}
                        height={20}
                        className={styles.navIcon}
                      />
                    )}
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className={styles.settingsContent}>
              {successMessage && (
                <div className={styles.successMessage}>
                  ✓ {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className={styles.errorMessage}>
                  ✕ {errorMessage}
                </div>
              )}

              {/* Personal Information Section */}
              {activeSection === 'personal' && (
                <form onSubmit={(e) => handleSubmit(e, 'personal')} className={styles.settingsForm}>
                  <h2 className={styles.sectionTitle}>المعلومات الشخصية</h2>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">الاسم الأول</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">الاسم الأخير</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">البريد الإلكتروني</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="nationalId">رقم الهوية الوطنية</label>
                      <input
                        type="text"
                        id="nationalId"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone">رقم الجوال</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="city">المدينة</label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      >
                        <option value="">اختر المدينة</option>
                        <option value="الرياض">الرياض</option>
                        <option value="جدة">جدة</option>
                        <option value="الدمام">الدمام</option>
                        <option value="مكة">مكة</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="neighborhood">الحي</label>
                      <input
                        type="text"
                        id="neighborhood"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="postalCode">الرمز البريدي</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.saveButton} disabled={saving}>
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </form>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <form onSubmit={(e) => handleSubmit(e, 'security')} className={styles.settingsForm}>
                  <h2 className={styles.sectionTitle}>الأمان وكلمة المرور</h2>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="currentPassword">كلمة المرور الحالية</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        minLength={6}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.saveButton} disabled={saving}>
                    {saving ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
                  </button>
                </form>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className={styles.settingsForm}>
                  <h2 className={styles.sectionTitle}>الإشعارات</h2>
                  
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                      />
                      <span>الإشعارات عبر البريد الإلكتروني</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="contractNotifications"
                        checked={formData.contractNotifications}
                        onChange={handleInputChange}
                      />
                      <span>إشعارات العقود</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="maintenanceNotifications"
                        checked={formData.maintenanceNotifications}
                        onChange={handleInputChange}
                      />
                      <span>إشعارات الصيانة</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="paymentNotifications"
                        checked={formData.paymentNotifications}
                        onChange={handleInputChange}
                      />
                      <span>إشعارات المدفوعات</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="aiNotifications"
                        checked={formData.aiNotifications}
                        onChange={handleInputChange}
                      />
                      <span>إشعارات المساعد الذكي</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
