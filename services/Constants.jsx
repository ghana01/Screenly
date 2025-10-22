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

export const QUESTIONS_PROMPT =`You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobPosition}}
Job Description:{{jobDescription}}
Interview Duration: {{ interviewDuration}}
Interview Type: {{interviewTypes}}

📋 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions dependent on interview duration.
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{interviewTypes}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
  question:"",
  InterviewType:'Technical/Behavioral/Experience/Problem Solving/Leadership'
},{
  ...
}]
🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobPosition}} role.`

export const FEEDBACK_PROMPT = `{{conversation}}
Depends on this Interview Conversation between assistant and user,
Give me feedback for user interview. Give me rating out of 10 for technical Skills,
Communication, Problem Solving, Experince. Also give me summery in 3 lines
about the interview and one line to let me know whether is recommanded
for hire or not with msg. Give me response in JSON format
{
  feedback:{
    rating:{
      techicalSkills:5,
      communication:6,
      problemSolving:4,
      experince:7
    },
    summery:<in 3 Line>,
    Recommendation:"",
    RecommendationMsg:""
  }
}`
