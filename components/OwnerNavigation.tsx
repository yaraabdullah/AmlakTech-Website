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
      href: '/owner/dashboard'
    },
    {
      id: 'add-property',
      title: 'إضافة عقار',
      href: '/owner/add-property'
    },
    {
      id: 'property-details',
      title: 'تفاصيل العقارات',
      href: '/owner/property-details'
    },
    {
      id: 'revenue-reports',
      title: 'تقارير الإيرادات',
      href: '/owner/revenue-reports'
    },
    {
      id: 'maintenance-schedule',
      title: 'جدول أعمال الصيانة',
      href: '/owner/maintenance-schedule'
    },
    {
      id: 'contract-management',
      title: 'إدارة العقود',
      href: '/owner/contract-management'
    },
    {
      id: 'property-analytics',
      title: 'تحليلات العقار',
      href: '/owner/property-analytics'
    },
    {
      id: 'account-settings',
      title: 'إعدادات الحساب',
      href: '/owner/account-settings'
    }
  ]

  const handleLogout = () => {
    // In a real app, this would clear authentication state
    router.push('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>أملاك تك</h1>
          <span>Amlak Tech</span>
        </Link>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${currentPage === item.id ? styles.active : ''}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.authButtons}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>أحمد محمد</span>
            <span className={styles.userRole}>مالك عقار</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </div>

        <button 
          className={styles.menuToggle}
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
