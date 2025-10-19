import Image from 'next/image'
import styles from '../styles/FeaturesSection.module.css'

export default function FeaturesSection() {
  const features = [
    {
      icon: "/icons/ai-analytics.svg",
      title: "تحليلات ذكية بالذكاء الاصطناعي",
      description: "تحليل بيانات السوق العقاري واستخراج رؤى قيمة لمساعدتك في اتخاذ قرارات استثمارية أفضل"
    },
    {
      icon: "/icons/smart-contracts.svg",
      title: "إدارة العقود الذكية",
      description: "إنشاء وإدارة العقود إلكترونياً مع إمكانية التوقيع الرقمي والتذكير التلقائي بمواعيد التجديد"
    },
    {
      icon: "/icons/payment-management.svg",
      title: "إدارة المدفوعات",
      description: "تحصيل الإيجارات ومتابعة المدفوعات والمتأخرات مع خيارات دفع متعددة ولوحة تحكم متكاملة"
    },
    {
      icon: "/icons/maintenance.svg",
      title: "إدارة الصيانة",
      description: "نظام متكامل لإدارة طلبات الصيانة وتتبع حالتها والتواصل مع مزودي الخدمات"
    },
    {
      icon: "/icons/reports.svg",
      title: "تقارير وإحصائيات",
      description: "تقارير تفصيلية عن أداء العقارات والإيرادات والمصروفات مع إمكانية تخصيص التقارير"
    },
    {
      icon: "/icons/mobile-app.svg",
      title: "تطبيق جوال متكامل",
      description: "إدارة ممتلكاتك من أي مكان عبر تطبيق الجوال Android و iOS المتوافق مع أنظمة"
    }
  ]

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>مميزات منصة أملاك تك</h2>
          <p className={styles.sectionSubtitle}>
            منصة متكاملة تجمع بين التقنيه المتطورة والذكاء الاصطناعي لتوفير تجربة فريدة في إدارة العقارات
          </p>
        </div>

        {/* Features Cards */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image 
                  src={feature.icon} 
                  alt={feature.title}
                  width={64}
                  height={64}
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                  }}
                />
                <span className={styles.fallbackIcon} style={{display: 'none'}}>
                  {feature.icon.includes('ai-analytics') ? '🤖' :
                   feature.icon.includes('smart-contracts') ? '📋' :
                   feature.icon.includes('payment-management') ? '💳' :
                   feature.icon.includes('maintenance') ? '🔧' :
                   feature.icon.includes('reports') ? '📊' :
                   feature.icon.includes('mobile-app') ? '📱' : '📋'}
                </span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
