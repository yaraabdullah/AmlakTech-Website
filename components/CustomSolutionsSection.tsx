import styles from '../styles/CustomSolutionsSection.module.css'

export default function CustomSolutionsSection() {
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
    <section className={styles.customSolutionsSection}>
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
