import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/OwnerNavigation.module.css'

interface OwnerNavigationProps {
  currentPage?: string
}

export default function OwnerNavigation({ currentPage }: OwnerNavigationProps) {
  const router = useRouter()

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      href: '/owner/dashboard',
      icon: '🏠'
    },
    {
      id: 'add-property',
      title: 'إضافة عقار',
      href: '/owner/add-property',
      icon: '➕'
    },
    {
      id: 'property-details',
      title: 'تفاصيل العقارات',
      href: '/owner/property-details',
      icon: '📋'
    },
    {
      id: 'revenue-reports',
      title: 'تقارير الإيرادات',
      href: '/owner/revenue-reports',
      icon: '💰'
    },
    {
      id: 'maintenance-schedule',
      title: 'جدول أعمال الصيانة',
      href: '/owner/maintenance-schedule',
      icon: '🔧'
    },
    {
      id: 'contract-management',
      title: 'إدارة العقود',
      href: '/owner/contract-management',
      icon: '📄'
    },
    {
      id: 'property-analytics',
      title: 'تحليلات العقار',
      href: '/owner/property-analytics',
      icon: '📊'
    },
    {
      id: 'account-settings',
      title: 'إعدادات الحساب',
      href: '/owner/account-settings',
      icon: '⚙️'
    }
  ]

  const handleLogout = () => {
    // In a real app, this would clear authentication state
    router.push('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>أملاك تك</h1>
            <span>Amlak Tech</span>
          </Link>
        </div>
        
        <nav className={styles.mainNav}>
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navLink} ${currentPage === item.id ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>أحمد محمد</span>
            <span className={styles.userRole}>مالك عقار</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={styles.mobileNav}>
        <div className={styles.mobileNavHeader}>
          <div className={styles.logo}>
            <Link href="/">
              <h1>أملاك تك</h1>
              <span>Amlak Tech</span>
            </Link>
          </div>
          <button className={styles.mobileMenuBtn}>
            <span>☰</span>
          </button>
        </div>
        
        <div className={styles.mobileNavContent}>
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.mobileNavLink} ${currentPage === item.id ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.title}</span>
            </Link>
          ))}
          
          <div className={styles.mobileUserInfo}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>أحمد محمد</span>
              <span className={styles.userRole}>مالك عقار</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
