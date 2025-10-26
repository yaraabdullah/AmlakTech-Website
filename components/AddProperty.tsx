import { useState } from 'react'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import styles from '../styles/AddProperty.module.css'

export default function AddProperty() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    propertyType: 'شقة',
    rooms: '1',
    bathrooms: '1',
    area: '',
    propertySubType: 'استوديو',
    constructionYear: '',
    
    // Step 2: Location
    streetName: '',
    unitNumber: '',
    city: '',
    postalCode: '',
    country: 'المملكة العربية السعودية',
    
    // Step 3: Images and Features
    images: [],
    features: {
      parking: true,
      garden: false,
      balcony: false,
      pool: false,
      elevator: false,
      gym: false,
      security: false,
      wifi: false,
      ac: false,
      jacuzzi: false
    },
    description: '',
    
    // Step 4: Pricing and Availability
    monthlyRent: '',
    insurance: '',
    availableFrom: '',
    minRentalPeriod: 'شهر واحد',
    publicDisplay: false,
    paymentEmail: '',
    supportPhone: '',
    paymentAccount: 'لا يوجد'
  })

  const steps = [
    { number: 1, title: 'تفاصيل العقار', active: currentStep === 1 },
    { number: 2, title: 'الموقع', active: currentStep === 2 },
    { number: 3, title: 'الصور والمميزات', active: currentStep === 3 },
    { number: 4, title: 'التسعير والإتاحة', active: currentStep === 4 }
  ]

  const propertyTypes = [
    { id: 'شقة', title: 'شقة', selected: formData.propertyType === 'شقة' },
    { id: 'منزل', title: 'منزل', selected: formData.propertyType === 'منزل' },
    { id: 'فيلا', title: 'فيلا', selected: formData.propertyType === 'فيلا' },
    { id: 'مكتب', title: 'مكتب', selected: formData.propertyType === 'مكتب' },
    { id: 'متجر', title: 'متجر', selected: formData.propertyType === 'متجر' },
    { id: 'أرض', title: 'أرض', selected: formData.propertyType === 'أرض' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }))
  }

  const handlePropertyTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, propertyType: type }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Property submitted:', formData)
    // Handle form submission here
  }

  return (
    <div className={styles.addPropertyPage}>
      {/* Header */}
      <OwnerNavigation currentPage="add-property" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerRow}>
              {/* Page Title */}
              <div className={styles.pageTitle}>
                <h1>إضافة عقار جديد</h1>
              </div>
              
              {/* AI Assistant Banner */}
              <div className={styles.aiBanner}>
                <p className={styles.aiBannerText}>الذكاء الاصطناعي يساعدك في تحسين إعلان عقارك</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                {steps.map((step, index) => (
                  <div key={step.number} className={`${styles.progressStep} ${step.active ? styles.active : ''}`}>
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
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                {/* Property Type */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>نوع العقار</h2>
                    
                  </div>
                  
                  <div className={styles.propertyTypeGrid}>
                    {propertyTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`${styles.propertyTypeCard} ${type.selected ? styles.selected : ''}`}
                        onClick={() => handlePropertyTypeSelect(type.id)}
                      >
                        <span className={styles.typeTitle}>{type.title}</span>
                        <div className={styles.radioButton}>
                          <input
                            type="radio"
                            name="propertyType"
                            value={type.id}
                            checked={type.selected}
                            onChange={() => handlePropertyTypeSelect(type.id)}
                            className={styles.radioInput}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>تفاصيل إضافية</h2>
                  </div>
                  
                  <div className={styles.detailsGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>عدد الغرف</label>
                      <select
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                      >
                        <option value="استوديو">استوديو</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>عدد الحمامات</label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>المساحة (متر مربع)</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder=""
                        className={styles.fieldInput}
                      />
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>سنة البناء</label>
                      <input
                        type="text"
                        name="constructionYear"
                        value={formData.constructionYear}
                        onChange={handleInputChange}
                        placeholder=""
                        className={styles.fieldInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>موقع العقار</h2>
                  </div>
                  
                  <div className={styles.locationContent}>
                    {/* Map Placeholder */}
                    <div className={styles.mapContainer}>
                      <div className={styles.mapPlaceholder}>
                        <div className={styles.mapIcon}>🗺️</div>
                        <p className={styles.mapText}>انقر على الخريطة لتحديد موقع العقار بدقة</p>
                      </div>
                    </div>
                    
                    {/* Address Fields */}
                    <div className={styles.addressFields}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>اسم الشارع ورقم المبنى</label>
                        <input
                          type="text"
                          name="streetName"
                          value={formData.streetName}
                          onChange={handleInputChange}
                          placeholder="مثال: شارع الملك فهد، رقم 123"
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>رقم الوحدة الإدارية</label>
                        <input
                          type="text"
                          name="unitNumber"
                          value={formData.unitNumber}
                          onChange={handleInputChange}
                          placeholder="مثال: 101"
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>المدينة</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="مثال: الرياض"
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الرمز البريدي</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="مثال: 12345"
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الدولة</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        >
                          <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                          <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                          <option value="الكويت">الكويت</option>
                          <option value="قطر">قطر</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Images and Features */}
            {currentStep === 3 && (
              <div className={styles.stepContent}>
                {/* Images Section */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>📷</span>
                    <h2 className={styles.sectionTitle}>الصور والمميزات</h2>
                  </div>
                  
                  <div className={styles.imagesSection}>
                    <div className={styles.uploadArea}>
                      <div className={styles.uploadIcon}>☁️</div>
                      <p className={styles.uploadText}>اسحب الصور هنا أو انقر لرفعها</p>
                      <p className={styles.uploadHint}>
                        يمكنك تحميل حتى 20 صورة كحد أقصى. يفضل صور عالية الجودة
                      </p>
                      <button type="button" className={styles.addImagesBtn}>
                        <span className={styles.addIcon}>+</span>
                        أضف الصور
                      </button>
                    </div>
                    
                    <div className={styles.aiBanner}>
                      <p>صور عالية الجودة تزيد من معدل الحجز بنسبة 40%</p>
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>المميزات والمرافق</h2>
                  </div>
                  
                  <div className={styles.featuresGrid}>
                    {Object.entries(formData.features).map(([feature, checked]) => (
                      <label key={feature} className={styles.featureItem}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleFeatureChange(feature)}
                          className={styles.featureCheckbox}
                        />
                        <span className={styles.featureIcon}></span>
                        <span className={styles.featureText}>
                          {feature === 'parking' ? 'موقف سيارات' :
                           feature === 'garden' ? 'حديقة' :
                           feature === 'balcony' ? 'شرفة' :
                           feature === 'pool' ? 'مسبح' :
                           feature === 'elevator' ? 'مصعد' :
                           feature === 'gym' ? 'صالة رياضية' :
                           feature === 'security' ? '24 ساعة أمن' :
                           feature === 'wifi' ? 'واي فاي' :
                           feature === 'ac' ? 'تكييف' :
                           feature === 'jacuzzi' ? 'جاكوزي' : feature}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description Section */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>📝</span>
                    <h2 className={styles.sectionTitle}>وصف العقار</h2>
                  </div>
                  
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اكتب وصفاً مفصلاً للعقار..."
                    className={styles.descriptionTextarea}
                    rows={6}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Pricing and Availability */}
            {currentStep === 4 && (
              <div className={styles.stepContent}>
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>التسعير والإتاحة</h2>
                  </div>
                  
                  <div className={styles.pricingGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>الإيجار الشهري</label>
                      <div className={styles.currencyInput}>
                        <input
                          type="text"
                          name="monthlyRent"
                          value={formData.monthlyRent}
                          onChange={handleInputChange}
                          placeholder="0"
                          className={styles.fieldInput}
                        />
                        <span className={styles.currency}>ريال</span>
                      </div>
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>التأمين</label>
                      <div className={styles.currencyInput}>
                        <input
                          type="text"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleInputChange}
                          placeholder="0"
                          className={styles.fieldInput}
                        />
                        <span className={styles.currency}>ريال</span>
                      </div>
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>متاح من تاريخ</label>
                      <div className={styles.dateInput}>
                        <input
                          type="date"
                          name="availableFrom"
                          value={formData.availableFrom}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        />
                        <span className={styles.calendarIcon}>📅</span>
                      </div>
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>الحد الأدنى لمدة الإيجار</label>
                      <select
                        name="minRentalPeriod"
                        value={formData.minRentalPeriod}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                      >
                        <option value="شهر واحد">شهر واحد</option>
                        <option value="3 أشهر">3 أشهر</option>
                        <option value="6 أشهر">6 أشهر</option>
                        <option value="سنة واحدة">سنة واحدة</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.publicDisplaySection}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="publicDisplay"
                        checked={formData.publicDisplay}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>عرض العقار على العامة</span>
                    </label>
                    <p className={styles.checkboxHint}>
                      تفعيل هذه الخيار يساعد في التسويق الفعال للعقار
                    </p>
                  </div>
                  
                  <div className={styles.aiBanner}>
                    <p>إضافة المزيد من التفاصيل تزيد من معدل الحجز بنسبة 25%</p>
                  </div>
                </div>

                {/* Payment System Section */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>💳</span>
                    <h2 className={styles.sectionTitle}>زودنا بنظام دفعك الخاص</h2>
                  </div>
                  
                  <div className={styles.paymentFields}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>يرجى إدخال بريدك الإلكتروني</label>
                      <input
                        type="email"
                        name="paymentEmail"
                        value={formData.paymentEmail}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className={styles.fieldInput}
                      />
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>رقم هاتف الدعم الفني</label>
                      <input
                        type="tel"
                        name="supportPhone"
                        value={formData.supportPhone}
                        onChange={handleInputChange}
                        placeholder="966XXXXXXXX"
                        className={styles.fieldInput}
                      />
                    </div>
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>هل لديك حساب دفع إلكتروني؟</label>
                      <select
                        name="paymentAccount"
                        value={formData.paymentAccount}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                      >
                        <option value="لا يوجد">لا يوجد</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Stripe">Stripe</option>
                        <option value="محلي">محلي</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.formNavigation}>
              <div className={styles.navButtons}>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className={styles.prevBtn}>
                    السابق
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>
                    التالي
                  </button>
                ) : (
                  <button type="submit" className={styles.submitBtn}>
                    <span className={styles.submitIcon}>←</span>
                    إضافة العقار
                  </button>
                )}
              </div>
              
              <div className={styles.additionalActions}>
                <button type="button" className={styles.previewBtn}>
                  معاينة
                </button>
                <button type="button" className={styles.draftBtn}>
                  حفظ كمسودة
                </button>
              </div>
            </div>
          </form>
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
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>المنتجات</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">إدارة العقارات</a></li>
                <li><a href="#">إدارة الإيجارات</a></li>
                <li><a href="#">إدارة الصيانة</a></li>
                <li><a href="#">التحليلات والتقارير</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الحلول</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">لملاك العقارات</a></li>
                <li><a href="#">للمستأجرين</a></li>
                <li><a href="#">لمزودي الخدمات</a></li>
                <li><a href="#">لمديري العقارات</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الموارد</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">مركز المساعدة</a></li>
                <li><a href="#">المدونة</a></li>
                <li><a href="#">دليل المستخدم</a></li>
                <li><a href="#">الندوات الإلكترونية</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الشركة</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">عن الشركة</a></li>
                <li><a href="#">فريق العمل</a></li>
                <li><a href="#">الوظائف</a></li>
                <li><a href="#">اتصل بنا</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
