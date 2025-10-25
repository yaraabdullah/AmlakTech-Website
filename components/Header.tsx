import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    // Redirect to owner dashboard for testing
    router.push('/owner/dashboard')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>أملاك تك</h1>
          <span>Amlak Tech</span>
        </Link>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li><a href="/#features">المميزات</a></li>
            <li><a href="/#solutions">الحلول</a></li>
            <li><a href="/#pricing">الأسعار</a></li>
            <li><a href="/#testimonials">آراء العملاء</a></li>
            <li><a href="/#contact">تواصل معنا</a></li>
          </ul>
        </nav>

        <div className={styles.authButtons}>
          <button className={styles.loginBtn} onClick={handleLogin}>تسجيل الدخول</button>
          <a href="/signup" className={styles.signupBtn}>ابدأ مجاناً</a>
        </div>

        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="فتح القائمة"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}