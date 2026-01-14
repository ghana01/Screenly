"use client"

import { useState, useContext } from 'react'
import { 
    User, 
    Bell, 
    Shield, 
    Palette, 
    Globe, 
    Key, 
    Mail, 
    Building2, 
    Users, 
    Mic, 
    Volume2,
    Moon,
    Sun,
    Smartphone,
    Trash2,
    Download,
    ChevronRight,
    Save,
    Camera,
    Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { UserDetailContext } from '@/context/UserDetailContext'
import Image from 'next/image'

const SettingsPage = () => {
    const { userDetail } = useContext(UserDetailContext)
    const [activeTab, setActiveTab] = useState('profile')
    const [isSaving, setIsSaving] = useState(false)
    
    // Profile settings
    const [profile, setProfile] = useState({
        name: userDetail?.name || 'John Doe',
        email: userDetail?.email || 'john@company.com',
        company: 'TechCorp Inc.',
        role: 'HR Manager',
        phone: '+1 (555) 123-4567',
        timezone: 'America/New_York'
    })

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        interviewCompleted: true,
        candidateApplied: true,
        weeklyReport: true,
        pushNotifications: false,
        smsNotifications: false
    })

    // Interview settings
    const [interviewSettings, setInterviewSettings] = useState({
        defaultDuration: '30',
        defaultVoice: 'jennifer',
        autoTranscribe: true,
        autoGenerateFeedback: true,
        sendCandidateReminder: true,
        reminderHours: '24'
    })

    // Appearance settings
    const [appearance, setAppearance] = useState({
        theme: 'light',
        compactMode: false,
        showAvatars: true
    })

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'company', name: 'Company', icon: Building2 },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'interview', name: 'Interview Settings', icon: Mic },
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'integrations', name: 'Integrations', icon: Globe }
    ]

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        toast.success('Settings saved successfully!')
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                            <p className="text-gray-500 text-sm mb-6">Update your personal information and profile picture.</p>
                        </div>
                        
                        {/* Profile Picture */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {profile.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{profile.name}</h4>
                                <p className="text-sm text-gray-500">{profile.role} at {profile.company}</p>
                                <Button variant="outline" size="sm" className="mt-2">
                                    Change Photo
                                </Button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <Input 
                                    value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <Input 
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <Input 
                                    value={profile.phone}
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    value={profile.timezone}
                                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                                >
                                    <option value="America/New_York">Eastern Time (ET)</option>
                                    <option value="America/Chicago">Central Time (CT)</option>
                                    <option value="America/Denver">Mountain Time (MT)</option>
                                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                    <option value="Europe/London">London (GMT)</option>
                                    <option value="Asia/Kolkata">India (IST)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 'company':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Settings</h3>
                            <p className="text-gray-500 text-sm mb-6">Manage your company profile and team settings.</p>
                        </div>

                        {/* Company Info */}
                        <div className="p-6 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-white rounded-xl border flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">TechCorp Inc.</h4>
                                    <p className="text-sm text-gray-500">Technology • 50-200 employees</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <Input defaultValue="TechCorp Inc." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                                    <select className="w-full px-3 py-2 border rounded-lg">
                                        <option>Technology</option>
                                        <option>Healthcare</option>
                                        <option>Finance</option>
                                        <option>Education</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                                    <select className="w-full px-3 py-2 border rounded-lg">
                                        <option>1-10</option>
                                        <option>11-50</option>
                                        <option selected>50-200</option>
                                        <option>200-500</option>
                                        <option>500+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                    <Input defaultValue="https://techcorp.com" />
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-gray-900">Team Members</h4>
                                <Button variant="outline" size="sm">
                                    <Users className="w-4 h-4 mr-2" />
                                    Invite Member
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'John Doe', email: 'john@company.com', role: 'Admin', avatar: 'JD' },
                                    { name: 'Sarah Smith', email: 'sarah@company.com', role: 'Recruiter', avatar: 'SS' },
                                    { name: 'Mike Johnson', email: 'mike@company.com', role: 'Interviewer', avatar: 'MJ' },
                                ].map((member, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {member.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                            <p className="text-gray-500 text-sm mb-6">Choose how you want to be notified about activity.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                                { key: 'interviewCompleted', label: 'Interview Completed', desc: 'Get notified when a candidate completes an interview', icon: Check },
                                { key: 'candidateApplied', label: 'New Candidate Applied', desc: 'Get notified when someone starts an interview', icon: Users },
                                { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly summary of all interviews', icon: Bell },
                                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your browser', icon: Smartphone },
                                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get text messages for important updates', icon: Smartphone },
                            ].map((item) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer"
                                                checked={notifications[item.key]}
                                                onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )

            case 'interview':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Settings</h3>
                            <p className="text-gray-500 text-sm mb-6">Configure default settings for AI interviews.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Default Interview Duration</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={interviewSettings.defaultDuration}
                                    onChange={(e) => setInterviewSettings({...interviewSettings, defaultDuration: e.target.value})}
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">AI Voice</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={interviewSettings.defaultVoice}
                                    onChange={(e) => setInterviewSettings({...interviewSettings, defaultVoice: e.target.value})}
                                >
                                    <option value="jennifer">Jennifer (Female, US)</option>
                                    <option value="michael">Michael (Male, US)</option>
                                    <option value="emma">Emma (Female, UK)</option>
                                    <option value="james">James (Male, UK)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Before Interview</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={interviewSettings.reminderHours}
                                    onChange={(e) => setInterviewSettings({...interviewSettings, reminderHours: e.target.value})}
                                >
                                    <option value="1">1 hour before</option>
                                    <option value="2">2 hours before</option>
                                    <option value="24">24 hours before</option>
                                    <option value="48">48 hours before</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            {[
                                { key: 'autoTranscribe', label: 'Auto Transcribe', desc: 'Automatically transcribe all interview conversations' },
                                { key: 'autoGenerateFeedback', label: 'Auto Generate Feedback', desc: 'Automatically generate AI feedback after interviews' },
                                { key: 'sendCandidateReminder', label: 'Send Candidate Reminders', desc: 'Send email reminders to candidates before their interview' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={interviewSettings[item.key]}
                                            onChange={(e) => setInterviewSettings({...interviewSettings, [item.key]: e.target.checked})}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Voice Test */}
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Volume2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">Test AI Voice</h4>
                                    <p className="text-sm text-gray-600">Preview the selected AI voice for interviews</p>
                                </div>
                                <Button onClick={() => {
                                    const utterance = new SpeechSynthesisUtterance("Hello! I'm your AI interviewer. How are you today?")
                                    window.speechSynthesis.speak(utterance)
                                    toast.success('Playing voice sample...')
                                }}>
                                    <Mic className="w-4 h-4 mr-2" />
                                    Test Voice
                                </Button>
                            </div>
                        </div>
                    </div>
                )

            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                            <p className="text-gray-500 text-sm mb-6">Customize how the app looks and feels.</p>
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'light', name: 'Light', icon: Sun },
                                    { id: 'dark', name: 'Dark', icon: Moon },
                                    { id: 'system', name: 'System', icon: Smartphone }
                                ].map((theme) => {
                                    const Icon = theme.icon
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => setAppearance({...appearance, theme: theme.id})}
                                            className={`p-4 border rounded-xl text-center transition-all ${
                                                appearance.theme === theme.id 
                                                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <Icon className={`w-6 h-6 mx-auto mb-2 ${
                                                appearance.theme === theme.id ? 'text-purple-600' : 'text-gray-400'
                                            }`} />
                                            <span className={`text-sm font-medium ${
                                                appearance.theme === theme.id ? 'text-purple-600' : 'text-gray-700'
                                            }`}>
                                                {theme.name}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { key: 'compactMode', label: 'Compact Mode', desc: 'Use a more compact layout with less spacing' },
                                { key: 'showAvatars', label: 'Show Avatars', desc: 'Display profile pictures in lists and comments' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={appearance[item.key]}
                                            onChange={(e) => setAppearance({...appearance, [item.key]: e.target.checked})}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 'security':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                            <p className="text-gray-500 text-sm mb-6">Manage your account security and password.</p>
                        </div>

                        {/* Change Password */}
                        <div className="p-6 bg-white border rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5" />
                                Change Password
                            </h4>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                                <Button onClick={() => toast.success('Password updated! (Demo)')}>
                                    Update Password
                                </Button>
                            </div>
                        </div>

                        {/* Two-Factor Auth */}
                        <div className="p-6 bg-white border rounded-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Shield className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => toast.info('2FA setup - Demo mode')}>
                                    Enable
                                </Button>
                            </div>
                        </div>

                        {/* Active Sessions */}
                        <div className="p-6 bg-white border rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-4">Active Sessions</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Smartphone className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Windows • Chrome</p>
                                            <p className="text-xs text-gray-500">Current session • New York, US</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-600 font-medium">Active now</span>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                            <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Danger Zone
                            </h4>
                            <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back.</p>
                            <Button variant="destructive" onClick={() => toast.error('Account deletion - Demo mode')}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                )

            case 'integrations':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
                            <p className="text-gray-500 text-sm mb-6">Connect with your favorite tools and services.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Slack', desc: 'Get notifications in Slack', connected: true, color: 'bg-purple-100', icon: '💬' },
                                { name: 'Google Calendar', desc: 'Sync interview schedules', connected: true, color: 'bg-blue-100', icon: '📅' },
                                { name: 'Greenhouse', desc: 'Import candidates from ATS', connected: false, color: 'bg-green-100', icon: '🌱' },
                                { name: 'Lever', desc: 'Sync with Lever ATS', connected: false, color: 'bg-orange-100', icon: '🔧' },
                                { name: 'Workday', desc: 'Connect to Workday HCM', connected: false, color: 'bg-indigo-100', icon: '💼' },
                                { name: 'Zapier', desc: 'Connect to 5000+ apps', connected: false, color: 'bg-orange-100', icon: '⚡' },
                            ].map((integration) => (
                                <div key={integration.name} className="p-4 bg-white border rounded-xl hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center text-xl`}>
                                                {integration.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{integration.name}</p>
                                                <p className="text-sm text-gray-500">{integration.desc}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            variant={integration.connected ? 'outline' : 'default'}
                                            size="sm"
                                            onClick={() => toast.info(`${integration.name} - Demo mode`)}
                                        >
                                            {integration.connected ? 'Connected' : 'Connect'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* API Key */}
                        <div className="p-6 bg-gray-50 rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <Key className="w-5 h-5" />
                                API Key
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">Use this key to integrate with our API.</p>
                            <div className="flex gap-2">
                                <Input 
                                    type="password" 
                                    value="sk-ai-interview-xxxxxxxxxxxxxxxx" 
                                    readOnly 
                                    className="font-mono"
                                />
                                <Button variant="outline" onClick={() => {
                                    navigator.clipboard.writeText('sk-ai-interview-xxxxxxxxxxxxxxxx')
                                    toast.success('API key copied!')
                                }}>
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account and application preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-purple-100 text-purple-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.name}
                                    {activeTab === tab.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl border p-6">
                    {renderTabContent()}
                    
                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
