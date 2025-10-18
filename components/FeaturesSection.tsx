import styles from '../styles/FeaturesSection.module.css'

export default function FeaturesSection() {
  const features = [
    {
      icon: "💳",
      title: "إدارة المدفوعات",
      description: "تحصيل الإيجارات ومتابعة المدفوعات والمتأخرات مع خيارات دفع متعددة ولوحة تحكم متكاملة"
    },
    {
      icon: "📋",
      title: "إدارة العقود الذكية",
      description: "إنشاء وإدارة العقود إلكترونياً مع إمكانية التوقيع الرقمي والتذكير التلقائي بمواعيد التجديد"
    },
    {
      icon: "🤖",
      title: "تحليلات ذكية بالذكاء الاصطناعي",
      description: "تحليل بيانات السوق العقاري واستخراج رؤى قيمة لمساعدتك في اتخاذ قرارات استثمارية أفضل"
    },
    {
      icon: "🔧",
      title: "إدارة الصيانة",
      description: "نظام متكامل لإدارة طلبات الصيانة وتتبع حالتها والتواصل مع مزودي الخدمات"
    },
    {
      icon: "📊",
      title: "تقارير وإحصائيات",
      description: "تقارير تفصيلية عن أداء العقارات والإيرادات والمصروفات مع إمكانية تخصيص التقارير"
    },
    {
      icon: "📱",
      title: "تطبيق جوال متكامل",
      description: "إدارة ممتلكاتك من أي مكان عبر تطبيق الجوال Android و iOS المتوافق مع أنظمة"
    }
  ]

  const userProfiles = [
    {
      image: "👨‍💼",
      title: "لملاك العقارات",
      description: "سلطان، مالك 5 عقارات استثمارية"
    },
    {
      image: "👩‍💼",
      title: "للمستأجرين",
      description: "منى تبحث عن شقة مناسبة للإيجار"
    }
  ]

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.container}>
        {/* Features Cards */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Custom Solutions Section */}
        <div className={styles.solutionsSection}>
          <h2 className={styles.solutionsTitle}>حلول مخصصة لجميع المستخدمين</h2>
          <p className={styles.solutionsDescription}>
            توفر منصة أملاك تك حلولاً متكاملة تناسب احتياجات جميع الأطراف في السوق العقاري
          </p>
        </div>

        {/* User Profiles */}
        <div className={styles.profilesGrid}>
          {userProfiles.map((profile, index) => (
            <div key={index} className={styles.profileCard}>
              <div className={styles.profileImage}>{profile.image}</div>
              <h3 className={styles.profileTitle}>{profile.title}</h3>
              <p className={styles.profileDescription}>{profile.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
