import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/SignUpForm.module.css'

export default function SignUpForm() {
  const [selectedUserType, setSelectedUserType] = useState('مالك عقار')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nationalId: '',
    mobile: '',
    city: '',
    neighborhood: '',
    postalCode: '',
    propertiesCount: '1',
    propertyType: '',
    password: '',
    confirmPassword: '',
    aiAssistant: true,
    termsAccepted: false
  })

  const userTypes = [
    {
      id: 'مالك عقار',
      title: 'مالك عقار',
      description: 'إدارة عقاراتك وعرضها للإيجار أو البيع',
      icon: '/icons/مالك عقار.svg'
    },
    {
      id: 'مستأجر',
      title: 'مستأجر',
      description: 'البحث عن عقارات للإيجار وإدارة عقودك',
      icon: '/icons/مستأجر.svg'
    },
    {
      id: 'مزود خدمة',
      title: 'مزود خدمة',
      description: 'تقديم خدمات الصيانة والإصلاح للعقارات',
      icon: '/icons/مزود خدمه.svg'
    },
    {
      id: 'مدير عقارات',
      title: 'مدير عقارات',
      description: 'إدارة عقارات متعددة وتنظيم العمليات العقارية',
      icon: '/icons/مدير عقارات.svg'
    }
  ]

  const steps = [
    { number: 1, title: 'اختيار الحساب', active: currentStep === 1 },
    { number: 2, title: 'المعلومات الشخصية', active: currentStep === 2 },
    { number: 3, title: 'التحقق', active: currentStep === 3 },
    { number: 4, title: 'الانتهاء', active: currentStep === 4 }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType)
    setCurrentStep(2)
  }

  const handleChangeUserType = () => {
    setCurrentStep(1)
  }

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    // Validate required fields
    if (!formData.nationalId) {
      setError('رقم الهوية الوطنية مطلوب')
      return
    }

    if (!formData.mobile) {
      setError('رقم الجوال مطلوب')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    // Check terms accepted
    if (!formData.termsAccepted) {
      setError('يجب الموافقة على الشروط والأحكام')
      return
    }

    setIsSubmitting(true)

    try {
      // Build phone with country code (remove leading 0 if exists)
      const phone = formData.mobile ? `966${formData.mobile.replace(/^0+/, '')}` : null

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationalId: formData.nationalId,
          phone: phone,
          password: formData.password,
          userType: selectedUserType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء إنشاء الحساب')
      }

      // Success - redirect based on user type
      const userTypeMap: { [key: string]: string } = {
        'مالك عقار': '/owner/dashboard',
        'مستأجر': '/', // TODO: Add tenant dashboard
        'مزود خدمة': '/', // TODO: Add service provider dashboard
        'مدير عقارات': '/', // TODO: Add property manager dashboard
      }

      const redirectPath = userTypeMap[selectedUserType] || '/'
      router.push(redirectPath)
    } catch (error: any) {
      console.error('Error creating account:', error)
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.formWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>إنشاء حساب جديد</h1>
          <p className={styles.subtitle}>
            اختر نوع الحساب المناسب لك لتوفر لك تجربة مخصصة
          </p>
        </div>

        {/* Progress Indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.progressLine}>
            {steps.map((step, index) => (
              <div key={step.number} className={styles.stepContainer}>
                <div className={`${styles.stepCircle} ${step.active ? styles.active : ''}`}>
                  {step.number}
                </div>
                <span className={`${styles.stepTitle} ${step.active ? styles.active : ''}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Type Selection */}
        {currentStep === 1 && (
          <div className={styles.userTypeSection}>
            <div className={styles.userTypeGrid}>
              {userTypes.map((userType) => (
                <div
                  key={userType.id}
                  className={`${styles.userTypeCard} ${selectedUserType === userType.id ? styles.selected : ''}`}
                  onClick={() => handleUserTypeSelect(userType.id)}
                >
                  <div className={styles.userTypeIcon}>
                    <img 
                      src={userType.icon} 
                      alt={userType.title}
                      className={styles.iconImage}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'block';
                        }
                      }}
                    />
                    <div className={styles.iconPlaceholder}>
                      {userType.id === 'مالك عقار' ? '🏠' : 
                       userType.id === 'مستأجر' ? '🔑' :
                       userType.id === 'مزود خدمة' ? '🔧' : '🏢'}
                    </div>
                  </div>
                  <h3 className={styles.userTypeTitle}>{userType.title}</h3>
                  <p className={styles.userTypeDescription}>{userType.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Information Form */}
        {currentStep >= 2 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Form Header */}
            <div className={styles.formHeader}>
              <div className={styles.formTitleSection}>
                <div className={styles.formTitleIcon}></div>
                <div>
                  <h2 className={styles.formTitle}>{selectedUserType}</h2>
                  <p className={styles.formSubtitle}>ادخل معلوماتك الشخصية لإكمال التسجيل</p>
                </div>
              </div>
              <button type="button" className={styles.changeButton} onClick={handleChangeUserType}>
                تغيير
              </button>
            </div>

            {/* Personal Information Fields */}
            <div className={styles.formFields}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>الاسم الأول</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="ادخل الاسم الأول"
                    className={styles.fieldInput}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>الاسم الأخير</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="ادخل الاسم الأخير"
                    className={styles.fieldInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className={styles.fieldInput}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>رقم الهوية الوطنية</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className={styles.fieldInput}
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>رقم الجوال</label>
                  <div className={styles.mobileInput}>
                    <select className={styles.countryCode}>
                      <option value="+966">+966</option>
                      <option value="+971">+971</option>
                      <option value="+965">+965</option>
                    </select>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="5XXXXXXXXXX"
                      className={styles.fieldInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>المدينة</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={styles.fieldInput}
                    required
                  >
                    <option value="">اختر المدينة</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>الحي</label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="ادخل اسم الحي"
                    className={styles.fieldInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>الرمز البريدي</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="ادخل الرمز البريدي"
                    className={styles.fieldInput}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information for Property Owner */}
            {selectedUserType === 'مالك عقار' && (
              <div className={styles.additionalInfo}>
                <div className={styles.additionalInfoHeader}>
                  <span className={styles.additionalInfoIcon}>👤</span>
                  <h3 className={styles.additionalInfoTitle}>معلومات إضافية للمالك</h3>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>عدد العقارات المملوكة</label>
                    <select
                      name="propertiesCount"
                      value={formData.propertiesCount}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                    >
                      <option value="1">1</option>
                      <option value="2-5">2-5</option>
                      <option value="6-10">6-10</option>
                      <option value="10+">10+</option>
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>نوع العقارات المملوكة</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                    >
                      <option value="">اختر نوع العقار</option>
                      <option value="شقة">شقة</option>
                      <option value="فيلا">فيلا</option>
                      <option value="منزل">منزل</option>
                      <option value="مكتب">مكتب</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className={styles.passwordSection}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>كلمة المرور</label>
                  <div className={styles.passwordInput}>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                      required
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>تأكيد كلمة المرور</label>
                  <div className={styles.passwordInput}>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                      required
                    />
                  </div>
                </div>
              </div>
              <p className={styles.passwordHint}>
                يجب أن تحتوي على 8 أحرف على الأقل مع حرف كبير ورقم
              </p>
            </div>

            {/* AI Assistant Section */}
            <div className={styles.aiAssistantSection}>
              <div className={styles.aiAssistantHeader}>
                <span className={styles.aiIcon}>🤖</span>
                <div>
                  <h3 className={styles.aiTitle}>المساعد الذكي للعقارات</h3>
                  <p className={styles.aiDescription}>
                    اشترك في المساعد الذكي لتحصل على توصيات مخصصة واستشارات عقارية باستخدام الذكاء الاصطناعي
                  </p>
                </div>
              </div>
              <label className={styles.aiCheckbox}>
                <input
                  type="checkbox"
                  name="aiAssistant"
                  checked={formData.aiAssistant}
                  onChange={handleInputChange}
                />
                <span className={styles.checkboxText}>تفعيل المساعد الذكي للعقارات</span>
              </label>
            </div>

            {/* Terms and Conditions */}
            <div className={styles.termsSection}>
              <label className={styles.termsCheckbox}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                />
                <span className={styles.termsText}>
                  أوافق على{' '}
                  <a href="#" className={styles.termsLink}>
                    الشروط والأحكام و سياسة الخصوصية
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'جاري الإنشاء...'
              ) : (
                <>
                  <span className={styles.submitIcon}>←</span>
                  انشاء
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
