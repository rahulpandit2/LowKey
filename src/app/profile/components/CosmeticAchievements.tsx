import Icon from "@/components/ui/AppIcon";

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  requiredPoints: string;
}

export default function CosmeticAchievements() {
  const achievements: Achievement[] = [
    {
      id: "achievement_frame_1",
      title: "Reflective Writer Frame",
      description: "Subtle border for your avatar",
      unlocked: true,
      requiredPoints: "20 medium points",
    },
    {
      id: "achievement_avatar_1",
      title: "Animated Avatar (Subtle Pulse)",
      description: "Gentle glow effect",
      unlocked: true,
      requiredPoints: "3 high points",
    },
    {
      id: "achievement_frame_2",
      title: "Gold Frame",
      description: "Premium border for avatar",
      unlocked: false,
      requiredPoints: "10 high points",
    },
    {
      id: "achievement_badge_1",
      title: "Thoughtful Contributor Badge",
      description: "Small icon next to name",
      unlocked: false,
      requiredPoints: "50 medium points",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Cosmetic Achievements</h2>
          <p className="text-sm text-zinc-500">
            Redeemable perks for participation. Cosmetic only—no functional advantages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-6 border rounded-sm transition-colors ${
                achievement.unlocked
                  ? "border-primary bg-primary/5 hover:bg-primary/10" :"border-white/[0.05] bg-card hover:bg-zinc-900/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon
                  name={achievement.unlocked ? "CheckCircleIcon" : "LockClosedIcon"}
                  size={24}
                  className={achievement.unlocked ? "text-primary" : "text-zinc-600"}
                />
                <span
                  className={`text-xs uppercase tracking-widest ${
                    achievement.unlocked ? "text-primary" : "text-zinc-600"
                  }`}
                >
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
              <h3 className="text-white font-medium mb-2 text-sm">{achievement.title}</h3>
              <p className="text-xs text-zinc-500 mb-3">{achievement.description}</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                {achievement.requiredPoints}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}