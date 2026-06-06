import {
  Globe,
  Heart,
  HeartHandshake,
  HandHeart,
  Handshake,
  BookOpen,
  TreePine,
  Home,
  Music,
  Trophy,
  Sun,
  Leaf,
  Star,
  Sparkles,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

const VALUE_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  globe: Globe,
  shield: Shield,
  "hand-heart": HandHeart,
  handshake: Handshake,
  "book-open": BookOpen,
  "tree-pine": TreePine,
  home: Home,
  music: Music,
  trophy: Trophy,
  sun: Sun,
  leaf: Leaf,
  star: Star,
  sparkles: Sparkles,
  "heart-handshake": HeartHandshake,
};

type ValueIconProps = {
  name?: string | null;
  className?: string;
};

export function ValueIcon({ name, className }: ValueIconProps) {
  if (!name?.trim()) return null;
  const Icon = VALUE_ICONS[name.toLowerCase().trim()] ?? Sparkles;
  return (
    <Icon
      className={className}
      aria-hidden
      focusable="false"
    />
  );
}
