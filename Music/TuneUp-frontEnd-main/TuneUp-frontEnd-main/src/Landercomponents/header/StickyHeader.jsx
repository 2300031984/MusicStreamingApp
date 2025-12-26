import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { css } from "@emotion/react"
import styles from "./TransparentHeader.module.css"
import { loginButtonStyles, signupButtonStyles } from "./buttonStyles"
import Logo from "../../components/Logo"
import {Link} from "react-router-dom"



const TransparentHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50) // Apply effect after 50px scroll
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}><Logo/></span>
        </div>
        <nav className={styles.nav}>
          <Link to="/login">
          <motion.button
            css={css`
              ${loginButtonStyles}
            `}
            className={`${styles.button} ${styles.loginButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          </Link>

          <Link to="/signup">
          <motion.button
            css={css`
              ${signupButtonStyles}
            `}
            className={`${styles.button} ${styles.signupButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default TransparentHeader
