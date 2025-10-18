import styles from '../styles/About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h2 className={styles.title}>من نحن</h2>
            <p className={styles.description}>
              نحن في أملاك تك نؤمن بأن التكنولوجيا هي المستقبل في مجال العقارات. 
              نسعى لتقديم حلول تقنية متطورة تساعد عملائنا على اتخاذ قرارات مدروسة 
              وتحقيق أهدافهم العقارية بكفاءة عالية.
            </p>
            <p className={styles.description}>
              فريقنا من المطورين والمحللين المتخصصين يعمل بجد لتطوير أدوات وخدمات 
              مبتكرة تجعل عملية البحث عن العقارات وإدارتها أكثر سهولة وفعالية.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.number}>500+</span>
                <span className={styles.label}>عميل راضي</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.number}>1000+</span>
                <span className={styles.label}>عقار مُدار</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.number}>5+</span>
                <span className={styles.label}>سنوات خبرة</span>
              </div>
            </div>
          </div>
          <div className={styles.image}>
            <div className={styles.placeholder}>
              <span>صورة الفريق</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
