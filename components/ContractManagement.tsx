import { useState } from 'react'
import Link from 'next/link'
import OwnerNavigation from './OwnerNavigation'
import styles from '../styles/ContractManagement.module.css'

export default function ContractManagement() {
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState({
    searchQuery: ''
  })

  const contractMetrics = [
    {
      title: 'العقود النشطة',
      value: '24',
      change: '+8% مقارنة بالشهر الماضي',
      trend: 'up',
      icon: '✅'
    },
    {
      title: 'تنتهي قريباً',
      value: '7',
      change: '+3%',
      trend: 'up',
      icon: '⚠️'
    },
    {
      title: 'العقود المنتهية',
      value: '12',
      change: '0% - بحاجة إلى تجديد',
      trend: 'neutral',
      icon: '❌'
    }
  ]

  const contracts = [
    {
      name: 'عقد إيجار سكني',
      tenant: 'عبدالله محمد',
      status: 'نشط',
      leaseStatus: 'مرتبط بإيجار',
      overallStatus: 'متوافقة',
      statusColor: 'active'
    },
    {
      name: 'عقد بيع عقاري',
      tenant: 'فاطمة علي',
      status: 'قيد التوقيع',
      leaseStatus: 'غير مرتبط',
      overallStatus: 'لم تصدر',
      statusColor: 'pending'
    },
    {
      name: 'عقد إدارة عقار',
      tenant: 'شركة التقنية المتقدمة',
      status: 'منتهي',
      leaseStatus: 'مرتبط بإيجار',
      overallStatus: 'متوافقة',
      statusColor: 'expired'
    },
    {
      name: 'عقد إيجار تجاري',
      tenant: 'خالد الغامدي',
      status: 'مسودة',
      leaseStatus: 'غير مرتبط',
      overallStatus: 'لم تصدر',
      statusColor: 'draft'
    }
  ]

  const renewalNotifications = [
    {
      type: 'expired',
      title: 'عقد إدارة عقار منتهي',
      description: 'العقد # CON-2023-003 انتهى في 10 يونيو 2023 (منذ 45 يوم)',
      icon: '⚠️',
      urgent: true,
      actions: ['تجديد العقد', 'أرشفة العقد']
    },
    {
      type: 'expiring',
      title: 'عقد إيجار سكني ينتهي قريباً',
      description: 'العقد # CON-2023-001 سينتهي في 15 يناير 2024 (خلال 30 يوم)',
      icon: '🔔',
      urgent: false,
      actions: ['تجديد العقد', 'تذكيري لاحقاً']
    }
  ]

  const contractTemplates = [
    {
      title: 'عقد إيجار سكني',
      description: 'قالب قياسي لعقود الإيجار السكني يتوافق مع القوانين المحلية',
      features: ['سهل التخصيص', 'معتمد قانونياً'],
      icon: '🏠',
      action: 'استخدام القالب'
    },
    {
      title: 'عقد بيع عقاري',
      description: 'قالب شامل لعقود البيع العقاري مع ضمانات قانونية كاملة',
      features: ['حماية عالية', 'معتمد قانونياً'],
      icon: '🏢',
      action: 'استخدام القالب'
    },
    {
      title: 'عقد إيجار تجاري',
      description: 'قالب متكامل لعقود الإيجار التجاري مع شروط مفصلة',
      features: ['شروط مفصلة', 'معتمد قانونياً'],
      icon: '🏢',
      action: 'استخدام القالب'
    }
  ]

  const tabs = [
    { id: 'all', title: 'جميع العقود', active: activeTab === 'all' },
    { id: 'active', title: 'النشطة', active: activeTab === 'active' },
    { id: 'pending', title: 'قيد التوقيع', active: activeTab === 'pending' },
    { id: 'expired', title: 'المنتهية', active: activeTab === 'expired' },
    { id: 'drafts', title: 'المسودات', active: activeTab === 'drafts' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div className={styles.contractManagementPage}>
      {/* Header */}
      <OwnerNavigation currentPage="contract-management" />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>إدارة العقود</h1>
          </div>

          {/* Contract Overview Section */}
          <div className={styles.contractOverviewSection}>
            <div className={styles.searchAndCreate}>
              <div className={styles.searchSection}>
                <div className={styles.searchIcon}>🔍</div>
                <input
                  type="text"
                  name="searchQuery"
                  value={formData.searchQuery}
                  onChange={handleInputChange}
                  placeholder="البحث عن عقود"
                  className={styles.searchInput}
                />
              </div>
              <button className={styles.createContractBtn}>
                <span className={styles.addIcon}>+</span>
                إنشاء عقد جديد
              </button>
            </div>

            {/* Contract Metrics */}
            <div className={styles.metricsGrid}>
              {contractMetrics.map((metric, index) => (
                <div key={index} className={styles.metricCard}>
                  <div className={styles.metricIcon}>{metric.icon}</div>
                  <div className={styles.metricContent}>
                    <h3 className={styles.metricTitle}>{metric.title}</h3>
                    <div className={styles.metricValue}>{metric.value}</div>
                    <div className={`${styles.metricChange} ${styles[metric.trend]}`}>
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Assistant Section */}
          <div className={styles.smartAssistantSection}>
            <div className={styles.assistantHeader}>
              <div className={styles.assistantIcon}>💡</div>
              <h2 className={styles.assistantTitle}>المساعد الذكي لإدارة العقود</h2>
            </div>
            
            <div className={styles.assistantDescription}>
              <p>
                استخدم تقنية الذكاء الاصطناعي لتحليل وإدارة عقودك بكفاءة أعلى، سيساعدك المساعد الذكي في تحديد العقود التي تحتاج إلى تجديد وتوقع المشكلات المحتملة.
              </p>
            </div>
            
            <button className={styles.activateAssistantBtn}>
              تفعيل المساعد الذكي
            </button>
          </div>

          {/* Contracts List Section */}
          <div className={styles.contractsListSection}>
            {/* Tabs */}
            <div className={styles.tabsContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${tab.active ? styles.active : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Contracts Table */}
            <div className={styles.contractsTable}>
              <div className={styles.tableHeader}>
                <div>اسم العقد</div>
                <div>المستأجر</div>
                <div>الحالة</div>
                <div>حالة إيجار</div>
                <div>الإجراءات</div>
              </div>

              {contracts.map((contract, index) => (
                <div key={index} className={`${styles.tableRow} ${styles[contract.statusColor]}`}>
                  <div className={styles.contractName}>{contract.name}</div>
                  <div className={styles.tenantName}>{contract.tenant}</div>
                  <div className={styles.contractStatus}>
                    <span className={`${styles.statusBadge} ${styles[contract.statusColor]}`}>
                      {contract.status}
                    </span>
                  </div>
                  <div className={styles.leaseStatus}>{contract.leaseStatus}</div>
                  <div className={styles.overallStatus}>
                    <span className={`${styles.statusBadge} ${styles[contract.statusColor]}`}>
                      {contract.overallStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>عرض 1-4 من 45 عقد</span>
              <div className={styles.paginationButtons}>
                <button className={styles.paginationBtn}>السابق</button>
                <button className={styles.paginationBtn}>التالي</button>
              </div>
            </div>
          </div>

          {/* Renewal Notifications Section */}
          <div className={styles.renewalNotificationsSection}>
            <h2 className={styles.sectionTitle}>إشعارات التجديد</h2>
            
            <div className={styles.notificationsList}>
              {renewalNotifications.map((notification, index) => (
                <div key={index} className={`${styles.notificationCard} ${styles[notification.type]}`}>
                  <div className={styles.notificationIcon}>{notification.icon}</div>
                  <div className={styles.notificationContent}>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <p className={styles.notificationDescription}>{notification.description}</p>
                    <div className={styles.notificationActions}>
                      {notification.actions.map((action, actionIndex) => (
                        <button key={actionIndex} className={styles.notificationAction}>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Templates Section */}
          <div className={styles.contractTemplatesSection}>
            <h2 className={styles.sectionTitle}>قوالب العقود المتاحة</h2>
            
            <div className={styles.templatesGrid}>
              {contractTemplates.map((template, index) => (
                <div key={index} className={styles.templateCard}>
                  <div className={styles.templateIcon}>{template.icon}</div>
                  <div className={styles.templateContent}>
                    <h3 className={styles.templateTitle}>{template.title}</h3>
                    <p className={styles.templateDescription}>{template.description}</p>
                    <div className={styles.templateFeatures}>
                      {template.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button className={styles.useTemplateBtn}>
                      {template.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>أملاك تك</h4>
              <p className={styles.footerDescription}>
                منصة متكاملة تستثمر تقنيات الذكاء الاصطناعي وتعلم الآلة لإدارة العقارات والخدمات العقارية
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="فيسبوك">📘</a>
                <a href="#" aria-label="تويتر">🐦</a>
                <a href="#" aria-label="إنستغرام">📷</a>
                <a href="#" aria-label="لينكد إن">💼</a>
                <a href="#" aria-label="يوتيوب">📺</a>
              </div>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>المنتجات</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">إدارة الإيجارات</a></li>
                <li><a href="#">إدارة الصيانة</a></li>
                <li><a href="#">التحليلات والتقارير</a></li>
                <li><a href="#">تطبيق الجوال</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الحلول</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">لملاك العقارات</a></li>
                <li><a href="#">للمستأجرين</a></li>
                <li><a href="#">لمزودي الخدمات</a></li>
                <li><a href="#">لمديري العقارات</a></li>
                <li><a href="#">للشركات العقارية</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الموارد</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">مركز المساعدة</a></li>
                <li><a href="#">المدونة</a></li>
                <li><a href="#">دليل المستخدم</a></li>
                <li><a href="#">الندوات الإلكترونية</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>الشركة</h4>
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
      </footer>
    </div>
  )
}
