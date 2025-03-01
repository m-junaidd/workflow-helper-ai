
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  upvotes: number;
  imageUrl?: string;
}

export const mockTools: Tool[] = [
  {
    id: "1",
    name: "ChatGPT",
    description: "AI-powered chatbot that can generate human-like text based on the context and previous conversation.",
    category: "Writing Assistant",
    url: "https://chat.openai.com",
    upvotes: 245,
    imageUrl: "https://img.freepik.com/free-vector/ai-technology-brain-background-vector-digital-transformation-concept_53876-117815.jpg"
  },
  {
    id: "2",
    name: "Midjourney",
    description: "AI art generator that creates images from natural language descriptions.",
    category: "Image Generation",
    url: "https://midjourney.com",
    upvotes: 187
  },
  {
    id: "3",
    name: "Notion AI",
    description: "AI-powered writing assistant integrated with Notion that helps with writing, editing, and summarizing content.",
    category: "Productivity",
    url: "https://notion.so",
    upvotes: 156
  },
  {
    id: "4",
    name: "Jasper",
    description: "AI content generator that helps create blog posts, social media content, emails, and more.",
    category: "Content Creation",
    url: "https://jasper.ai",
    upvotes: 132
  },
  {
    id: "5",
    name: "Copy.ai",
    description: "AI copywriting tool that generates high-quality copy for various marketing needs.",
    category: "Marketing",
    url: "https://copy.ai",
    upvotes: 98
  },
  {
    id: "6",
    name: "Descript",
    description: "All-in-one audio/video editing that uses AI to transcribe and edit content as easily as editing a doc.",
    category: "Video Editing",
    url: "https://descript.com",
    upvotes: 76
  },
  {
    id: "7",
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write better code by suggesting whole lines or blocks of code.",
    category: "Software Development",
    url: "https://github.com/features/copilot",
    upvotes: 210
  },
  {
    id: "8",
    name: "Murf.ai",
    description: "AI voice generator that creates natural sounding voiceovers for videos and presentations.",
    category: "Audio Generation",
    url: "https://murf.ai",
    upvotes: 64
  }
];

export const getToolsByQuery = (query: string): Tool[] => {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  
  return mockTools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.category.toLowerCase().includes(normalizedQuery)
    );
  });
};
