import {
  Globe,
  Heart,
  type LucideIcon,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

const VALUE_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  globe: Globe,
  shield: Shield,
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
