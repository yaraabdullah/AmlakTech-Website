import { useState } from 'react'
import styles from '../styles/Contact.module.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.')
  }

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>اتصل بنا</h2>
          <p className={styles.subtitle}>
            نحن هنا لمساعدتك. تواصل معنا للحصول على استشارة مجانية
          </p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <div className={styles.icon}>📧</div>
              <div className={styles.details}>
                <h3>البريد الإلكتروني</h3>
                <p>info@amlaktech.com</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.icon}>📱</div>
              <div className={styles.details}>
                <h3>الهاتف</h3>
                <p>+966 50 123 4567</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.icon}>📍</div>
              <div className={styles.details}>
                <h3>العنوان</h3>
                <p>الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="الاسم الكامل"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="tel"
                name="phone"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <textarea
                name="message"
                placeholder="رسالتك"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className={styles.submitBtn}>
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
