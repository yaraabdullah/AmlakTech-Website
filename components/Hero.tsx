import styles from '../styles/Hero.module.css'

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1 className={styles.title}>
              مرحباً بك في <span className={styles.highlight}>أملاك تك</span>
            </h1>
            <p className={styles.subtitle}>
              حلول تقنية متطورة للعقارات - نقدم لك أفضل الخدمات التقنية في مجال العقارات
            </p>
            <div className={styles.buttons}>
              <button className={styles.primaryBtn}>
                اكتشف خدماتنا
              </button>
              <button className={styles.secondaryBtn}>
                تواصل معنا
              </button>
            </div>
          </div>
          <div className={styles.image}>
            <div className={styles.placeholder}>
              <span>صورة توضيحية</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.wave}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  )
}
