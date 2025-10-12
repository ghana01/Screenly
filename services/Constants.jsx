import { Code2Icon } from "lucide-react"
import { UserX2Icon } from "lucide-react"
import { BriefcaseIcon } from "lucide-react"
import { LightbulbIcon } from "lucide-react"
import { UsersIcon } from "lucide-react"
import {
  LayoutDashboard,
  Calendar1,
  List,
  CreditCard,
  Settings,
} from "lucide-react";

export const SideBarOption = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Schedule Interview",
    link: "/schedule-interview",
    icon: Calendar1,
  },
  {
    name: "All Interview",
    link: "/interview",
    icon: List,
  },
  {
    name: "Billing",
    link: "/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    link: "/setting",
    icon: Settings,
  },
];


export const InterviewType =[
    {
        title :'Technical',
        icon:Code2Icon
    },
    {
        title:"Behavioral",
        icon:UserX2Icon
    },
    {
        title:'Experience',
        icon:BriefcaseIcon
    },
    {
        title:"Problem Solving",
        icon:LightbulbIcon
    },
    {
        title:"LeaderShip",
        icon:UsersIcon
    }

]