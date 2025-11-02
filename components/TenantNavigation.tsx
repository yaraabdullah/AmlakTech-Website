import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/TenantNavigation.module.css'

interface TenantNavigationProps {
  currentPage?: string
}

export default function TenantNavigation({ currentPage }: TenantNavigationProps) {
  const router = useRouter()

  const primaryNavigationItems = [
    {
      id: 'search-properties',
      title: 'بحث عن عقار',
      href: '/search-properties'
    },
    {
      id: 'sign-contract',
      title: 'توقيع عقد ايجار',
      href: '/tenant/sign-contract' // TODO: Create this page
    },
    {
      id: 'lease-records',
      title: 'سجل الايجارات',
      href: '/tenant/lease-records' // TODO: Create this page
    },
    {
      id: 'maintenance-request',
      title: 'طلب صيانه',
      href: '/tenant/maintenance-request' // TODO: Create this page
    },
    {
      id: 'property-valuation',
      title: 'تقييم عقار',
      href: '/tenant/property-valuation' // TODO: Create this page
    }
  ]

  const secondaryNavigationItems = [
    {
      id: 'home',
      title: 'الرئيسية',
      href: '/'
    },
    {
      id: 'features',
      title: 'المميزات',
      href: '/#features'
    },
    {
      id: 'subscriptions',
      title: 'الاشتراكات',
      href: '/#pricing'
    },
    {
      id: 'support',
      title: 'الدعم',
      href: '/#contact' // TODO: Create support page
    }
  ]

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <h1>أملاك تك</h1>
          <span>Amlak Tech</span>
        </Link>
        
        {/* Primary Navigation (Left side) */}
        <nav className={styles.primaryNav}>
          <ul className={styles.primaryNavList}>
            {primaryNavigationItems.map((item) => (
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

        {/* Secondary Navigation and Login Button (Right side) */}
        <div className={styles.rightSection}>
          <nav className={styles.secondaryNav}>
            <ul className={styles.secondaryNavList}>
              {secondaryNavigationItems.map((item) => (
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

          <button 
            className={styles.loginBtn}
            onClick={handleLogin}
          >
            تسجيل الدخول
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
