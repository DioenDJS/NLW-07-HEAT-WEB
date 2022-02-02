import { useState } from 'react'
import styles from './App.module.scss';
import { LoginBox } from './components/LoginBox';

export function App() {

  return (
    <main className={styles.contentWrapper}>
      <LoginBox />
    </main>
  )
}

