import styles from '../styles/PricingSection.module.css'

export default function PricingSection() {
  const packages = [
    {
      name: "الباقة الأساسية",
      price: "99",
      period: "شهرياً",
      description: "مناسبة للمالكين المبتدئين",
      features: [
        "حتى 3 عقارات",
        "إدارة العقود والمستأجرين",
        "تحصيل الإيجارات الإلكتروني",
        "تقارير أساسية"
      ],
      isPopular: false,
      buttonText: "اشترك الآن",
      buttonStyle: "secondary"
    },
    {
      name: "الباقة الاحترافية",
      price: "249",
      period: "شهرياً",
      description: "مناسبة لمالكي العقارات المتعددة",
      features: [
        "حتى 10 عقارات",
        "جميع مميزات الباقة الأساسية",
        "إدارة الصيانة المتقدمة",
        "تحليلات السوق والتوقعات",
        "تقارير متقدمة وتصدير البيانات"
      ],
      isPopular: true,
      buttonText: "اشترك الآن",
      buttonStyle: "primary"
    },
    {
      name: "باقة الشركات",
      price: "599",
      period: "شهرياً",
      description: "للشركات ومديري العقارات",
      features: [
        "عدد غير محدود من العقارات",
        "جميع مميزات الباقة الاحترافية",
        "إدارة متعددة المستخدمين",
        "واجهة برمجة التطبيقات API",
        "دعم مخصص على مدار الساعة"
      ],
      isPopular: false,
      buttonText: "اشترك الآن",
      buttonStyle: "secondary"
    }
  ]

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>باقات مرنة تناسب احتياجاتك</h2>
          <p className={styles.subtitle}>
            اختر الباقة المناسبة لحجم أعمالك مع إمكانية الترقية في أي وقت
          </p>
        </div>
        
        <div className={styles.packagesGrid}>
          {packages.map((pkg, index) => (
            <div key={index} className={`${styles.packageCard} ${pkg.isPopular ? styles.popular : ''}`}>
              {pkg.isPopular && (
                <div className={styles.popularBadge}>الأكثر شعبية</div>
              )}
              
              <div className={styles.packageHeader}>
                <h3 className={styles.packageName}>{pkg.name}</h3>
                <div className={styles.packagePrice}>
                  <span className={styles.price}>{pkg.price}</span>
                  <span className={styles.currency}>ريال</span>
                  <span className={styles.period}>/ {pkg.period}</span>
                </div>
                <p className={styles.packageDescription}>{pkg.description}</p>
              </div>
              
              <div className={styles.packageFeatures}>
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span className={styles.featureText}>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className={`${styles.packageButton} ${styles[pkg.buttonStyle]}`}>
                {pkg.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
