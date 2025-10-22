import styles from '../styles/Hero.module.css'

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.backgroundImage}>
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              منصة ذكية لإدارة العقارات والخدمات العقارية
            </h1>
            <p className={styles.subtitle}>
              استخدم قوة الذكاء الاصطناعي لتحسين إدارة ممتلكاتك وتحقيق أقصى عائد استثماري
            </p>
            <div className={styles.buttons}>
              <button className={styles.primaryBtn}>
                ابدأ الآن
              </button>
              <button className={styles.secondaryBtn}>
                طلب عرض توضيحي
              </button>
            </div>
          </div>
          
          <div className={styles.imageContent}>
            <div className={styles.imageContainer}>
              <img 
                src="/icons/hero-dashboard.svg" 
                alt="منصة أملاك تك - لوحة تحكم ذكية لإدارة العقارات"
                className={styles.heroImage}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div className={styles.imageFallback}>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderContent}>
                    <div className={styles.placeholderIcon}>🏢</div>
                    <p className={styles.placeholderText}>منصة أملاك تك</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
