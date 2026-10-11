import {
  BookOpen,
  Briefcase,
  Crown,
  Drama,
  Fingerprint,
  FileSignature,
  Flame,
  GraduationCap,
  Heart,
  RotateCcw,
  Skull,
  Sparkles,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  BookOpen,
  Briefcase,
  Crown,
  Drama,
  Fingerprint,
  FileSignature,
  Flame,
  GraduationCap,
  Heart,
  RotateCcw,
  Skull,
  Sparkles,
  Swords,
  Users,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  const Icon = (name && icons[name]) || BookOpen;
  return <Icon className={className} aria-hidden />;
}
