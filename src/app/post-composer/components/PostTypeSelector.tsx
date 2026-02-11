"use client";


import Icon from "@/components/ui/AppIcon";

interface PostType {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface PostTypeSelectorProps {
  onSelect: (type: string) => void;
  selectedType: string | null;
}

export default function PostTypeSelector({ onSelect, selectedType }: PostTypeSelectorProps) {
  const postTypes: PostType[] = [
    {
      id: "thought",
      title: "Thought",
      description: "Share an idea or perspective",
      icon: "LightBulbIcon",
    },
    {
      id: "problem",
      title: "Problem",
      description: "Seek help on a challenge",
      icon: "QuestionMarkCircleIcon",
    },
    {
      id: "achievement",
      title: "Achievement",
      description: "Celebrate a milestone",
      icon: "TrophyIcon",
    },
    {
      id: "dilemma",
      title: "Dilemma",
      description: "Navigate a difficult choice",
      icon: "ScaleIcon",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {postTypes.map((type) => (
        <label key={type.id} className="cursor-pointer group">
          <input
            type="radio"
            name="postType"
            value={type.id}
            checked={selectedType === type.id}
            onChange={() => onSelect(type.id)}
            className="sr-only"
          />
          <div
            className={`border p-6 flex items-start gap-4 transition-all duration-300 rounded-sm ${
              selectedType === type.id
                ? "border-primary bg-primary/5" :"border-white/[0.05] hover:border-white/50"
            }`}
          >
            <div
              className={`w-3 h-3 border rounded-sm mt-1 transition-colors ${
                selectedType === type.id ? "border-primary bg-primary" : "border-zinc-600"
              }`}
            ></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Icon
                  name={type.icon as any}
                  size={20}
                  className={`transition-colors ${
                    selectedType === type.id ? "text-primary" : "text-zinc-500"
                  }`}
                />
                <span className="text-sm text-white font-medium">{type.title}</span>
              </div>
              <span className="block text-xs text-zinc-500 font-light">{type.description}</span>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}