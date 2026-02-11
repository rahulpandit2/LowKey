import Icon from "@/components/ui/AppIcon";

export default function PrivacyGuarantees() {
  const guarantees = [
    {
      id: "guarantee_profile",
      title: "Your profile is never shown on Help posts.",
      icon: "EyeSlashIcon",
    },
    {
      id: "guarantee_history",
      title: "Responders can\'t see your post history.",
      icon: "ShieldCheckIcon",
    },
    {
      id: "guarantee_delete",
      title: "You can delete Help posts anytime (24h edit window).",
      icon: "TrashIcon",
    },
    {
      id: "guarantee_data",
      title: "Data is stored securely. GDPR compliant.",
      icon: "LockClosedIcon",
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Privacy <span className="text-zinc-600 italic">guarantees.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.id}
              className="p-8 border border-white/[0.05] rounded-sm bg-card flex items-start gap-4 hover:bg-zinc-900/20 transition-colors"
            >
              <Icon
                name={guarantee.icon as any}
                size={24}
                className="text-primary opacity-60 mt-1"
              />
              <p className="text-white text-sm leading-relaxed">{guarantee.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}