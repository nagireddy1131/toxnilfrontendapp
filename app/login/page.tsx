"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { useCart } from "@/components/cart-provider"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { syncCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Redirect already-logged-in users
    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            try {
                const u = JSON.parse(userInfo)
                router.replace(u.isAdmin ? "/admin" : "/account")
            } catch { }
        }
    }, [])

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    })

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

        if (!formData.identifier.trim()) {
            newErrors.identifier = "Username or Phone is required"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // import api from "@/lib/api" // Need to add import at top

    // ... inside component ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setIsLoading(true)

        try {
            const { data } = await api.post('/users/login', { email: formData.identifier.trim(), password: formData.password })
            
            // Set session timestamp
            const sessionData = {
                ...data,
                loginTime: Date.now()
            }
            
            localStorage.setItem('userInfo', JSON.stringify(sessionData))
            
            if (data.isAdmin) {
                // Admin session data (separate key or same key, let's use both for clarity or just userInfo)
                localStorage.setItem('adminInfo', JSON.stringify(sessionData))
                toast({
                    title: "Admin Login Successful",
                    description: `Welcome to the Admin Portal, ${data.name}`,
                })
                router.push("/admin")
            } else {
                toast({
                    title: "Login Successful",
                    description: `Welcome back, ${data.name}`,
                })
                await syncCart()
                router.push("/account")
            }
            
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.response?.data?.message || "Invalid credentials",
                variant: "destructive",
            })
            setErrors({ form: error.response?.data?.message || "Login failed" })
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
                await syncCart()
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

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
        <div className="min-h-screen bg-[#F5F3F0] flex flex-col">
            <SiteHeader />

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-[#1a4d3e]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-[#1a4d3e] font-playfair">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="identifier">Email Address</Label>
                                <div className="relative">
                                    <Input
                                        id="identifier"
                                        name="identifier"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.identifier}
                                        onChange={handleChange}
                                        className={errors.identifier ? "border-red-500 pl-10" : "pl-10"}
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                                {errors.identifier && <p className="text-xs text-red-500">{errors.identifier}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" className="text-xs text-[#1a4d3e] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
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

                            <Button type="submit" className="w-full bg-[#1a4d3e] hover:bg-[#2d6a5a]" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
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
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <div className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-[#1a4d3e] hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
        </GoogleOAuthProvider>
    )
}
