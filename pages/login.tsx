import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/Login.module.css'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError(null) // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء تسجيل الدخول')
      }

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userType', data.user.userType)

      // Redirect based on user type
      const userTypeRoutes: { [key: string]: string } = {
        owner: '/owner/dashboard',
        tenant: '/search-properties',
        service_provider: '/', // TODO: Add service provider dashboard
        property_manager: '/', // TODO: Add property manager dashboard
      }

      const redirectPath = userTypeRoutes[data.user.userType] || '/'
      router.push(redirectPath)
    } catch (error: any) {
      console.error('Error logging in:', error)
      setError(error.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <h1 className={styles.loginTitle}>تسجيل الدخول</h1>
              <p className={styles.loginSubtitle}>مرحباً بعودتك! أدخل بياناتك للوصول إلى حسابك</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className={styles.fieldInput}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  className={styles.fieldInput}
                  required
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" />
                  <span>تذكرني</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.loadingSpinner}>⏳</span>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>
            </form>

            <div className={styles.signupLink}>
              <p>ليس لديك حساب؟ <Link href="/signup">سجل الآن</Link></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

