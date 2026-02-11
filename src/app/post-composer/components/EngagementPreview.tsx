import Icon from "@/components/ui/AppIcon";

export default function EngagementPreview() {
  const engagementOptions = [
    {
      id: "engagement_quiet",
      title: "Quiet Engagement",
      description: "Bookmark with private note",
      icon: "BookmarkIcon",
    },
    {
      id: "engagement_perspective",
      title: "Perspective",
      description: "One-sentence structured view",
      icon: "ChatBubbleLeftIcon",
    },
    {
      id: "engagement_feedback",
      title: "Feedback",
      description: "Constructive (3 fields)",
      icon: "PencilSquareIcon",
    },
    {
      id: "engagement_share",
      title: "Share",
      description: "Choose intent (celebrate, collaborate, reference, inspire)",
      icon: "ShareIcon",
    },
  ];

  return (
    <div>
      <h3 className="text-sm text-zinc-400 mb-4 uppercase tracking-widest">
        How others will engage:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engagementOptions.map((option) => (
          <div
            key={option.id}
            className="p-4 border border-white/[0.05] rounded-sm bg-card flex items-start gap-3"
          >
            <Icon name={option.icon as any} size={20} className="text-primary opacity-60 mt-1" />
            <div>
              <h4 className="text-white text-sm font-medium mb-1">{option.title}</h4>
              <p className="text-xs text-zinc-500">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}