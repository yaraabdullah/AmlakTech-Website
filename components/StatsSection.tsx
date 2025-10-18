import styles from '../styles/StatsSection.module.css'

export default function StatsSection() {
  const stats = [
    {
      number: "98%",
      label: "نسبة رضا العملاء",
      icon: "📊"
    },
    {
      number: "15,000",
      label: "مستأجر",
      icon: "👥"
    },
    {
      number: "5,000",
      label: "مالك عقار",
      icon: "🏠"
    },
    {
      number: "10,000",
      label: "عقار مدار",
      icon: "📈"
    }
  ]

  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>+{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
