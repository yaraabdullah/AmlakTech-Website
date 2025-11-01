import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/AccountSettings.module.css'

export default function AccountSettings() {
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
    blogNotifications: true,
    realEstateNotifications: true,
    userNotifications: false,
    aiNotifications: true,
    
    // Payment Methods
    paymentMethods: [
      {
        id: 1,
        type: 'visa',
        lastFour: '4567',
        expiry: '10/2025',
        isDefault: true
      }
    ],
    
    // AI Analytics
    aiAnalytics: false
  })

  const settingsSections = [
    { id: 'personal', title: 'المعلومات الشخصية', icon: '/icons/Personal info.svg', active: activeSection === 'personal' },
    { id: 'security', title: 'الأمان وكلمة المرور', icon: '/icons/Passowrd.svg', active: activeSection === 'security' },
    { id: 'notifications', title: 'الإشعارات', icon: '/icons/Notifications.svg', active: activeSection === 'notifications' },
    { id: 'payment', title: 'طرق الدفع', icon: '/icons/payment-management.svg', active: activeSection === 'payment' },
    { id: 'favorites', title: 'الاشتراك', icon: '/icons/Subscription.svg', active: activeSection === 'favorites' },
    { id: 'privacy', title: 'الخصوصية', icon: '/icons/Privacy.svg', active: activeSection === 'privacy' },
    { id: 'logout', title: 'تسجيل الخروج', active: activeSection === 'logout' }
  ]

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get user ID from localStorage (from login) or fallback to API
      let userId: string | null = null
      
      if (typeof window !== 'undefined') {
        userId = localStorage.getItem('userId')
      }

      // Fallback: Get from API if not in localStorage
      if (!userId) {
        const ownerResponse = await fetch('/api/user/get-owner-id')
        if (ownerResponse.ok) {
          const owner = await ownerResponse.json()
          userId = owner.id
        } else {
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

  const handleLogout = () => {
    // Clear localStorage (login session)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('userId')
      localStorage.removeItem('userType')
    }
    // Redirect to homepage
    router.push('/')
  }

  const removePaymentMethod = (id: number) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(method => method.id !== id)
    }))
  }

  return (
    <div className={styles.accountSettingsPage}>
      {/* Header */}
      <OwnerNavigation currentPage="account-settings" />

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
                    className={`${styles.navItem} ${section.active ? styles.active : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon && (
                      <span className={styles.navIcon}>
                        <Image 
                          src={section.icon}
                          alt={section.title}
                          width={24}
                          height={24}
                        />
                      </span>
                    )}
                    <span className={styles.navTitle}>{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* AI Analytics Section */}
              <div className={styles.aiSection}>
                <div className={styles.aiIcon}>🤖</div>
                <h3 className={styles.aiTitle}>تحليلات الذكاء الاصطناعي</h3>
                <button className={styles.aiButton}>
                  تفعيل تحليلات الذكاء الاصطناعي
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className={styles.contentArea}>
              {loading ? (
                <div className={styles.loadingMessage}>جاري التحميل...</div>
              ) : (
                <>
              {/* Personal Information Section */}
              {activeSection === 'personal' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>المعلومات الشخصية</h2>
                  
                  <form onSubmit={(e) => handleSubmit(e, 'personal')} className={styles.form}>
                    {/* Profile Picture */}
                    <div className={styles.profilePictureSection}>
                      <div className={styles.profilePicture}>
                        <img src="/icons/profile-placeholder.svg" alt="Profile" className={styles.profileImage} />
                      </div>
                      <button type="button" className={styles.changePictureBtn}>
                        تغيير الصورة الشخصية
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className={styles.formGrid}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الاسم الأول</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>اسم العائلة</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>البريد الإلكتروني</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>رقم الهوية الوطنية</label>
                        <input
                          type="text"
                          name="nationalId"
                          value={formData.nationalId}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                          placeholder="1234567890"
                          maxLength={10}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>رقم الهاتف</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>المدينة</label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        >
                          <option value="">اختر المدينة</option>
                          <option value="الرياض">الرياض</option>
                          <option value="جدة">جدة</option>
                          <option value="الدمام">الدمام</option>
                          <option value="مكة">مكة</option>
                          <option value="المدينة المنورة">المدينة المنورة</option>
                          <option value="الطائف">الطائف</option>
                          <option value="بريدة">بريدة</option>
                          <option value="خميس مشيط">خميس مشيط</option>
                          <option value="حفر الباطن">حفر الباطن</option>
                          <option value="الجبيل">الجبيل</option>
                        </select>
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الحي</label>
                        <input
                          type="text"
                          name="neighborhood"
                          value={formData.neighborhood}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                          placeholder="ادخل اسم الحي"
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الرمز البريدي</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                          placeholder="ادخل الرمز البريدي"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* Messages */}
                    {successMessage && activeSection === 'personal' && (
                      <div className={styles.successMessage}>{successMessage}</div>
                    )}
                    {errorMessage && activeSection === 'personal' && (
                      <div className={styles.errorMessage}>{errorMessage}</div>
                    )}

                    <button 
                      type="submit" 
                      className={styles.saveBtn}
                      disabled={saving || loading}
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>الأمان وكلمة المرور</h2>
                  
                  <form onSubmit={(e) => handleSubmit(e, 'security')} className={styles.form}>
                    <div className={styles.formGrid}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>كلمة المرور الحالية</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGrid}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>تأكيد كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className={styles.forgotPassword}>
                      <a href="#" className={styles.forgotLink}>نسيت كلمة المرور؟</a>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className={styles.twoFactorSection}>
                      <div className={styles.toggleSection}>
                        <div className={styles.toggleInfo}>
                          <h3 className={styles.toggleTitle}>التحقق بخطوتين</h3>
                          <p className={styles.toggleDescription}>
                            أضف طبقة أمان إضافية لحسابك
                          </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            name="twoFactorAuth"
                            checked={formData.twoFactorAuth}
                            onChange={handleInputChange}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    </div>

                    {/* Messages */}
                    {successMessage && activeSection === 'security' && (
                      <div className={styles.successMessage}>{successMessage}</div>
                    )}
                    {errorMessage && activeSection === 'security' && (
                      <div className={styles.errorMessage}>{errorMessage}</div>
                    )}

                    <button 
                      type="submit" 
                      className={styles.saveBtn}
                      disabled={saving || loading}
                    >
                      {saving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                    </button>
                  </form>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>إعدادات الإشعارات</h2>
                  
                  <form onSubmit={(e) => handleSubmit(e, 'notifications')} className={styles.form}>
                    <div className={styles.notificationsList}>
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationInfo}>
                          <h3 className={styles.notificationTitle}>إشعارات البريد الإلكتروني</h3>
                          <p className={styles.notificationDescription}>
                            استقبل إشعارات عبر البريد الإلكتروني
                          </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={formData.emailNotifications}
                            onChange={handleInputChange}
                          />
                          <span className={`${styles.slider} ${formData.emailNotifications ? styles.active : ''}`}></span>
                        </label>
                      </div>

                      <div className={styles.notificationItem}>
                        <div className={styles.notificationInfo}>
                          <h3 className={styles.notificationTitle}>إشعارات المدونات</h3>
                          <p className={styles.notificationDescription}>
                            إشعارات حول المدونات والمقالات
                          </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            name="blogNotifications"
                            checked={formData.blogNotifications}
                            onChange={handleInputChange}
                          />
                          <span className={`${styles.slider} ${formData.blogNotifications ? styles.active : ''}`}></span>
                        </label>
                      </div>

                      <div className={styles.notificationItem}>
                        <div className={styles.notificationInfo}>
                          <h3 className={styles.notificationTitle}>إشعارات العقارات</h3>
                          <p className={styles.notificationDescription}>
                            إشعارات حول العقارات والعملاء
                          </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            name="realEstateNotifications"
                            checked={formData.realEstateNotifications}
                            onChange={handleInputChange}
                          />
                          <span className={`${styles.slider} ${formData.realEstateNotifications ? styles.active : ''}`}></span>
                        </label>
                      </div>

                      <div className={styles.notificationItem}>
                        <div className={styles.notificationInfo}>
                          <h3 className={styles.notificationTitle}>إشعارات المستخدمين</h3>
                          <p className={styles.notificationDescription}>
                            إشعارات حول المستخدمين والمتابعين
                          </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            name="userNotifications"
                            checked={formData.userNotifications}
                            onChange={handleInputChange}
                          />
                          <span className={`${styles.slider} ${formData.userNotifications ? styles.active : ''}`}></span>
                        </label>
                      </div>

                      <div className={styles.notificationItem}>
                        <div className={styles.notificationInfo}>
                          <h3 className={styles.notificationTitle}>إشعارات الذكاء الاصطناعي</h3>
                          <p className={styles.notificationDescription}>
                            تنبيهات وتحديثات ذات صلة بتحليلات الذكاء الاصطناعي
                          </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            name="aiNotifications"
                            checked={formData.aiNotifications}
                            onChange={handleInputChange}
                          />
                          <span className={`${styles.slider} ${formData.aiNotifications ? styles.active : ''}`}></span>
                        </label>
                      </div>
                    </div>

                    <button type="submit" className={styles.saveBtn}>
                      حفظ الإعدادات
                    </button>
                  </form>
                </div>
              )}

              {/* Payment Methods Section */}
              {activeSection === 'payment' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>طرق الدفع</h2>
                  
                  <div className={styles.paymentMethods}>
                    {formData.paymentMethods.map((method) => (
                      <div key={method.id} className={styles.paymentMethod}>
                        <div className={styles.paymentInfo}>
                          <div className={styles.cardIcon}>💳</div>
                          <div className={styles.cardDetails}>
                            <div className={styles.cardType}>بطاقة تنتهي بـ **** {method.lastFour}</div>
                            <div className={styles.cardExpiry}>تنتهي في {method.expiry}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePaymentMethod(method.id)}
                          className={styles.removeBtn}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <button type="button" className={styles.addPaymentBtn}>
                    + إضافة طريقة دفع جديدة
                  </button>
                </div>
              )}

              {/* AI Analytics Section */}
              {activeSection === 'ai' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>تحليلات الذكاء الاصطناعي</h2>
                  
                  <div className={styles.aiAnalyticsSection}>
                    <div className={styles.aiDescription}>
                      <p>
                        استفد من قوة الذكاء الاصطناعي في تحسين إدارة عملياتك واتخاذ القرارات بناءً على البيانات والتحليلات المتقدمة
                      </p>
                    </div>

                    <div className={styles.aiFeatures}>
                      <div className={styles.aiFeature}>
                        <div className={styles.featureIcon}>🤖</div>
                        <div className={styles.featureContent}>
                          <h3 className={styles.featureTitle}>تحليل الأسعار</h3>
                          <p className={styles.featureDescription}>
                            تحليل مالي للأسعار والتغيرات في السوق
                          </p>
                        </div>
                      </div>

                      <div className={styles.aiFeature}>
                        <div className={styles.featureIcon}>🤖</div>
                        <div className={styles.featureContent}>
                          <h3 className={styles.featureTitle}>توقع العوائد</h3>
                          <p className={styles.featureDescription}>
                            توقع اعتبارات الدخل المحتملة
                          </p>
                        </div>
                      </div>

                      <div className={styles.aiFeature}>
                        <div className={styles.featureIcon}>🤖</div>
                        <div className={styles.featureContent}>
                          <h3 className={styles.featureTitle}>فهم المستخدمين</h3>
                          <p className={styles.featureDescription}>
                            تحليل سلوك المستخدمين واهتماماتهم
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className={styles.activateAiBtn}>
                      تفعيل تحليلات الذكاء الاصطناعي
                    </button>
                  </div>
                </div>
              )}

              {/* Logout Section */}
              {activeSection === 'logout' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>تسجيل الخروج</h2>
                  
                  <div className={styles.logoutSection}>
                    <div className={styles.logoutWarning}>
                      <div className={styles.warningIcon}>⚠️</div>
                      <div className={styles.warningContent}>
                        <h3 className={styles.warningTitle}>هل أنت متأكد من تسجيل الخروج؟</h3>
                        <p className={styles.warningDescription}>
                          سيتم تسجيل خروجك من حسابك وسيتم إعادة توجيهك إلى الصفحة الرئيسية.
                        </p>
                      </div>
                    </div>
                    
                    <div className={styles.logoutActions}>
                      <button 
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                      >
                        تسجيل الخروج
                      </button>
                      <button 
                        className={styles.cancelBtn}
                        onClick={() => setActiveSection('personal')}
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </>
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
