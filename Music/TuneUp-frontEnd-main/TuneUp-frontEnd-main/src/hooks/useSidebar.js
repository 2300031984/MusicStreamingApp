"use client"

import { useState } from "react"

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return { isOpen, toggleSidebar }
}

