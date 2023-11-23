import React, { useEffect, useState } from "react"

interface DarkModeProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export const DarkModeContext = React.createContext<DarkModeProps>({
  darkMode: false,
  toggleDarkMode: () => {},
})

export function useDarkMode() {
  return React.useContext(DarkModeContext)
}

export const DarkModeProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean | null>(true)

  // useEffect(() => {
  //   const storedMode = localStorage.getItem("dark_mode");
  //   if (storedMode) {
  //     setDarkMode(storedMode === "dark");
  //   }
  //   setDarkMode(window?.matchMedia("(prefers-color-scheme: dark)")?.matches);
  // }, []);

  const toggleDarkMode = () => {
    const mode = !darkMode
    setDarkMode(mode)
    localStorage.setItem("dark_mode", mode ? "dark" : "light")
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}
