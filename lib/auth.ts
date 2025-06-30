"use client"

export interface CustomPermissions {
  canManageMeetings: boolean
  canManageUsers: boolean
  canManagePages: boolean
  canManageChat: boolean
  canViewAnalytics: boolean
  canModerateContent: boolean
  canAccessFinancials: boolean
  canManageSettings: boolean
}

export interface Member {
  id: string
  username: string
  password: string
  name: string
  role: "honorary" | "standard" | "manager" | "executive" | "ceo"
  tier: "honorary" | "standard" | "manager" | "executive" | "ceo"
  email: string
  joinDate: string
  lastLogin?: string
  acceptedCodeOfConduct?: boolean
  isAdmin?: boolean
  status: "active" | "suspended" | "inactive"
  customPermissions?: CustomPermissions
}

// Default permissions for different roles
const getDefaultPermissions = (role: string, isAdmin: boolean): CustomPermissions => {
  if (isAdmin) {
    return {
      canManageMeetings: true,
      canManageUsers: true,
      canManagePages: true,
      canManageChat: true,
      canViewAnalytics: true,
      canModerateContent: true,
      canAccessFinancials: true,
      canManageSettings: true,
    }
  }

  const basePermissions: CustomPermissions = {
    canManageMeetings: false,
    canManageUsers: false,
    canManagePages: false,
    canManageChat: false,
    canViewAnalytics: false,
    canModerateContent: false,
    canAccessFinancials: false,
    canManageSettings: false,
  }

  switch (role) {
    case "ceo":
      return {
        ...basePermissions,
        canManageMeetings: true,
        canViewAnalytics: true,
        canAccessFinancials: true,
        canModerateContent: true,
      }
    case "executive":
      return {
        ...basePermissions,
        canManageMeetings: true,
        canViewAnalytics: true,
        canModerateContent: true,
      }
    case "manager":
      return {
        ...basePermissions,
        canManageMeetings: true,
        canModerateContent: true,
      }
    default:
      return basePermissions
  }
}

// Updated member database with custom permissions
export const members: Member[] = [
  {
    id: "1",
    username: "jasper_shaw",
    password: "jasper2024!",
    name: "Jasper Shaw",
    role: "ceo",
    tier: "ceo",
    email: "jasper@projectarcadia.com",
    joinDate: "2023-01-01",
    acceptedCodeOfConduct: false,
    isAdmin: true,
    status: "active",
    customPermissions: getDefaultPermissions("ceo", true),
  },
  {
    id: "2",
    username: "alex_romanov",
    password: "alex2024!",
    name: "Alex Romanov",
    role: "executive",
    tier: "executive",
    email: "alex@projectarcadia.com",
    joinDate: "2023-02-01",
    acceptedCodeOfConduct: false,
    isAdmin: true,
    status: "active",
    customPermissions: getDefaultPermissions("executive", true),
  },
  {
    id: "3",
    username: "rupert_mcvey",
    password: "rupert2024!",
    name: "Rupert McVey",
    role: "executive",
    tier: "executive",
    email: "rupert@projectarcadia.com",
    joinDate: "2023-02-15",
    acceptedCodeOfConduct: false,
    isAdmin: false,
    status: "active",
    customPermissions: getDefaultPermissions("executive", false),
  },
  {
    id: "4",
    username: "bowen_jiang",
    password: "bowen2024!",
    name: "Bowen Jiang",
    role: "manager",
    tier: "manager",
    email: "bowen@projectarcadia.com",
    joinDate: "2023-03-01",
    acceptedCodeOfConduct: false,
    isAdmin: false,
    status: "active",
    customPermissions: getDefaultPermissions("manager", false),
  },
  {
    id: "5",
    username: "william_lin",
    password: "william2024!",
    name: "William Lin",
    role: "manager",
    tier: "manager",
    email: "william@projectarcadia.com",
    joinDate: "2023-03-15",
    acceptedCodeOfConduct: false,
    isAdmin: false,
    status: "active",
    customPermissions: getDefaultPermissions("manager", false),
  },
  {
    id: "6",
    username: "harry_lee",
    password: "harry2024!",
    name: "Harry Lee",
    role: "manager",
    tier: "manager",
    email: "harry@projectarcadia.com",
    joinDate: "2023-04-01",
    acceptedCodeOfConduct: false,
    isAdmin: false,
    status: "active",
    customPermissions: getDefaultPermissions("manager", false),
  },
  {
    id: "7",
    username: "suri_chun",
    password: "suri2024!",
    name: "Suri Chun",
    role: "standard",
    tier: "standard",
    email: "suri@projectarcadia.com",
    joinDate: "2023-06-01",
    acceptedCodeOfConduct: false,
    isAdmin: false,
    status: "active",
    customPermissions: getDefaultPermissions("standard", false),
  },
  {
    id: "8",
    username: "rafael_fok",
    password: "rafael2024!",
    name: "Rafael Fok",
    role: "honorary",
    tier: "honorary",
    email: "rafael@projectarcadia.com",
    joinDate: "2022-12-01",
    acceptedCodeOfConduct: false,
    isAdmin: false,
    status: "active",
    customPermissions: getDefaultPermissions("honorary", false),
  },
]

