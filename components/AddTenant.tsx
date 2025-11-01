import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/AddTenant.module.css'

export default function AddTenant() {
  const router = useRouter()
  const { propertyId } = router.query
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [propertyData, setPropertyData] = useState<any>(null)
  const [loadingProperty, setLoadingProperty] = useState(false)
  
  const [formData, setFormData] = useState({
    propertyId: propertyId as string || '',
    // Tenant information
    tenantFirstName: '',
    tenantLastName: '',
    tenantEmail: '',
    tenantPhone: '',
    tenantNationalId: '',
    tenantCity: '',
    tenantNeighborhood: '',
    tenantPostalCode: '',
    // Contract information
    contractType: 'إيجار سكني',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    notes: '',
    // Optional fields
    emergencyContact: '',
    emergencyPhone: ''
  })

  const contractTypes = [
    { id: 'إيجار سكني', title: 'إيجار سكني' },
    { id: 'إيجار تجاري', title: 'إيجار تجاري' },
    { id: 'بيع', title: 'بيع' }
  ]

  // Fetch owner ID
  useEffect(() => {
    const fetchOwnerId = async () => {
      try {
        const response = await fetch('/api/user/get-owner-id')
        if (response.ok) {
          const data = await response.json()
          setOwnerId(data.id) // API returns 'id' not 'ownerId'
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

  // Set property ID from query parameter and fetch property data
  useEffect(() => {
    if (propertyId && typeof propertyId === 'string') {
      setFormData(prev => ({ ...prev, propertyId: propertyId as string }))
      fetchPropertyData(propertyId as string)
    }
  }, [propertyId])

  // Fetch property data from database
  const fetchPropertyData = async (propId: string) => {
    if (!propId) return
    
    try {
      setLoadingProperty(true)
      const response = await fetch(`/api/properties/${propId}`)
      
      if (response.ok) {
        const property = await response.json()
        setPropertyData(property)
        
        // Auto-fill form fields with property data
        setFormData(prev => ({
          ...prev,
          // Auto-fill monthly rent if available
          monthlyRent: property.monthlyRent ? property.monthlyRent.toString() : prev.monthlyRent,
          // Set contract type based on property type
          contractType: property.type === 'متجر' || property.type === 'مكتب' ? 'إيجار تجاري' : 'إيجار سكني',
          // Set start date to availableFrom if available
          startDate: property.availableFrom ? property.availableFrom.split('T')[0] : prev.startDate,
        }))
      } else {
        console.error('Failed to fetch property data')
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
    } finally {
      setLoadingProperty(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.propertyId || !formData.tenantFirstName || !formData.tenantLastName || !formData.tenantPhone || !formData.tenantEmail || !formData.tenantNationalId || !formData.tenantCity || !formData.tenantNeighborhood || !formData.tenantPostalCode || !formData.startDate || !formData.endDate || !formData.monthlyRent) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (!ownerId) {
      alert('يجب تسجيل الدخول أولاً')
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      
      // First, create or find tenant
      let tenantId: string | null = null
      
      // Check if tenant exists by phone
      if (formData.tenantPhone) {
        const tenantCheckResponse = await fetch(`/api/tenants?phoneNumber=${encodeURIComponent(formData.tenantPhone)}`)
        if (tenantCheckResponse.ok) {
          const existingTenant = await tenantCheckResponse.json()
          if (existingTenant) {
            tenantId = existingTenant.id
          }
        }
      }
      
      // Create tenant if doesn't exist
      if (!tenantId) {
        const tenantData = {
          firstName: formData.tenantFirstName,
          lastName: formData.tenantLastName,
          email: formData.tenantEmail,
          phoneNumber: formData.tenantPhone,
          nationalId: formData.tenantNationalId,
          city: formData.tenantCity,
          address: formData.tenantNeighborhood ? `${formData.tenantNeighborhood}، الرمز البريدي: ${formData.tenantPostalCode}` : null,
          emergencyContact: formData.emergencyContact || null,
          emergencyPhone: formData.emergencyPhone || null,
          userId: null // No user account by default
        }

        const tenantResponse = await fetch('/api/tenants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tenantData),
        })

        if (tenantResponse.ok) {
          const newTenant = await tenantResponse.json()
          tenantId = newTenant.id
        } else {
          const errorData = await tenantResponse.json()
          throw new Error(errorData.error || 'فشل في إنشاء المستأجر')
        }
      }
      
      // Create contract
      const contractData = {
        propertyId: formData.propertyId,
        ownerId: ownerId,
        tenantId: tenantId,
        type: formData.contractType,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        monthlyRent: parseFloat(formData.monthlyRent),
        deposit: null, // Deposit removed as per requirements
        notes: formData.notes || null,
        status: 'نشط'
      }

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إضافة العقد')
      }

      alert('تم إضافة المستأجر والعقد بنجاح!')
      router.push('/owner/contract-management')
    } catch (error: any) {
      console.error('Error adding tenant:', error)
      alert(`حدث خطأ: ${error.message || 'فشل في إضافة المستأجر'}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !ownerId) {
    return (
      <div className={styles.addTenantPage}>
        <OwnerNavigation currentPage="contract-management" />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>جاري التحميل...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.addTenantPage}>
      <OwnerNavigation currentPage="contract-management" />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>إضافة مستأجر جديد</h1>
            <p className={styles.pageDescription}>
              {propertyData 
                ? `إضافة مستأجر لعقار: ${propertyData.name || propertyData.address || 'العقار المحدد'}`
                : 'أضف مستأجراً جديداً وأنشئ عقد إيجار له'}
            </p>
          </div>

          {loadingProperty && (
            <div className={styles.loadingMessage}>جاري تحميل بيانات العقار...</div>
          )}

          <form onSubmit={handleSubmit} className={styles.tenantForm}>
            {/* Tenant Information */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>معلومات المستأجر</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantFirstName" className={styles.label}>
                    الاسم الأول <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="tenantFirstName"
                    name="tenantFirstName"
                    value={formData.tenantFirstName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="الاسم الأول"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantLastName" className={styles.label}>
                    الاسم الأخير <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="tenantLastName"
                    name="tenantLastName"
                    value={formData.tenantLastName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="الاسم الأخير"
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantPhone" className={styles.label}>
                    رقم الجوال <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="tenantPhone"
                    name="tenantPhone"
                    value={formData.tenantPhone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="05xxxxxxxx"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantEmail" className={styles.label}>
                    البريد الإلكتروني <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="tenantEmail"
                    name="tenantEmail"
                    value={formData.tenantEmail}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantNationalId" className={styles.label}>
                    رقم الهوية الوطنية <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="tenantNationalId"
                    name="tenantNationalId"
                    value={formData.tenantNationalId}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="10 أرقام"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantCity" className={styles.label}>
                    المدينة <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="tenantCity"
                    name="tenantCity"
                    value={formData.tenantCity}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="المدينة"
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantNeighborhood" className={styles.label}>
                    الحي <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="tenantNeighborhood"
                    name="tenantNeighborhood"
                    value={formData.tenantNeighborhood}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="الحي"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tenantPostalCode" className={styles.label}>
                    الرمز البريدي <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="tenantPostalCode"
                    name="tenantPostalCode"
                    value={formData.tenantPostalCode}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="الرمز البريدي"
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="emergencyContact" className={styles.label}>
                    جهة الاتصال في حالات الطوارئ
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="الاسم"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="emergencyPhone" className={styles.label}>
                    رقم هاتف الطوارئ
                  </label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>تفاصيل العقد</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contractType" className={styles.label}>
                    نوع العقد <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="contractType"
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    {contractTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="monthlyRent" className={styles.label}>
                    الإيجار الشهري (ريال) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="monthlyRent"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder={propertyData?.monthlyRent ? propertyData.monthlyRent.toString() : "0"}
                    min="0"
                    step="0.01"
                    required
                  />
                  {propertyData?.monthlyRent && (
                    <small className={styles.hint}>
                      (من بيانات العقار: {propertyData.monthlyRent} ريال)
                    </small>
                  )}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate" className={styles.label}>
                    تاريخ البداية <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endDate" className={styles.label}>
                    تاريخ الانتهاء <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label htmlFor="notes" className={styles.label}>
                  معلومات إضافية
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="أي ملاحظات أو شروط إضافية..."
                  rows={4}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelBtn}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'جاري الحفظ...' : 'إضافة المستأجر'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
