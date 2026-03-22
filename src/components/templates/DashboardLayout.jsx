import Sidebar from "../organisms/Sidebar";
import Topbar from "../organisms/Topbar";

/**
 * @param {Array}    navItems    
 * @param {Array}    navSections 
 * @param {string}   activeSection
 * @param {Function} onSectionChange
 * @param {Function} onLogout
 * @param {string}   userName
 * @param {string}   userRole
 * @param {string}   searchPlaceholder
 * @param {ReactNode}children
 */
export default function DashboardLayout({
  navItems = [],
  navSections = [],
  activeSection,
  onSectionChange,
  onLogout,
  userName,
  userRole,
  searchPlaceholder = "Buscar paciente...",
  children,
}) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--gray-bg)" }}>
      <Sidebar
        items={navItems}
        sections={navSections}
        active={activeSection}
        onChange={onSectionChange}
        onLogout={onLogout}
      />
      <div style={{ marginLeft:220, flex:1, display:"flex", flexDirection:"column" }}>
        <Topbar
          userName={userName}
          userRole={userRole}
          searchPlaceholder={searchPlaceholder}
        />
        <main style={{ flex:1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