export const BLOCKED_KEY = "arcadia_blocked"
export const LOGIN_ATTEMPTS_KEY = "arcadia_login_attempts"
export const SESSION_KEY = "arcadia_session"
export const REMEMBER_ME_KEY = "arcadia_remember_me"

export function isBlocked(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(BLOCKED_KEY) === "true"
}

export function getLoginAttempts(): number {
  if (typeof window === "undefined") return 0
  return Number.parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0")
}

export function incrementLoginAttempts(): number {
  if (typeof window === "undefined") return 0
  const attempts = getLoginAttempts() + 1
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, attempts.toString())

  if (attempts >= 5) {
    localStorage.setItem(BLOCKED_KEY, "true")
  }

  return attempts
}

export function resetLoginAttempts(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
}

export function acceptCodeOfConduct(userId: string): void {
  if (typeof window === "undefined") return
  const sessionData = localStorage.getItem(SESSION_KEY)
  if (!sessionData) return

  try {
    const session = JSON.parse(sessionData)
    if (session.id === userId) {
      session.acceptedCodeOfConduct = true
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))

      const member = members.find((m) => m.id === userId)
      if (member) {
        member.acceptedCodeOfConduct = true
      }
    }
  } catch {
    // Handle error silently
  }
}

export function authenticate(username: string, password: string, rememberMe = false): Member | null {
  const member = members.find((m) => m.username === username && m.password === password)
  if (member && member.status === "active") {
    resetLoginAttempts()
    const sessionData = {
      id: member.id,
      username: member.username,
      name: member.name,
      role: member.role,
      tier: member.tier,
      isAdmin: member.isAdmin || false,
      customPermissions: member.customPermissions || getDefaultPermissions(member.role, member.isAdmin || false),
      loginTime: new Date().toISOString(),
      acceptedCodeOfConduct: member.acceptedCodeOfConduct || false,
      rememberMe,
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, "true")
      // Set expiration for 30 days
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000
      sessionData.expiresAt = expirationTime
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY)
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    return member
  }
  return null
}

export function getCurrentUser(): Member | null {
  if (typeof window === "undefined") return null
  const sessionData = localStorage.getItem(SESSION_KEY)
  if (!sessionData) return null

  try {
    const session = JSON.parse(sessionData)

    // Check if session has expired (only for non-remember-me sessions)
    if (!session.rememberMe) {
      const sessionAge = new Date().getTime() - new Date(session.loginTime).getTime()
      const maxAge = 8 * 60 * 60 * 1000 // 8 hours
      if (sessionAge > maxAge) {
        logout()
        return null
      }
    } else if (session.expiresAt && new Date().getTime() > session.expiresAt) {
      // Check remember-me expiration
      logout()
      return null
    }

    const member = members.find((m) => m.id === session.id)
    if (member) {
      // Update session with latest member data
      const updatedSession = {
        ...session,
        customPermissions: member.customPermissions || getDefaultPermissions(member.role, member.isAdmin || false),
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
    }

    return member || null
  } catch {
    return null
  }
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(REMEMBER_ME_KEY)
}

export function redirectIfBlocked(): void {
  if (typeof window === "undefined") return
  if (isBlocked()) {
    window.location.href = "http://www.joinus.projectarcadia.xyz"
  }
}

// Admin functions
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.isAdmin || false
}

export function hasPermission(permission: keyof CustomPermissions): boolean {
  const user = getCurrentUser()
  if (!user) return false
  if (user.isAdmin) return true
  return user.customPermissions?.[permission] || false
}

export function updateMemberStatus(memberId: string, status: "active" | "suspended" | "inactive"): boolean {
  const member = members.find((m) => m.id === memberId)
  if (member) {
    member.status = status
    return true
  }
  return false
}

export function updateMemberRole(memberId: string, role: Member["role"], tier: Member["tier"]): boolean {
  const member = members.find((m) => m.id === memberId)
  if (member) {
    member.role = role
    member.tier = tier
    // Update default permissions based on new role
    if (!member.isAdmin) {
      member.customPermissions = getDefaultPermissions(role, false)
    }
    return true
  }
  return false
}

export function updateMemberAdminStatus(memberId: string, isAdmin: boolean): boolean {
  const member = members.find((m) => m.id === memberId)
  if (member) {
    member.isAdmin = isAdmin
    // Update permissions when admin status changes
    member.customPermissions = getDefaultPermissions(member.role, isAdmin)
    return true
  }
  return false
}

export function updateMemberPermissions(memberId: string, permissions: Partial<CustomPermissions>): boolean {
  const member = members.find((m) => m.id === memberId)
  if (member) {
    member.customPermissions = {
      ...member.customPermissions,
      ...permissions,
    } as CustomPermissions
    return true
  }
  return false
}

export function createMember(memberData: Omit<Member, "id">): Member {
  const newMember: Member = {
    ...memberData,
    id: Date.now().toString(), // Simple ID generation
    customPermissions:
      memberData.customPermissions || getDefaultPermissions(memberData.role, memberData.isAdmin || false),
  }
  members.push(newMember)
  return newMember
}

export function getAllMembers(): Member[] {
  return members
}
