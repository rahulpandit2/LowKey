import Icon from '@/components/ui/AppIcon';

export default function PrivacySection() {
  const privacyFeatures = [
    {
      id: 'privacy_anonymous',
      title: 'Anonymous Authoring',
      description: 'No public profile info on Help posts',
      icon: 'EyeSlashIcon',
    },
    {
      id: 'privacy_followup',
      title: 'Optional Follow-up',
      description: 'Private link only you control',
      icon: 'LinkIcon',
    },
    {
      id: 'privacy_constrained',
      title: 'Constrained Responses',
      description: 'Empathetic + constructive fields only',
      icon: 'ShieldCheckIcon',
    },
    {
      id: 'privacy_helpful',
      title: 'Private Marking',
      description: 'Mark responses helpful (no public signal)',
      icon: 'CheckCircleIcon',
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-medium text-white tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            Privacy & Help
            <span className="w-8 h-[1px] bg-white"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Safe to be <br />
            <span className="text-zinc-600 italic">vulnerable.</span>
          </h3>
        </div>

        {/* Flow Diagram */}
        <div className="mb-16 border border-white/[0.05] p-8 md:p-12 rounded-sm bg-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="LockClosedIcon" size={24} className="text-primary" />
              </div>
              <p className="text-sm text-white font-medium mb-2">Post Anonymously</p>
              <p className="text-xs text-zinc-500">No profile visible</p>
            </div>
            <Icon name="ArrowRightIcon" size={20} className="text-zinc-600 hidden md:block" />
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="ChatBubbleLeftEllipsisIcon" size={24} className="text-primary" />
              </div>
              <p className="text-sm text-white font-medium mb-2">Get Responses</p>
              <p className="text-xs text-zinc-500">Constrained empathetic fields</p>
            </div>
            <Icon name="ArrowRightIcon" size={20} className="text-zinc-600 hidden md:block" />
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="HandThumbUpIcon" size={24} className="text-primary" />
              </div>
              <p className="text-sm text-white font-medium mb-2">Mark Helpful</p>
              <p className="text-xs text-zinc-500">Private recognition</p>
            </div>
            <Icon name="ArrowRightIcon" size={20} className="text-zinc-600 hidden md:block" />
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="UserIcon" size={24} className="text-primary" />
              </div>
              <p className="text-sm text-white font-medium mb-2">Optional Contact</p>
              <p className="text-xs text-zinc-500">Private follow-up link</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyFeatures.map((feature) => (
            <div
              key={feature.id}
              className="p-6 border border-white/[0.05] rounded-sm bg-card hover:bg-zinc-900/20 transition-colors"
            >
              <Icon name={feature.icon as any} size={24} className="text-primary mb-4 opacity-60" />
              <h4 className="text-white font-medium mb-2 text-sm">{feature.title}</h4>
              <p className="text-xs text-zinc-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
