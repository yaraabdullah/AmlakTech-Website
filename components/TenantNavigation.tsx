import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/TenantNavigation.module.css'

interface TenantNavigationProps {
  currentPage?: string
}

export default function TenantNavigation({ currentPage }: TenantNavigationProps) {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Get user info from localStorage or fetch from API
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId')
      const storedUserName = localStorage.getItem('userName')
      const storedUserEmail = localStorage.getItem('userEmail')
      const userType = localStorage.getItem('userType')

      // Only show user info if user is logged in as tenant
      if (storedUserId && (userType === 'tenant' || userType === 'مستأجر')) {
        setUserId(storedUserId)
        setUserName(storedUserName || '')
        setUserEmail(storedUserEmail || '')
        
        // Fetch user data if not in localStorage
        if (!storedUserName && storedUserId) {
          fetchUserData(storedUserId)
        }
      }
    }
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setUserName(`${userData.firstName || ''} ${userData.lastName || ''}`.trim())
        setUserEmail(userData.email || '')
        
        // Store in localStorage
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        if (typeof window !== 'undefined') {
          localStorage.setItem('userName', fullName)
          localStorage.setItem('userEmail', userData.email || '')
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId')
      localStorage.removeItem('userType')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('user')
    }
    router.push('/login')
  }

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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <h1>أملاك تك</h1>
          <span>Amlak Tech</span>
        </Link>
        
        {/* Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
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

        <div className={styles.authButtons}>
          {userId && userName ? (
            <div className={styles.userMenuContainer}>
              <button
                className={styles.userButton}
                onClick={() => setShowUserMenu(!showUserMenu)}
                onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
              >
                <div className={styles.userAvatar}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userName}</span>
                  <span className={styles.userEmail}>{userEmail}</span>
                </div>
                <span className={styles.dropdownIcon}>▼</span>
              </button>
              
              {showUserMenu && (
                <div className={styles.userMenu}>
                  <Link 
                    href="/tenant/account-settings"
                    className={styles.menuItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className={styles.menuIcon}>⚙️</span>
                    إعدادات الحساب
                  </Link>
                  <button 
                    className={styles.menuItem}
                    onClick={handleLogout}
                  >
                    <span className={styles.menuIcon}>🚪</span>
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className={styles.loginBtn}
              onClick={() => router.push('/login')}
            >
              تسجيل الدخول
            </button>
          )}
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
