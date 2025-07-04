"use client"

import type React from "react"

import { useState } from "react"

interface Theme {
    background: string
    color: string
    primaryColor: string
}

const themes: Theme[] = [
    {
        background: "#1A1A2E",
        color: "#FFFFFF",
        primaryColor: "#0F3460",
    },
    {
        background: "#461220",
        color: "#FFFFFF",
        primaryColor: "#E94560",
    },
    {
        background: "#192A51",
        color: "#FFFFFF",
        primaryColor: "#967AA1",
    },
    {
        background: "#F7B267",
        color: "#000000",
        primaryColor: "#F4845F",
    },
    {
        background: "#F25F5C",
        color: "#000000",
        primaryColor: "#642B36",
    },
    {
        background: "#231F20",
        color: "#FFF",
        primaryColor: "#BB4430",
    },
]

const LoginForm = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [currentTheme, setCurrentTheme] = useState(themes[0])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Login attempt:", { username, password })
    }

    const handleThemeChange = (theme: Theme) => {
        setCurrentTheme(theme)
    }

    return (
        <div
            className="h-screen w-screen flex justify-center items-center font-['Poppins'] transition-all duration-200 ease-in-out"
            style={{
                background: currentTheme.background,
                color: currentTheme.color,
                letterSpacing: "1px",
            }}
        >
            <div className="relative" style={{ width: "22.2rem" }}>
                {/* Circle One */}
                <div
                    className="absolute w-32 h-32 rounded-full z-10"
                    style={{
                        background: currentTheme.primaryColor,
                        top: 0,
                        left: 0,
                        transform: "translate(-45%, -45%)",
                    }}
                />

                {/* Form Container */}
                <div
                    className="relative z-10 p-8 rounded-lg"
                    style={{
                        border: "1px solid hsla(0, 0%, 65%, 0.158)",
                        boxShadow: "0 0 36px 1px rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                    }}
                >
                    <h1 className="text-4xl text-center mb-8 opacity-60" style={{ fontSize: "2.5rem" }}>
                        LOGIN
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="USERNAME"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full p-3.5 my-8 rounded-md outline-none font-medium transition-all duration-300 ease-in focus:animate-pulse"
                            style={{
                                color: currentTheme.color,
                                backgroundColor: "#9191911f",
                                border: "none",
                                letterSpacing: "0.8px",
                                fontSize: "15px",
                                backdropFilter: "blur(15px)",
                                WebkitBackdropFilter: "blur(15px)",
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 16px 1px rgba(0, 0, 0, 0.2)"
                                e.target.style.animation = "wobble 0.3s ease-in"
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none"
                                e.target.style.animation = "none"
                            }}
                            required
                        />

                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full p-3.5 my-8 rounded-md outline-none font-medium transition-all duration-300 ease-in focus:animate-pulse"
                            style={{
                                color: currentTheme.color,
                                backgroundColor: "#9191911f",
                                border: "none",
                                letterSpacing: "0.8px",
                                fontSize: "15px",
                                backdropFilter: "blur(15px)",
                                WebkitBackdropFilter: "blur(15px)",
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 16px 1px rgba(0, 0, 0, 0.2)"
                                e.target.style.animation = "wobble 0.3s ease-in"
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none"
                                e.target.style.animation = "none"
                            }}
                            required
                        />

                        <button
                            type="submit"
                            className="block w-full p-3 rounded-md outline-none font-bold cursor-pointer mb-8 opacity-60 transition-all duration-100 ease-in-out hover:scale-105"
                            style={{
                                backgroundColor: currentTheme.primaryColor,
                                color: currentTheme.color,
                                fontSize: "18px",
                                letterSpacing: "1.5px",
                                border: "none",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 0 10px 1px rgba(0, 0, 0, 0.15)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none"
                            }}
                        >
                            SUBMIT
                        </button>
                    </form>

                    <div className="flex justify-between my-4 opacity-60">
                        <button
                            type="button"
                            className="transition-opacity duration-200 hover:opacity-80"
                            style={{ color: currentTheme.color }}
                            onClick={() => console.log("Register clicked")}
                        >
                            REGISTER
                        </button>
                        <button
                            type="button"
                            className="transition-opacity duration-200 hover:opacity-80"
                            style={{ color: currentTheme.color }}
                            onClick={() => console.log("Forgot password clicked")}
                        >
                            FORGOT PASSWORD
                        </button>
                    </div>
                </div>

                {/* Circle Two */}
                <div
                    className="absolute w-32 h-32 rounded-full z-11"
                    style={{
                        background: currentTheme.primaryColor,
                        bottom: 0,
                        right: 0,
                        transform: "translate(45%, 45%)",
                    }}
                />
            </div>

            {/* Theme Buttons */}
            <div className="absolute left-0 bottom-8">
                <div className="flex flex-col gap-2">
                    {themes.map((theme, index) => (
                        <div
                            key={index}
                            className="w-6 h-6 cursor-pointer transition-all duration-300 ease-in hover:w-10"
                            style={{ background: theme.background }}
                            onClick={() => handleThemeChange(theme)}
                        />
                    ))}
                </div>
            </div>

            {/* Custom CSS for wobble animation */}
            <style >{`
        @keyframes wobble {
          0% {
            transform: scale(1.025);
          }
          25% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.025);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    )
}

export default LoginForm
