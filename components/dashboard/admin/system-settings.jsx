"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Globe, Bell, CreditCard, Shield } from "lucide-react"

// Mock system settings
const initialSettings = {
  general: {
    siteName: "BarberBook",
    siteDescription: "Professional barber booking platform",
    contactEmail: "admin@barberbook.com",
    supportPhone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",
  },
  booking: {
    maxAdvanceBooking: 30,
    minAdvanceBooking: 1,
    defaultBookingDuration: 30,
    allowCancellation: true,
    cancellationWindow: 24,
    requireApproval: false,
    instantBooking: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    reminderTime: 24,
    marketingEmails: false,
  },
  payments: {
    stripeEnabled: true,
    paypalEnabled: false,
    cashPayments: true,
    processingFee: 2.9,
    currency: "USD",
    refundPolicy: "Refunds processed within 24 hours of cancellation",
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPassword: true,
    loginAttempts: 5,
    accountLockout: 15,
  },
}

export function SystemSettings() {
  const [settings, setSettings] = useState(initialSettings)
  const [activeTab, setActiveTab] = useState("general")

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    console.log("[v0] Saving system settings:", settings)
    // TODO: Implement settings save logic
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) => handleSettingChange("general", "supportPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Booking Settings
              </CardTitle>
              <CardDescription>Configure booking rules and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAdvanceBooking">Max Advance Booking (days)</Label>
                    <Input
                      id="maxAdvanceBooking"
                      type="number"
                      value={settings.booking.maxAdvanceBooking}
                      onChange={(e) =>
                        handleSettingChange("booking", "maxAdvanceBooking", Number.parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minAdvanceBooking">Min Advance Booking (hours)</Label>
                    <Input
                      id="minAdvanceBooking"
                      type="number"
                      value={settings.booking.minAdvanceBooking}
                      onChange={(e) =>
                        handleSettingChange("booking", "minAdvanceBooking", Number.parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                    <Input
                      id="cancellationWindow"
                      type="number"
                      value={settings.booking.cancellationWindow}
                      onChange={(e) =>
                        handleSettingChange("booking", "cancellationWindow", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Cancellations</Label>
                      <p className="text-sm text-muted-foreground">Let customers cancel bookings</p>
                    </div>
                    <Switch
                      checked={settings.booking.allowCancellation}
                      onCheckedChange={(checked) => handleSettingChange("booking", "allowCancellation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Approval</Label>
                      <p className="text-sm text-muted-foreground">Barbers must approve bookings</p>
                    </div>
                    <Switch
                      checked={settings.booking.requireApproval}
                      onCheckedChange={(checked) => handleSettingChange("booking", "requireApproval", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Instant Booking</Label>
                      <p className="text-sm text-muted-foreground">Allow immediate confirmations</p>
                    </div>
                    <Switch
                      checked={settings.booking.instantBooking}
                      onCheckedChange={(checked) => handleSettingChange("booking", "instantBooking", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send booking confirmations via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send booking reminders via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Booking Reminders</Label>
                    <p className="text-sm text-muted-foreground">Automatic appointment reminders</p>
                  </div>
                  <Switch
                    checked={settings.notifications.bookingReminders}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "bookingReminders", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Reminder Time (hours before)</Label>
                <Input
                  id="reminderTime"
                  type="number"
                  value={settings.notifications.reminderTime}
                  onChange={(e) =>
                    handleSettingChange("notifications", "reminderTime", Number.parseInt(e.target.value))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Settings
              </CardTitle>
              <CardDescription>Configure payment methods and processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Stripe Integration</Label>
                    <p className="text-sm text-muted-foreground">Accept credit/debit cards</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                    <Switch
                      checked={settings.payments.stripeEnabled}
                      onCheckedChange={(checked) => handleSettingChange("payments", "stripeEnabled", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>PayPal Integration</Label>
                    <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                  </div>
                  <Switch
                    checked={settings.payments.paypalEnabled}
                    onCheckedChange={(checked) => handleSettingChange("payments", "paypalEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow pay-at-location</p>
                  </div>
                  <Switch
                    checked={settings.payments.cashPayments}
                    onCheckedChange={(checked) => handleSettingChange("payments", "cashPayments", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    step="0.1"
                    value={settings.payments.processingFee}
                    onChange={(e) =>
                      handleSettingChange("payments", "processingFee", Number.parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.payments.currency}
                    onChange={(e) => handleSettingChange("payments", "currency", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("security", "twoFactorAuth", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Strong Password Policy</Label>
                    <p className="text-sm text-muted-foreground">Enforce complex passwords</p>
                  </div>
                  <Switch
                    checked={settings.security.requireStrongPassword}
                    onCheckedChange={(checked) => handleSettingChange("security", "requireStrongPassword", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) =>
                      handleSettingChange("security", "passwordMinLength", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => handleSettingChange("security", "loginAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
    </div>
  )
}
