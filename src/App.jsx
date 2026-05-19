import { useState } from 'react'
import LessonPage from './components/LessonPage'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="logo">DevNodo<span className="logo-accent">Learn</span></span>
          <nav className="breadcrumb">
            <span>Python</span>
            <span className="sep">/</span>
            <span className="current">Lección 1: Variables y Tipos</span>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <LessonPage />
      </main>
    </div>
  )
}
