import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import Footer from './Footer'
import styles from '../styles/AddProperty.module.css'

export default function AddProperty() {
  const router = useRouter()
  const { id } = router.query
  const isEditMode = !!id
  
  // Get property ID from query
  const getPropertyIdFromQuery = () => {
    if (!id) return null
    return Array.isArray(id) ? id[0] : id
  }
  
  const [loading, setLoading] = useState(isEditMode)
  const [currentStep, setCurrentStep] = useState(1)
  const [propertyId, setPropertyId] = useState<string | null>(getPropertyIdFromQuery() as string | null)
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    propertyType: 'شقة',
    listingType: 'للإيجار', // للبيع أو للإيجار
    furnishedStatus: '', // مفروشة أو غير مفروشة (only for منزل، فيلا، شقة)
    rooms: '1',
    bathrooms: '1',
    area: '',
    constructionYear: '',
    
    // Step 2: Location
    streetName: '',
    neighborhood: '',
    city: '',
    postalCode: '',
    country: 'المملكة العربية السعودية',
    
    // Step 3: Images and Features
    images: [] as string[],
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
    monthlyRent: '', // For rent (للإيجار)
    price: '', // For sale (للبيع)
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

  // Fetch property data if in edit mode
  useEffect(() => {
    if (isEditMode && router.isReady && id) {
      const propId = Array.isArray(id) ? id[0] : id
      if (propId && typeof propId === 'string') {
        setPropertyId(propId)
        fetchPropertyData(propId)
      }
    }
  }, [isEditMode, router.isReady, id])

  const fetchPropertyData = async (propertyId: string) => {
    try {
      setLoading(true)
      console.log('Fetching property data for ID:', propertyId)
      const response = await fetch(`/api/properties/${propertyId}`)
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}: Failed to fetch property` }
        }
        console.error('Failed to fetch property:', response.status, errorData)
        alert(`فشل في جلب بيانات العقار: ${errorData.error || 'خطأ غير معروف'}`)
        setLoading(false)
        router.push('/owner/property-details')
        return
      }
      
      let property
      try {
        property = await response.json()
      } catch (error) {
        console.error('Error parsing JSON:', error)
        alert('خطأ في قراءة بيانات العقار')
        setLoading(false)
        router.push('/owner/property-details')
        return
      }
      
      console.log('Property data fetched:', property)
      
      if (!property || !property.id) {
        console.error('Invalid property data:', property)
        alert('بيانات العقار غير صحيحة')
        setLoading(false)
        router.push('/owner/property-details')
        return
      }
      
      setPropertyId(property.id)
      
      // Parse address to extract street name, neighborhood, and postal code
      const addressParts = property.address ? property.address.split('، ') : []
      const streetName = addressParts[0] || ''
      // Try to find neighborhood (usually after street name)
      let neighborhood = ''
      const neighborhoodIndex = addressParts.findIndex((part: string) => part.includes('الحي') || part.includes('حي'))
      if (neighborhoodIndex > 0) {
        neighborhood = addressParts[neighborhoodIndex].replace(/^(الحي|حي):?\s*/, '')
      } else if (addressParts.length > 1 && !addressParts[1].includes('الرمز البريدي')) {
        // If second part doesn't have postal code, it might be neighborhood
        neighborhood = addressParts[1]
      }
      const postalCodePart = addressParts.find((part: string) => part.includes('الرمز البريدي'))
      const postalCode = postalCodePart ? postalCodePart.replace('الرمز البريدي: ', '') : ''
      
      // Parse images
      let images: string[] = []
      if (property.images) {
        try {
          images = typeof property.images === 'string' ? JSON.parse(property.images) : property.images
          if (!Array.isArray(images)) {
            images = []
          }
        } catch (e) {
          console.warn('Error parsing images:', e)
          images = []
        }
      }
      
      // Parse features
      let features = {
        parking: false,
        garden: false,
        balcony: false,
        pool: false,
        elevator: false,
        gym: false,
        security: false,
        wifi: false,
        ac: false,
        jacuzzi: false
      }
      if (property.features) {
        try {
          const parsedFeatures = typeof property.features === 'string' ? JSON.parse(property.features) : property.features
          if (typeof parsedFeatures === 'object' && parsedFeatures !== null) {
            features = { ...features, ...parsedFeatures }
          }
        } catch (e) {
          console.warn('Error parsing features:', e)
          // Use defaults
        }
      }
      
      // Extract property name to get property type
      const nameParts = property.name ? property.name.split(' - ') : []
      const propertyTypeFromName = nameParts.length > 0 ? nameParts[0] : property.type || 'شقة'
      
      // Extract furnished status from property status
      let furnishedStatus = ''
      if (property.status && property.status.includes('مفروش')) {
        furnishedStatus = property.status.includes('غير مفروش') ? 'غير مفروشة' : 'مفروشة'
      }
      
      const newFormData = {
        propertyType: propertyTypeFromName,
        listingType: (property as any).listingType || 'للإيجار',
        furnishedStatus: furnishedStatus,
        rooms: property.rooms || '1',
        bathrooms: property.bathrooms || '1',
        area: property.area ? property.area.toString() : '',
        constructionYear: property.constructionYear || '',
        streetName,
        neighborhood: neighborhood || '',
        city: property.city || '',
        postalCode,
        country: property.country || 'المملكة العربية السعودية',
        images,
        features,
        description: property.description || '',
        monthlyRent: property.monthlyRent ? property.monthlyRent.toString() : '',
        price: (property as any).price ? (property as any).price.toString() : '',
        insurance: property.insurance ? property.insurance.toString() : '',
        availableFrom: property.availableFrom ? new Date(property.availableFrom).toISOString().split('T')[0] : '',
        minRentalPeriod: property.minRentalPeriod || 'شهر واحد',
        publicDisplay: property.publicDisplay || false,
        paymentEmail: property.paymentEmail || '',
        supportPhone: property.supportPhone || '',
        paymentAccount: property.paymentAccount || 'لا يوجد'
      }
      console.log('Setting form data:', newFormData)
      setFormData(newFormData)
      setLoading(false)
    } catch (error: any) {
      console.error('Error fetching property:', error)
      alert(`حدث خطأ في جلب بيانات العقار: ${error.message || 'خطأ غير معروف'}`)
      setLoading(false)
      router.push('/owner/property-details')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Prevent form submission on Enter key for steps 1-3
    if (e.key === 'Enter' && currentStep < 4) {
      e.preventDefault()
      // Don't navigate on Enter, just prevent submission
    }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxImages = 20
    const remainingSlots = maxImages - formData.images.length
    
    if (files.length > remainingSlots) {
      alert(`يمكنك تحميل ${remainingSlots} صورة فقط. لديك ${formData.images.length} صورة بالفعل.`)
      e.target.value = '' // Reset input
      return
    }

    const newImages: string[] = []

    for (let i = 0; i < files.length && formData.images.length + newImages.length < maxImages; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`الملف ${file.name} ليس صورة. سيتم تخطيه.`)
        continue
      }

      // Compress and convert to base64
      try {
        // Compress image before converting to base64
        // Max dimensions: 1920x1920, quality: 0.8 (80%)
        const compressedFile = await compressImage(file, 1920, 1920, 0.8)
        
        // Validate compressed file size (max 2MB after compression)
        if (compressedFile.size > 2 * 1024 * 1024) {
          alert(`بعد الضغط، الصورة ${file.name} لا تزال كبيرة جداً. يرجى اختيار صورة أصغر.`)
          continue
        }
        
        const base64 = await convertToBase64(compressedFile)
        newImages.push(base64)
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        alert(`حدث خطأ في معالجة ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }

    // Reset input
    e.target.value = ''
  }

  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Calculate new dimensions
          let width = img.width
          let height = img.height
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }
          
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }
              // Create a new File from the blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            quality
          )
        }
        img.onerror = reject
        
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result
        } else {
          reject(new Error('Failed to read image'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Create a fake event to reuse handleImageUpload
      const fakeEvent = {
        target: { files, value: '' }
      } as React.ChangeEvent<HTMLInputElement>
      handleImageUpload(fakeEvent)
    }
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only submit on step 4
    if (currentStep !== 4) {
      return
    }

    // Validate required fields
    if (!formData.streetName || !formData.neighborhood || !formData.city) {
      setSubmitError('يرجى إدخال اسم الشارع والحي والمدينة')
      setCurrentStep(2)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    
    try {
      // Get owner ID from localStorage (from login) or fallback to API
      let ownerId: string | null = null
      
      if (typeof window !== 'undefined') {
        ownerId = localStorage.getItem('userId')
        const userType = localStorage.getItem('userType')
        
        // Verify user is owner
        if (userType !== 'owner') {
          throw new Error('هذه الصفحة للملاك فقط')
        }
      }

      // Fallback: Get from API if not in localStorage
      if (!ownerId) {
        const ownerResponse = await fetch('/api/user/get-owner-id')
        if (!ownerResponse.ok) {
          throw new Error('فشل في الحصول على معلومات المستخدم')
        }
        const owner = await ownerResponse.json()
        ownerId = owner.id
      }
      
      // Build address string
      const addressParts = [formData.streetName]
      if (formData.neighborhood) {
        addressParts.push(`الحي: ${formData.neighborhood}`)
      }
      if (formData.postalCode) {
        addressParts.push(`الرمز البريدي: ${formData.postalCode}`)
      }
      const address = addressParts.join('، ')
      
      // Build status field: include furnished status for منزل، فيلا، شقة
      let status = 'متاح'
      if ((formData.propertyType === 'منزل' || formData.propertyType === 'فيلا' || formData.propertyType === 'شقة') && formData.furnishedStatus) {
        status = `متاح - ${formData.furnishedStatus}`
      }
      
      const propertyData = {
        ownerId,
        name: `${formData.propertyType} - ${formData.city}`,
        type: formData.propertyType,
        listingType: formData.listingType,
        address,
        city: formData.city,
        area: formData.area ? parseFloat(formData.area) : null,
        rooms: formData.rooms || null,
        bathrooms: formData.bathrooms || null,
        constructionYear: formData.constructionYear || null,
        // Location details
        postalCode: formData.postalCode || null,
        country: formData.country || 'المملكة العربية السعودية',
        // Features (as object, will be converted to JSON in API)
        features: formData.features,
        // Status: include furnished status for residential properties
        status: status,
        // Pricing
        monthlyRent: formData.listingType === 'للإيجار' && formData.monthlyRent ? parseFloat(formData.monthlyRent) : null,
        price: formData.listingType === 'للبيع' && formData.price ? parseFloat(formData.price) : null,
        insurance: formData.insurance ? parseFloat(formData.insurance) : null,
        availableFrom: formData.availableFrom || null,
        minRentalPeriod: formData.minRentalPeriod || null,
        publicDisplay: formData.publicDisplay || false,
        // Payment system
        paymentEmail: formData.paymentEmail || null,
        supportPhone: formData.supportPhone || null,
        paymentAccount: formData.paymentAccount || null,
        // Additional details
        description: formData.description || null,
        images: formData.images.length > 0 ? formData.images : null,
      }

      // Use PUT for edit mode, POST for create mode
      const propId = propertyId || getPropertyIdFromQuery()
      const url = isEditMode && propId 
        ? `/api/properties/${propId}`
        : '/api/properties'
      const method = isEditMode && propId ? 'PUT' : 'POST'
      
      console.log(`${method} request to ${url}`, propertyData)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error response:', data)
        throw new Error(data.error || (isEditMode ? 'فشل في تعديل العقار' : 'فشل في إضافة العقار'))
      }
      
      console.log('Success response:', data)

      // Success - show success message and redirect
      setSubmitSuccess(true)
      setTimeout(() => {
        router.push('/owner/property-details')
      }, 1500)
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} property:`, error)
      setSubmitError(error.message || `حدث خطأ أثناء ${isEditMode ? 'تعديل' : 'إضافة'} العقار. يرجى المحاولة مرة أخرى.`)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.addPropertyPage}>
        <OwnerNavigation currentPage="add-property" />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <p>جاري تحميل بيانات العقار...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                <h1>{isEditMode ? 'تعديل العقار' : 'إضافة عقار جديد'}</h1>
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
          {/* Success Message */}
          {submitSuccess && (
            <div className={styles.successMessage}>
              ✅ تم إضافة العقار بنجاح! جاري التوجيه...
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className={styles.errorMessage}>
              ❌ {submitError}
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Only submit if we're on step 4
            // For steps 1-3, do absolutely nothing - just prevent default
            if (currentStep === 4) {
              handleSubmit(e)
            }
            // For steps 1-3, do nothing - don't even navigate
          }} className={styles.form} noValidate>
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                {/* Sale or Rent Selection */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>نوع الإعلان</h2>
                  </div>
                  
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>هل تريد بيع أو إيجار العقار؟</label>
                    <select
                      name="listingType"
                      value={formData.listingType}
                      onChange={handleInputChange}
                      className={styles.fieldInput}
                    >
                      <option value="للإيجار">للإيجار</option>
                      <option value="للبيع">للبيع</option>
                    </select>
                  </div>
                </div>

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
                    {/* Hide rooms and bathrooms for أرض، مكتب، متجر */}
                    {formData.propertyType !== 'أرض' && formData.propertyType !== 'مكتب' && formData.propertyType !== 'متجر' && (
                      <>
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
                      </>
                    )}
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>المساحة (متر مربع)</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
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
                        onKeyDown={handleKeyDown}
                        placeholder=""
                        className={styles.fieldInput}
                      />
                    </div>
                    
                    {/* Show furnished status only for منزل، فيلا، شقة */}
                    {(formData.propertyType === 'منزل' || formData.propertyType === 'فيلا' || formData.propertyType === 'شقة') && (
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>حالة المفروشات</label>
                        <select
                          name="furnishedStatus"
                          value={formData.furnishedStatus}
                          onChange={handleInputChange}
                          className={styles.fieldInput}
                        >
                          <option value="">اختر الحالة</option>
                          <option value="مفروشة">مفروشة</option>
                          <option value="غير مفروشة">غير مفروشة</option>
                        </select>
                      </div>
                    )}
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
                          onKeyDown={handleKeyDown}
                          placeholder="مثال: شارع الملك فهد، رقم 123"
                          className={styles.fieldInput}
                        />
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الحي</label>
                        <input
                          type="text"
                          name="neighborhood"
                          value={formData.neighborhood}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="مثال: النخيل، العليا"
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
                          onKeyDown={handleKeyDown}
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
                          onKeyDown={handleKeyDown}
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
                    <div 
                      className={styles.uploadArea}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <div className={styles.uploadIcon}>☁️</div>
                      <p className={styles.uploadText}>اسحب الصور هنا أو انقر لرفعها</p>
                      <p className={styles.uploadHint}>
                        يمكنك تحميل حتى 20 صورة كحد أقصى. يفضل صور عالية الجودة
                      </p>
                      <label htmlFor="imageUpload" className={styles.addImagesBtn}>
                        <span className={styles.addIcon}>+</span>
                        أضف الصور
                      </label>
                      {formData.images.length > 0 && (
                        <p className={styles.imageCount}>
                          {formData.images.length} / 20 صورة
                        </p>
                      )}
                    </div>

                    {/* Image Preview Grid */}
                    {formData.images.length > 0 && (
                      <div className={styles.imagePreviewGrid}>
                        {formData.images.map((image, index) => (
                          <div key={index} className={styles.imagePreviewItem}>
                            <img 
                              src={image} 
                              alt={`Property ${index + 1}`}
                              className={styles.imagePreview}
                            />
                            <button
                              type="button"
                              className={styles.removeImageBtn}
                              onClick={() => handleRemoveImage(index)}
                              aria-label="إزالة الصورة"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
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
                    onKeyDown={handleKeyDown}
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
                    {formData.listingType === 'للإيجار' ? (
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>الإيجار الشهري</label>
                        <div className={styles.currencyInput}>
                          <input
                            type="text"
                            name="monthlyRent"
                            value={formData.monthlyRent}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                              // Prevent form submission on Enter in step 4 fields
                              if (e.key === 'Enter') {
                                e.preventDefault()
                              }
                            }}
                            placeholder="0"
                            className={styles.fieldInput}
                          />
                          <span className={styles.currency}>ريال/شهر</span>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>سعر البيع</label>
                        <div className={styles.currencyInput}>
                          <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                              // Prevent form submission on Enter in step 4 fields
                              if (e.key === 'Enter') {
                                e.preventDefault()
                              }
                            }}
                            placeholder="0"
                            className={styles.fieldInput}
                          />
                          <span className={styles.currency}>ريال</span>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>التأمين</label>
                      <div className={styles.currencyInput}>
                        <input
                          type="text"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            // Allow Enter on step 4 fields, but prevent form submission
                            if (e.key === 'Enter' && currentStep === 4) {
                              e.preventDefault()
                            }
                          }}
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
                    
                    {/* Hide minimum rental period for sale properties */}
                    {formData.listingType === 'للإيجار' && (
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
                    )}
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
                        onKeyDown={(e) => {
                          // Allow Enter on step 4 fields, but prevent form submission
                          if (e.key === 'Enter' && currentStep === 4) {
                            e.preventDefault()
                          }
                        }}
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
                        onKeyDown={(e) => {
                          // Allow Enter on step 4 fields, but prevent form submission
                          if (e.key === 'Enter' && currentStep === 4) {
                            e.preventDefault()
                          }
                        }}
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
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      prevStep()
                    }} 
                    className={styles.prevBtn}
                  >
                    السابق
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      nextStep()
                    }} 
                    className={styles.nextBtn}
                  >
                    التالي
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.loadingSpinner}>⏳</span>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <span className={styles.submitIcon}>←</span>
                        إضافة العقار
                      </>
                    )}
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
      <Footer />
    </div>
  )
}
