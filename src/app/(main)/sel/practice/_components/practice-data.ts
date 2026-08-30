import { MessageSquare, ShieldAlert, HeartHandshake, Smile, Star, Users, Lightbulb, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Practice {
  id: number;
  title: string;
  type: string;
  xp: string;
  icon: LucideIcon;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prompt: string;
}

export interface DailyChallenge {
  id: number;
  badge: string;
  title: string;
  description: string;
  ageRange: string;
  emoji: string;
  color: string;
  href?: string;
}

export const practices: Practice[] = [
  {
    id: 1,
    title: "Scenario: Team Disagreement",
    type: "Roleplay Simulation",
    xp: "+150 XP",
    icon: MessageSquare,
    difficulty: "Intermediate",
    prompt: "A teammate rejects your proposal in a group project. Respond with constructive assertiveness.",
  },
  {
    id: 2,
    title: "Scenario: Supporting an Overwhelmed Peer",
    type: "Empathy Drill",
    xp: "+120 XP",
    icon: HeartHandshake,
    difficulty: "Beginner",
    prompt: "Recognize signs of burnout and offer psychological safety without unsolicited advice.",
  },
  {
    id: 3,
    title: "Scenario: Handling High Pressure Feedback",
    type: "Emotional Regulation",
    xp: "+200 XP",
    icon: ShieldAlert,
    difficulty: "Advanced",
    prompt: "Receive critical evaluation from a mentor and extract growth opportunities calmly.",
  },
];

export const kidChallenges: DailyChallenge[] = [
  {
    id: 1,
    badge: "🌟 Today's Challenge",
    title: "The Feelings Weather Report",
    description: "Describe how you feel right now like a weather report — sunny, stormy, cloudy? Share with a friend and listen to their weather too!",
    ageRange: "Ages 5–7",
    emoji: "🌤️",
    color: "from-yellow-400/20 via-orange-300/10 to-background",
    href: "/sel/practice/feelings-weather",
  },
  {
    id: 2,
    badge: "💡 Problem Solver",
    title: "Kindness Mission",
    description: "Think of one kind thing you can do for someone today — say something nice, help carry something, or draw them a picture. How did it make you feel?",
    ageRange: "Ages 6–9",
    emoji: "🤝",
    color: "from-pink-400/20 via-rose-300/10 to-background",
  },
  {
    id: 3,
    badge: "🏆 Team Builder",
    title: "Disagreement Detective",
    description: "Think of a time you disagreed with someone. What happened? Try to explain their side of the story — could you understand why they felt that way?",
    ageRange: "Ages 9–12",
    emoji: "🔍",
    color: "from-purple-400/20 via-violet-300/10 to-background",
  },
];
