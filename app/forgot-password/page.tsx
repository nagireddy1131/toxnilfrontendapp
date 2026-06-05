"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Mail, KeyRound, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
    
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setError("Please enter a valid email address")
        }
        
        setIsLoading(true)
        setError("")
        try {
            await api.post('/users/send-otp', { email, type: 'forgot_password' })
            toast({ title: "OTP Sent!", description: "Check your email for the reset code." })
            setStep(2)
            setTimer(60)
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length < 6) return setError("Please enter a valid 6-digit OTP")
        setError("")
        setStep(3)
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 8) return setError("Password must be at least 8 characters")
        if (password !== confirmPassword) return setError("Passwords do not match")
        
        setIsLoading(true)
        setError("")
        try {
            await api.post('/users/reset-password', {
                email,
                otp,
                newPassword: password
            })
            toast({ title: "Password Reset Successful", description: "You can now log in with your new password." })
            router.push("/login")
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F3F0] flex flex-col">
            <SiteHeader />

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-[#1a4d3e]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-[#1a4d3e] font-playfair">
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Reset Password"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {step === 1 && "Enter your email to receive a reset code"}
                            {step === 2 && `We sent a code to ${email}`}
                            {step === 3 && "Enter your new password below"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded">{error}</div>}
                        
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError("") }}
                                            className={error ? "border-red-500 pl-10" : "pl-10"}
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Code"}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Enter 6-Digit Code</Label>
                                    <Input
                                        id="otp"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value); setError("") }}
                                        className="text-center tracking-widest text-lg"
                                        maxLength={6}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={otp.length < 6}>
                                    Verify Code
                                </Button>
                                
                                <div className="flex justify-between items-center px-1 mt-4">
                                    <Button 
                                        type="button" 
                                        variant="link" 
                                        className="p-0 h-auto text-sm text-[#1a4d3e]"
                                        disabled={timer > 0 || isLoading}
                                        onClick={() => handleSendOtp()}
                                    >
                                        {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                                    </Button>
                                    <Button type="button" variant="link" className="p-0 h-auto text-sm text-gray-500" onClick={() => {
                                        setStep(1)
                                        setTimer(0)
                                        setOtp("")
                                    }}>
                                        Change Email
                                    </Button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError("") }}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError("") }}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <div className="text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link href="/login" className="text-[#1a4d3e] hover:underline font-medium">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
