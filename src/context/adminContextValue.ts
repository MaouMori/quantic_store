import { createContext } from 'react'
import type { AdminContextType } from './AdminContext'

export const AdminContext = createContext<AdminContextType | undefined>(undefined)
