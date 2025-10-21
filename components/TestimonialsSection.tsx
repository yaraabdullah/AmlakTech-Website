import styles from '../styles/TestimonialsSection.module.css'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "فهد القحطاني",
      role: "مدير عقارات - الدمام",
      avatar: "/icons/person.svg",
      rating: 5,
      text: "كمدير لمجموعة عقارات، وفرت علي المنصة الكثير من الوقت والجهد. التقارير التفصيلية ولوحة المعلومات الشاملة تمنحني رؤية واضحة عن أداء كل عقار في المحفظة."
    },
    {
      name: "سارة العتيبي",
      role: "مستأجرة - جدة",
      avatar: "/icons/person.svg",
      rating: 5,
      text: "كمستأجرة، أحب سهولة دفع الإيجار وتقديم طلبات الصيانة عبر التطبيق. التواصل مع المالك أصبح أسهل بكثير، والإشعارات التلقائية تذكرني بمواعيد الدفع."
    },
    {
      name: "أحمد الشمري",
      role: "مالك عقارات - الرياض",
      avatar: "/icons/person.svg",
      rating: 5,
      text: "منصة أملاك تك غيرت طريقة إدارتي العقارات بالكامل. أصبحت أستطيع متابعة جميع العقارات من مكان واحد، والتحليلات الذكية ساعدتني في اتخاذ قرارات استثمارية أفضل."
    }
  ]

  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>ماذا يقول عملاؤنا</h2>
          <p className={styles.subtitle}>
            آراء حقيقية من عملاء يستخدمون منصة أملاك تك في إدارة عقاراتهم
          </p>
        </div>
        
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.avatar}>{testimonial.avatar}</div>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{testimonial.name}</h3>
                  <p className={styles.userRole}>{testimonial.role}</p>
                </div>
              </div>
              
              <div className={styles.rating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className={styles.star}>⭐</span>
                ))}
              </div>
              
              <blockquote className={styles.testimonialText}>
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
