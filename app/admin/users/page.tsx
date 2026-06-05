"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get(`/users`)
        setUsers(data.users || data)
      } catch (e) {
        toast({ title: "Failed to load users", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-emerald-950">Users</h1>
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{u.name}</td>
                    <td className="py-3 px-4">{u.email || '-'}</td>
                    <td className="py-3 px-4">{u.phone}</td>
                    <td className="py-3 px-4">
                      {u.isAdmin ? <span className="text-emerald-600 font-semibold">Admin</span> : "User"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
