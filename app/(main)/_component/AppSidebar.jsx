"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, LogOut } from "lucide-react"
import { SideBarOption } from "@/services/Constants"
import Link from "next/link"
import { supabase } from "@/services/supabaseClient"
import { useRouter, usePathname } from "next/navigation"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { open } = useSidebar()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth')
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      {/* Header with Logo */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-center">
          <Image 
            src={'/logo.png'} 
            alt='logo' 
            width={150} 
            height={50} 
            className={open ? "w-[130px]" : "w-[40px]"}
          />
        </div>
        <Link href="/dashboard/create-interview" className="w-full mt-4">
          <Button className='w-full bg-primary hover:bg-primary/90'>
            <Plus className="h-4 w-4 mr-2" /> 
            {open && "Create Interview"}
          </Button>
        </Link>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOption.map((option, index) => {
              const Icon = option.icon;
              const isActive = pathname === option.link || pathname.startsWith(option.link + '/');
              
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={option.name}
                  >
                    <Link
                      href={option.link}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{option.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {open && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}