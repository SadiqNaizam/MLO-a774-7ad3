import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import NavigationMenu from '@/components/layout/NavigationMenu';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import KYCStepper from '@/components/KYCStepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, Lock, Bell, Settings as SettingsIcon, ShieldCheck, FileText } from 'lucide-react';

// Profile Form Schema
const profileFormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password Form Schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters."),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;


const AccountPage = () => {
  console.log('AccountPage loaded');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { fullName: "John Doe", email: "john.doe@example.com", phoneNumber: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log("Profile update data:", data);
    // Mock API call
  };
  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log("Password change data:", data);
    // Mock API call
  };
  
  const handleKYCSubmit = async (data: any) => {
    console.log('KYC data submitted:', data);
    // Mock API call for KYC
    return new Promise<{ success: boolean; message?: string }>((resolve) => setTimeout(() => {
        // Simulate success or failure
        const success = Math.random() > 0.2; // 80% chance of success
        if (success) {
            resolve({ success: true, message: "KYC documents submitted successfully." });
        } else {
            resolve({ success: false, message: "Failed to process KYC documents. Please try again or contact support." });
        }
    }, 2000));
  };
  
  const handleToggleMobileNav = () => {
    console.log("Toggle mobile navigation");
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <NavigationMenu />
      <div className="flex flex-col flex-1">
        <Header onToggleMobileNav={handleToggleMobileNav} />
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
              <TabsTrigger value="profile"><User className="mr-2 h-4 w-4 inline-block"/>Profile</TabsTrigger>
              <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4 inline-block"/>Security</TabsTrigger>
              <TabsTrigger value="kyc"><ShieldCheck className="mr-2 h-4 w-4 inline-block"/>Verification (KYC)</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 inline-block"/>Notifications</TabsTrigger>
              <TabsTrigger value="app-settings"><SettingsIcon className="mr-2 h-4 w-4 inline-block"/>Preferences</TabsTrigger>
              <TabsTrigger value="legal"><FileText className="mr-2 h-4 w-4 inline-block"/>Legal</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={profileForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormDescription>This email is used for login and notifications.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={profileForm.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl><Input type="tel" {...field} placeholder="+1 234 567 8900" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                            <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                            <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                            <Button type="submit">Update Password</Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                        <CardDescription>Enhance your account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                                <p className="font-medium">Authenticator App</p>
                                <p className="text-sm text-muted-foreground">Recommended for highest security.</p>
                            </div>
                            <Button variant="outline">Set Up</Button>
                        </div>
                         <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                                <p className="font-medium">SMS Verification</p>
                                <p className="text-sm text-muted-foreground">Receive codes via text message.</p>
                            </div>
                            <Switch id="sms-2fa" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>Manage API keys for third-party services.</CardDescription></CardHeader>
                  <CardContent>
                    <Button>Create New API Key</Button>
                    {/* Placeholder for API key list */}
                    <p className="mt-4 text-sm text-muted-foreground">No API keys configured yet.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="kyc">
              <KYCStepper userId="user-placeholder-123" onKYCSubmit={handleKYCSubmit} currentKycStatus="personalInfo" />
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                            <FormLabel className="font-medium">Email Notifications</FormLabel>
                            <FormDescription>Receive updates about your account, trades, and market news.</FormDescription>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                            <FormLabel className="font-medium">Push Notifications</FormLabel>
                            <FormDescription>Get real-time alerts on your mobile device.</FormDescription>
                        </div>
                        <Switch id="push-notifications" />
                    </div>
                     <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                            <FormLabel className="font-medium">Price Alerts</FormLabel>
                            <FormDescription>Notify me when assets reach specific price points.</FormDescription>
                        </div>
                        <Switch id="price-alerts" defaultChecked />
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="app-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Customize your app experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                            <FormLabel className="font-medium">Theme</FormLabel>
                            <FormDescription>Choose between light and dark mode.</FormDescription>
                        </div>
                        {/* Placeholder for theme toggle - actual implementation complex */}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Light</Button>
                            <Button variant="secondary" size="sm">Dark</Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                            <FormLabel className="font-medium">Language</FormLabel>
                            <FormDescription>Select your preferred language.</FormDescription>
                        </div>
                        <p className="text-sm font-medium">English (US)</p> {/* Placeholder */}
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal">
                <Card>
                    <CardHeader>
                        <CardTitle>Legal & Support</CardTitle>
                        <CardDescription>Access important documents and help resources.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Terms of Service</AccordionTrigger>
                                <AccordionContent>
                                Placeholder for Terms of Service content. Lorem ipsum dolor sit amet...
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Privacy Policy</AccordionTrigger>
                                <AccordionContent>
                                Placeholder for Privacy Policy content. Lorem ipsum dolor sit amet...
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>FAQ & Help Center</AccordionTrigger>
                                <AccordionContent>
                                <p>Have questions? Visit our <Button variant="link" className="p-0 h-auto">Help Center</Button> or <Button variant="link" className="p-0 h-auto">Contact Support</Button>.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;