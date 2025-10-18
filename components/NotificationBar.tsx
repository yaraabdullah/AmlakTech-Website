import styles from '../styles/NotificationBar.module.css'

export default function NotificationBar() {
  return (
    <div className={styles.notificationBar}>
      <div className={styles.container}>
        <p className={styles.text}>
          انضم إلى ندوتنا الإلكترونية: كيف تستخدم الذكاء الاصطناعي في سوق العقارات سجل الآن.
        </p>
      </div>
    </div>
  )
}
