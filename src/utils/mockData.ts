
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
    description: "AI-powered chatbot for generating human-like responses.",
    category: "Chatbot & Conversational AI",
    url: "https://chat.openai.com",
    upvotes: 245,
    imageUrl: "https://img.freepik.com/free-vector/ai-technology-brain-background-vector-digital-transformation-concept_53876-117815.jpg"
  },
  {
    id: "2",
    name: "Midjourney",
    description: "AI tool for generating high-quality images from text prompts.",
    category: "AI Art & Image Generation",
    url: "https://midjourney.com",
    upvotes: 187
  },
  {
    id: "3",
    name: "DALL·E 3",
    description: "Creates realistic images from text descriptions.",
    category: "AI Art & Image Generation",
    url: "https://openai.com/dall-e-3",
    upvotes: 156
  },
  {
    id: "4",
    name: "Runway ML",
    description: "AI-powered tool for video editing, image generation, and creative media.",
    category: "Video Editing & AI Art",
    url: "https://runwayml.com",
    upvotes: 132
  },
  {
    id: "5",
    name: "GitHub Copilot",
    description: "AI-powered coding assistant for developers.",
    category: "AI Code Assistant",
    url: "https://github.com/features/copilot",
    upvotes: 210
  },
  {
    id: "6",
    name: "Notion AI",
    description: "AI-powered assistant for note-taking and content generation.",
    category: "AI Writing & Productivity",
    url: "https://notion.so",
    upvotes: 230
  },
  {
    id: "7",
    name: "Grammarly",
    description: "Enhances writing with grammar and style suggestions.",
    category: "AI Writing Assistant",
    url: "https://grammarly.com",
    upvotes: 260
  },
  {
    id: "8",
    name: "Descript",
    description: "AI-powered video and podcast editing platform.",
    category: "AI Audio & Video Editing",
    url: "https://descript.com",
    upvotes: 185
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
