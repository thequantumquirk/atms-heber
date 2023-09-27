
type part1 = string
type part2 = string
type part3 = string
type part4 = string
type part5 = string
type part6 = string
type part7 = string
type part8 = string
type part9 = string
type part10 = string
type MilestoneKey = part1 | part2 | part3 | part4 | part5 | part6 | part7 | part8 | part9 | part10;

export type MilestoneType = {
    [key in MilestoneKey]: boolean;
};