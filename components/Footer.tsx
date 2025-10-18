import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <h3>أملاك تك</h3>
            <p>AmlakTech</p>
            <p className={styles.description}>
              حلول تقنية متطورة للعقارات
            </p>
          </div>
          
          <div className={styles.links}>
            <h4>روابط سريعة</h4>
            <ul>
              <li><a href="#home">الرئيسية</a></li>
              <li><a href="#services">خدماتنا</a></li>
              <li><a href="#about">من نحن</a></li>
              <li><a href="#contact">اتصل بنا</a></li>
            </ul>
          </div>
          
          <div className={styles.services}>
            <h4>خدماتنا</h4>
            <ul>
              <li>إدارة العقارات</li>
              <li>تحليل البيانات</li>
              <li>الحلول التقنية</li>
              <li>التطبيقات الذكية</li>
            </ul>
          </div>
          
          <div className={styles.contact}>
            <h4>تواصل معنا</h4>
            <div className={styles.contactItem}>
              <span>📧</span>
              <span>info@amlaktech.com</span>
            </div>
            <div className={styles.contactItem}>
              <span>📱</span>
              <span>+966 50 123 4567</span>
            </div>
            <div className={styles.contactItem}>
              <span>📍</span>
              <span>الرياض، السعودية</span>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2024 أملاك تك. جميع الحقوق محفوظة.</p>
          </div>
          <div className={styles.social}>
            <a href="#" aria-label="تويتر">🐦</a>
            <a href="#" aria-label="لينكد إن">💼</a>
            <a href="#" aria-label="إنستغرام">📷</a>
            <a href="#" aria-label="واتساب">💬</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
