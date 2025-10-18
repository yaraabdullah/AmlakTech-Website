import styles from '../styles/Services.module.css'

export default function Services() {
  const services = [
    {
      icon: '🏠',
      title: 'إدارة العقارات',
      description: 'نقدم خدمات إدارة شاملة للعقارات مع أحدث التقنيات'
    },
    {
      icon: '📊',
      title: 'تحليل البيانات',
      description: 'تحليل متقدم لبيانات السوق العقاري لاتخاذ قرارات مدروسة'
    },
    {
      icon: '💻',
      title: 'الحلول التقنية',
      description: 'تطوير تطبيقات ومواقع ويب متخصصة في مجال العقارات'
    },
    {
      icon: '📱',
      title: 'التطبيقات الذكية',
      description: 'تطبيقات جوال متطورة لتسهيل عمليات العقارات'
    },
    {
      icon: '🔍',
      title: 'البحث والاستكشاف',
      description: 'أدوات بحث متقدمة للعثور على العقارات المناسبة'
    },
    {
      icon: '📈',
      title: 'التقارير والإحصائيات',
      description: 'تقارير مفصلة وإحصائيات دقيقة عن السوق العقاري'
    }
  ]

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>خدماتنا</h2>
          <p className={styles.subtitle}>
            نقدم مجموعة شاملة من الخدمات التقنية المتطورة في مجال العقارات
          </p>
        </div>
        
        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
