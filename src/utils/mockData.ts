
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
    name: "Stable Diffusion",
    description: "Text-to-image AI model for creative artworks.",
    category: "AI Art & Image Generation",
    url: "https://stability.ai",
    upvotes: 145
  },
  {
    id: "6",
    name: "Synthesia",
    description: "AI-based video creation platform with realistic avatars.",
    category: "AI Video Generation",
    url: "https://synthesia.io",
    upvotes: 110
  },
  {
    id: "7",
    name: "Pictory",
    description: "Creates videos from text, blog posts, and scripts automatically.",
    category: "AI Video Editing",
    url: "https://pictory.ai",
    upvotes: 98
  },
  {
    id: "8",
    name: "Lumen5",
    description: "Transforms text content into engaging videos using AI.",
    category: "AI Video Creation",
    url: "https://lumen5.com",
    upvotes: 120
  },
  {
    id: "9",
    name: "Descript",
    description: "AI-powered video and podcast editing platform.",
    category: "AI Audio & Video Editing",
    url: "https://descript.com",
    upvotes: 185
  },
  {
    id: "10",
    name: "ElevenLabs",
    description: "Realistic AI-generated voice synthesis and text-to-speech.",
    category: "AI Voice Generation",
    url: "https://elevenlabs.io",
    upvotes: 160
  },
  {
    id: "11",
    name: "Play.ht",
    description: "AI-powered text-to-speech with natural-sounding voices.",
    category: "AI Voice Generation",
    url: "https://play.ht",
    upvotes: 140
  },
  {
    id: "12",
    name: "Murf AI",
    description: "Generates AI voices for videos, podcasts, and more.",
    category: "AI Voice Generation",
    url: "https://murf.ai",
    upvotes: 130
  },
  {
    id: "13",
    name: "Resemble AI",
    description: "Generates synthetic voices and clones real ones.",
    category: "AI Voice Cloning",
    url: "https://resemble.ai",
    upvotes: 125
  },
  {
    id: "14",
    name: "Notion AI",
    description: "AI-powered assistant for note-taking and content generation.",
    category: "AI Writing & Productivity",
    url: "https://notion.so",
    upvotes: 230
  },
  {
    id: "15",
    name: "Grammarly",
    description: "Enhances writing with grammar and style suggestions.",
    category: "AI Writing Assistant",
    url: "https://grammarly.com",
    upvotes: 260
  },
  {
    id: "16",
    name: "Copy.ai",
    description: "AI tool for generating marketing copy, ads, and content.",
    category: "AI Writing Assistant",
    url: "https://copy.ai",
    upvotes: 180
  },
  {
    id: "17",
    name: "Jasper AI",
    description: "Generates high-quality written content for blogs, ads, and emails.",
    category: "AI Writing & Content Generation",
    url: "https://jasper.ai",
    upvotes: 190
  },
  {
    id: "18",
    name: "QuillBot",
    description: "Paraphrases, summarizes, and improves writing.",
    category: "AI Writing Assistant",
    url: "https://quillbot.com",
    upvotes: 170
  },
  {
    id: "19",
    name: "Rytr",
    description: "AI-based writing assistant for content creation.",
    category: "AI Writing Assistant",
    url: "https://rytr.me",
    upvotes: 150
  },
  {
    id: "20",
    name: "DeepL",
    description: "Advanced AI-powered translation tool.",
    category: "AI Language Translation",
    url: "https://deepl.com",
    upvotes: 200
  },
  {
    id: "21",
    name: "Google Bard",
    description: "Google's AI chatbot for research and content generation.",
    category: "AI Chatbot & Research Assistant",
    url: "https://bard.google.com",
    upvotes: 210
  },
  {
    id: "22",
    name: "Claude AI",
    description: "AI chatbot with human-like conversation capabilities.",
    category: "AI Conversational Agent",
    url: "https://anthropic.com/claude",
    upvotes: 195
  },
  {
    id: "23",
    name: "GitHub Copilot",
    description: "AI-powered coding assistant for developers.",
    category: "AI Code Assistant",
    url: "https://github.com/features/copilot",
    upvotes: 210
  },
  {
    id: "24",
    name: "Tabnine",
    description: "AI-powered code completion and suggestion tool.",
    category: "AI Code Completion",
    url: "https://tabnine.com",
    upvotes: 185
  },
  {
    id: "25",
    name: "BlackBox AI",
    description: "AI-powered code search and autocomplete tool.",
    category: "AI Code Assistance",
    url: "https://blackbox.ai",
    upvotes: 160
  },
  {
    id: "26",
    name: "AI Dungeon",
    description: "AI-generated text-based adventure game.",
    category: "AI Game & Storytelling",
    url: "https://aidungeon.io",
    upvotes: 140
  },
  {
    id: "27",
    name: "Replit Ghostwriter",
    description: "AI-based code completion tool for Replit users.",
    category: "AI Code Completion",
    url: "https://replit.com/ghostwriter",
    upvotes: 155
  },
  {
    id: "28",
    name: "SynthFlow",
    description: "Automates business workflows using AI.",
    category: "AI Workflow Automation",
    url: "https://synthflow.com",
    upvotes: 130
  },
  {
    id: "29",
    name: "Zapier AI",
    description: "Automates tasks between different applications using AI.",
    category: "AI Automation",
    url: "https://zapier.com",
    upvotes: 175
  },
  {
    id: "30",
    name: "DataRobot",
    description: "AI-powered data analytics and machine learning platform.",
    category: "AI Data Analysis",
    url: "https://datarobot.com",
    upvotes: 165
  },
  {
    id: "31",
    name: "MonkeyLearn",
    description: "AI-based text analysis and NLP platform.",
    category: "AI Text Analysis",
    url: "https://monkeylearn.com",
    upvotes: 145
  },
  {
    id: "32",
    name: "Looka",
    description: "AI-powered tool for creating logos and branding.",
    category: "AI Logo Design",
    url: "https://looka.com",
    upvotes: 155
  },
  {
    id: "33",
    name: "Krisp AI",
    description: "AI-powered noise cancellation for calls and recordings.",
    category: "AI Audio Enhancement",
    url: "https://krisp.ai",
    upvotes: 170
  },
  {
    id: "34",
    name: "OpenAI Codex",
    description: "AI-powered coding assistant that writes and improves code.",
    category: "AI Code Generation",
    url: "https://openai.com/blog/openai-codex",
    upvotes: 205
  }
];

