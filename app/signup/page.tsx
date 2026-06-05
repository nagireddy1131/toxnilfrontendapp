"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Mail, CheckCircle } from "lucide-react"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
    const router = useRouter()
    const { uploadCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [otpStep, setOtpStep] = useState(false)
    const [otp, setOtp] = useState("")
    const [timer, setTimer] = useState(0)
    const { toast } = useToast()

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.username.trim()) newErrors.username = "Name is required"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validate()) return
        setIsLoading(true)
        try {
            await api.post('/users/send-otp', { email: formData.email, type: 'signup' })
            toast({ title: "OTP Sent!", description: "Please check your email for the verification code." })
            setOtpStep(true)
            setTimer(60)
        } catch (error: any) {
            setErrors({ form: error.response?.data?.message || "Failed to send OTP" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const { data } = await api.post('/users/google', { credential: credentialResponse.credential })
            
            const sessionData = { ...data, loginTime: Date.now() }
            localStorage.setItem('userInfo', JSON.stringify(sessionData))
            
            if (data.isAdmin) {
                localStorage.setItem('adminInfo', JSON.stringify(sessionData))
                toast({ title: "Admin Login Successful" })
                router.push("/admin")
            } else {
                toast({ title: "Login Successful" })
                await uploadCart()
                router.push("/account")
            }
        } catch (error: any) {
            toast({
                title: "Google Login Failed",
                description: error.response?.data?.message || "Authentication failed",
                variant: "destructive",
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp) return setErrors({ otp: "Please enter the OTP" })

        try {
            const { data } = await api.post('/users', {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                otp: otp
            })

            localStorage.setItem("userInfo", JSON.stringify(data))

            // Also keep toxnil_user for backward compatibility/other components if any (optional but safer based on previous code)
            localStorage.setItem("toxnil_user", JSON.stringify({
                name: data.name,
                phone: data.phone,
                email: data.email || "",
                memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
                loyaltyPoints: 0,
                tier: "Bronze Member"
            }))

            await uploadCart() // Upload local cart to new account

            toast({ title: "Account created successfully!" })
            router.push("/")
        } catch (error: any) {
            setErrors({ otp: error.response?.data?.message || "Registration failed" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
        <div className="min-h-screen bg-[#F5F3F0] flex flex-col">
            <SiteHeader />

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-[#1a4d3e]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-[#1a4d3e] font-playfair">Create an account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your details below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errors.form && <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded">{errors.form}</div>}
                        
                        {!otpStep ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Full Name</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={errors.username ? "border-red-500" : ""}
                                />
                                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? "border-red-500 pl-10" : "pl-10"}
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                            </div>

                            <Button type="submit" className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                            
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        toast({ title: "Google Login Failed", variant: "destructive" })
                                    }}
                                    useOneTap
                                />
                            </div>
                        </form>
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-emerald-700" />
                                </div>
                                <p className="text-sm text-gray-600">We've sent a 6-digit code to</p>
                                <p className="font-semibold text-gray-900">{formData.email}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter Verification Code</Label>
                                <Input
                                    id="otp"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value)
                                        if (errors.otp) setErrors({ ...errors, otp: "" })
                                    }}
                                    className={errors.otp ? "border-red-500 text-center tracking-widest text-lg" : "text-center tracking-widest text-lg"}
                                    maxLength={6}
                                />
                                {errors.otp && <p className="text-xs text-red-500 text-center">{errors.otp}</p>}
                            </div>
                            <Button type="submit" className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={isLoading || otp.length < 6}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Create Account"}
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
                                    setOtpStep(false)
                                    setTimer(0)
                                    setOtp("")
                                }}>
                                    Back to details
                                </Button>
                            </div>
                        </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <div className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#1a4d3e] hover:underline font-medium">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
        </GoogleOAuthProvider>
    )
}
