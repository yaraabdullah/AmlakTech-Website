import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>ابدأ في تحسين إدارة عقاراتك اليوم</h2>
          <p className={styles.ctaSubtitle}>
            انضم إلى آلاف العملاء الذين يستخدمون أملاك تك لإدارة عقاراتهم بذكاء
          </p>
          <div className={styles.ctaContent}>
            <button className={styles.ctaButton}>ابدأ تجربتك المجانية</button>
            <p className={styles.trialInfo}>لا حاجة لبطاقة ائتمان. تجربة مجانية لمدة 14 يوم.</p>
          </div>
        </div>
      </div>
      
      {/* Main Footer Section */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            {/* Amlak Tech Column */}
            <div className={styles.footerColumn}>
              <h4 className={styles.brandTitle}>أملاك تك</h4>
              <p className={styles.brandSubtitle}>Amlak Tech</p>
              <p className={styles.brandDescription}>
                منصة متكاملة تستثمر تقنيات الذكاء الاصطناعي وتعلم الآلة لإدارة العقارات والخدمات العقارية
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="يوتيوب">
                  <img src="/icons/youtube.svg" alt="يوتيوب" className={styles.socialIcon} />
                </a>
                <a href="#" aria-label="إنستغرام">
                  <img src="/icons/instagram.svg" alt="إنستغرام" className={styles.socialIcon} />
                </a>
                <a href="#" aria-label="لينكد إن">
                  <img src="/icons/linkedin.svg" alt="لينكد إن" className={styles.socialIcon} />
                </a>
                <a href="#" aria-label="تويتر">
                  <img src="/icons/twitter.svg" alt="تويتر" className={styles.socialIcon} />
                </a>
              </div>
            </div>
            
            {/* Products Column */}
            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>المنتجات</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">إدارة العقارات</a></li>
                <li><a href="#">إدارة الإيجارات</a></li>
                <li><a href="#">إدارة الصيانة</a></li>
                <li><a href="#">التحليلات والتقارير</a></li>
                <li><a href="#">تطبيق الجوال</a></li>
              </ul>
            </div>
            
            {/* Solutions Column */}
            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>الحلول</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">لملاك العقارات</a></li>
                <li><a href="#">للمستأجرين</a></li>
                <li><a href="#">لمزودي الخدمات</a></li>
                <li><a href="#">لمديري العقارات</a></li>
                <li><a href="#">للشركات العقارية</a></li>
              </ul>
            </div>
            
            {/* Resources Column */}
            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>الموارد</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">مركز المساعدة</a></li>
                <li><a href="#">المدونة</a></li>
                <li><a href="#">دليل المستخدم</a></li>
                <li><a href="#">الندوات الإلكترونية</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            
            {/* Company Column */}
            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>الشركة</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">عن الشركة</a></li>
                <li><a href="#">فريق العمل</a></li>
                <li><a href="#">الوظائف</a></li>
                <li><a href="#">اتصل بنا</a></li>
                <li><a href="#">الشركاء</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer Section */}
      <div className={styles.bottomFooter}>
        <div className={styles.container}>
          <div className={styles.bottomBar}>
            <div className={styles.legalLinks}>
              <a href="#">سياسة الخصوصية</a>
              <span>|</span>
              <a href="#">شروط الاستخدام</a>
              <span>|</span>
              <a href="#">سياسة ملفات تعريف الارتباط</a>
            </div>
            <div className={styles.copyright}>
              <p>© 2025 أملاك تك. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