// Enhanced search function that handles more complex queries
export const getToolsByQuery = (query: string): Tool[] => {
  if (!query) return mockTools.slice(0, 5); // Return first 5 tools as default
  
  const normalizedQuery = query.toLowerCase();
  
  // Split the query into keywords for better matching
  const keywords = normalizedQuery
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  // First, find exact matches
  const results = mockTools.filter(tool => {
    // Check for exact matches in name, description, or category
    const exactMatch = 
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.category.toLowerCase().includes(normalizedQuery);
    
    if (exactMatch) return true;
    
    // Check for keyword matches
    if (keywords.length > 0) {
      return keywords.some(keyword => 
        tool.name.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword) ||
        tool.category.toLowerCase().includes(keyword)
      );
    }
    
    return false;
  });
  
  // Special case: if query mentions roles, jobs, or tasks
  if (
    normalizedQuery.includes('student') || 
    normalizedQuery.includes('write') || 
    normalizedQuery.includes('content') ||
    normalizedQuery.includes('research') ||
    normalizedQuery.includes('learn') ||
    normalizedQuery.includes('study') ||
    normalizedQuery.includes('academic')
  ) {
    // Add study and writing tools
    const studyTools = mockTools.filter(tool => 
      tool.category.includes('Writing') || 
      tool.category.includes('Research') ||
      tool.description.toLowerCase().includes('writing') ||
      tool.description.toLowerCase().includes('research') ||
      tool.name === 'Notion AI' ||
      tool.name === 'Grammarly' ||
      tool.name === 'QuillBot'
    );
    
    // Combine results, remove duplicates
    const combinedResults = [...results];
    for (const tool of studyTools) {
      if (!combinedResults.some(t => t.id === tool.id)) {
        combinedResults.push(tool);
      }
    }
    
    return combinedResults;
  }
  
  // If no results, return some default suggestions
  if (results.length === 0) {
    return mockTools.slice(0, 5); // Return first 5 tools as default
  }
  
  return results;
};

// Generate AI recommendations based on a text query
export const generateMockRecommendations = (query: string) => {
  // Get relevant tools
  const relevantTools = getToolsByQuery(query);
  const selectedTools = relevantTools.slice(0, 4); // Pick top 4 tools
  
  // Create recommendations
  const recommendations = selectedTools.map(tool => ({
    tool_id: tool.id,
    reasons: `Based on your needs, ${tool.name} is an excellent choice for ${tool.category.toLowerCase()} tasks. It can help you ${tool.description.toLowerCase().replace('.', '')} efficiently.`,
    usage_tips: `Start by exploring the ${tool.name} interface. For beginners, try using the pre-built templates. This tool excels at handling the specific requirements you mentioned.`
  }));
  
  // Generate general advice based on the query
  let generalAdvice = "Based on your description, you would benefit from tools that ";
  
  if (query.toLowerCase().includes('student') || query.toLowerCase().includes('research')) {
    generalAdvice += "assist with research, writing, and organizing information. Consider using AI writing assistants for drafting and editing your work, along with note-taking tools to organize your findings.";
  } else if (query.toLowerCase().includes('video') || query.toLowerCase().includes('image') || query.toLowerCase().includes('design')) {
    generalAdvice += "help with creating and editing visual content. Look for AI-powered tools that can generate or enhance images and videos based on your specifications, saving you time and effort.";
  } else if (query.toLowerCase().includes('code') || query.toLowerCase().includes('develop') || query.toLowerCase().includes('program')) {
    generalAdvice += "improve your coding workflow and productivity. AI code assistants can help you write better code faster, suggest improvements, and help with debugging.";
  } else {
    generalAdvice += "automate repetitive tasks and enhance your productivity. These AI-powered tools can save you time and help you produce higher quality results with less effort.";
  }
  
  return {
    recommendations,
    general_advice: generalAdvice
  };
};
