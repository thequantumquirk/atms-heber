import { Filter } from "@/types/filter"
import { TaskType } from "@/types/tasktype"

export const Principal:TaskType[] = [
        {
            to: "Dr K Rajkumar" , 
            role: "HOD",
            task: {
                name: "Submit report", 
                description: "Report on monthly academic achivements",
                deadline: "2024-03-12T12:30:00.000Z",
                milestones: {
                    "part1": true,
                    "part2": true,
                    "part3": true,
                    "part5": false
                },
            }
        },
        {
            to: "Dr Karthikeyan", 
            role: "Staff",
            task: {
                name: "Prepare budget report for conference", 
                description: "Budgeting for conference held on september",
                deadline: "2024-03-12T12:30:00.000Z",
                milestones: {
                    "Milestone-1": true,
                    "Milestone-2": true,
                    "Milestone-3": true,
                    "Milestone-5": true,
                    "Milestone-6": false
                },
            }
        },
        {
            to: "Mr Sobers Smiles David",
            role: "HOD", 
            task: {
                name: "Schedule and Manage department inaugration", 
                description: "Budgeting for conference held on september",
                deadline: "2024-03-12T12:30:00.000Z",
                milestones: {
                    "Milestone-1": true,
                    "Milestone-2": true,
                    "Milestone-3": true,
                    "Milestone-5": true,
                    "Milestone-6": false
                },
            }
        }
]


export const HOD :TaskType[]= [
    {
        to: "Dr Ramah Sivakumar" , 
        role: "Staff",
        task: {
            name: "Submit report", 
            description: "Report on monthly academic achivements",
            deadline: "2024-03-12T12:30:00.000Z",
            milestones: {
            "Milestone-1": true,
            "Milestone-2": true,
            "Milestone-3": true,
            "Milestone-4": true,
            "Milestone-5": true,
            "Milestone-6": false
            },
        }
    },
    {
        to: "Ms Bhuvaneshwari", 
        role: "Staff",
        task: {
            name: "Prepare budget report for conference", 
            description: "Budgeting for conference held on september",
            deadline: "2024-03-12T12:30:00.000Z",
            milestones: {
            "Milestone-1": true,
            "Milestone-2": true,
            "Milestone-3": true,
            "Milestone-5": true,
            "Milestone-6": false
        },
    }
},
{
    to: "Mr James Daniel", 
    role: "Staff",
    task: {
        name: "Schedule and Manage department inaugration", 
        description: "Budgeting for conference held on september",
        deadline: "2024-03-12T12:30:00.000Z",
        milestones: {
            "Milestone-1": true,
            "Milestone-2": true,
            "Milestone-3": true,
            "Milestone-5": true,
            "Milestone-6": false
        },
    }
}
]
export const Teacher :TaskType[]= [
    {
        to: "Abirami" , 
        role: "Student",
        task: {
            name: "Collect cash for lab manual", 
            description: "Collect 100 per student for the distribution of lab manual",
            deadline: "2024-03-12T12:30:00.000Z",
            milestones: {
                "Milestone-1": true,
                "Milestone-2": true,
                "Milestone-3": true,
                "Milestone-4": true,
                "Milestone-5": true,
                "Milestone-6": false
            },
        }
    },
    {
        to: "Rohan Britto", 
        role: "Student",
        task: {
            name: "IOT Workshop", 
            description: "Budgeting for conference held on september",
            deadline: "2024-03-12T12:30:00.000Z",
            milestones: {
            "Milestone-1": true,
            "Milestone-2": true,
            "Milestone-3": true,
            "Milestone-5": true,
            "Milestone-6": false
            },
        }
    },
    {
        to: "Ravi Shanker", 
        role: "Student",
        task: {
            name: "IOT Workshop", 
            description: "Budgeting for conference held on september",
            deadline: "2024-03-12T12:30:00.000Z",
            milestones: {
            "Milestone-1": true,
            "Milestone-2": true,
            "Milestone-3": true,
            "Milestone-5": true,
            "Milestone-6": false
            },
        }
    },
]

export const dashboardFliter:Filter[] = [
    {name: "Dr. Paul Dhayabaran", role: "Principal"}, 
    {name: "Dr K Rajkumar", role: "HOD"},
    {name: "Mr Sobers Smiles David", role: "HOD"},
    {name: "Mr James Daniel", role: "teacher"},
    {name: "Dr Karthikeyan", role: "teacher"},
    {name: "Dr Anuradha", role: "teacher"},
    {name: "Ms Bhuvaneshwari", role: "teacher"},
    {name: "Dr Ramah Sivakumar", role: "teacher"},
    {name: "Abirami", role: "Student"},
    {name: "Rohan Britto", role: "Student"}
]