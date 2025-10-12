import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SideBarOption } from "@/services/Constants"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center  mt-3">
        <Image src={'/logo.png' } alt='logo' width={100} height={100} className="w-[150px]" />
        <Button className='w-full'>  <Plus/> Create a Interview</Button>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarContent>
                <SidebarMenu>
                   {SideBarOption.map((option, index) => {
        const Icon = option.icon; // ✅ icon is a component reference
        return (
          <Link
            key={index}
            href={option.link}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Icon className="w-5 h-5" />
            <span>{option.name}</span>
          </Link>
        );
      })}
                </SidebarMenu>
            </SidebarContent>
         </SidebarGroup> 
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}