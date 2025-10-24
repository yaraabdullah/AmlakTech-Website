import styles from '../styles/CustomSolutionsSection.module.css'

export default function CustomSolutionsSection() {
  const userProfiles = [
    {
      image: "/icons/customer.svg",
      title: "للمستأجرين",
      description: "منى تبحث عن شقة مناسبة للإيجار",
      features: [
        "بحث ذكي عن العقارات بحسب الاحتياجات",
        "دفع الإيجار إلكترونياً بطرق متعددة",
        "تقديم طلبات الصيانة ومتابعتها",
        "الاطلاع على العقد والمستندات إلكترونياً"
      ]
    },
    {
      image: "/icons/customer.svg",
      title: "لملاك العقارات",
      description: "سلطان، مالك 5 عقارات استثمارية",
      features: [
        "إدارة متكاملة لجميع العقارات من منصة واحدة",
        "تحصيل الإيجارات تلقائياً وإدارة المتأخرات",
        "تقارير مالية وتحليلات لأداء العقارات",
        "تنبؤات ذكية لأسعار العقارات وفرص الاستثمار"
      ]
    },
    {
      image: "/icons/customer.svg",
      title: "لمدير عقارات",
      description: "عبدالعزيز، مدير عقارات منظم",
      features: [
        "إدارة متكاملة لجميع العقارات من منصة واحدة",
        "تحصيل الإيجارات تلقائياً وإدارة المتأخرات",
        "تقارير مالية وتحليلات لأداء العقارات",
        "تنبؤات ذكية لأسعار العقارات وفرص الاستثمار"
      ]
    },
    {
      image: "/icons/customer.svg",
      title: "لمزودي الخدمات",
      description: "راكان، فني صيانة متخصص",
      features: [
        "استلام طلبات الصيانة والخدمات مباشرة",
        "جدولة المواعيد وإدارة فريق العمل",
        "إصدار الفواتير وتحصيل المدفوعات",
        "بناء سمعة وتقييمات من العملاء"
      ]
    }
  ]

  return (
    <section id="solutions" className={styles.customSolutionsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>حلول مخصصة لجميع المستخدمين</h2>
          <p className={styles.sectionSubtitle}>
            توفر منصة أملاك تك حلولاً متكاملة تناسب احتياجات جميع الأطراف في السوق العقاري
          </p>
        </div>

        <div className={styles.profilesGrid}>
          {userProfiles.map((profile, index) => (
            <div key={index} className={styles.profileCard}>
              <div className={styles.profileImageContainer}>
                <img 
                  src={profile.image} 
                  alt={profile.title}
                  className={styles.profileImage}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <div className={styles.profileImagePlaceholder}>
                  {profile.title === "للمستأجرين" ? "👩‍💼" : 
                   profile.title === "لملاك العقارات" ? "👨‍💼" :
                   profile.title === "لمدير عقارات" ? "👨‍💼" : "👨‍🔧"}
                </div>
              </div>
              <h3 className={styles.profileTitle}>{profile.title}</h3>
              <p className={styles.profileDescription}>{profile.description}</p>
              <ul className={styles.featuresList}>
                {profile.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.featureItem}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={styles.discoverButton}>اكتشف المزيد</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
