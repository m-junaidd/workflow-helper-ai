
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WELCOME_MESSAGES = [
  "Find AI tools that transform your workflow and boost productivity.",
  "Discover the perfect AI tools tailored specifically to your needs.",
  "Explore cutting-edge AI tools to supercharge your creative process.",
  "Find the right AI tools to automate tasks and focus on what matters.",
  "Navigate the world of AI with tools customized for your requirements."
];

serve(async (req) => {
  try {
    // Get a random welcome message
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    const message = WELCOME_MESSAGES[randomIndex];

    return new Response(
      JSON.stringify({
        message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
