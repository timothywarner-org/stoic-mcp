import type { Quote } from './types.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export class DeepSeekService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('DEEPSEEK_API_KEY not set. AI explanations will be disabled.');
    }
  }

  async explainQuote(quote: Quote): Promise<string> {
    if (!this.apiKey) {
      return 'DeepSeek API key not configured. Set DEEPSEEK_API_KEY environment variable to enable AI explanations.';
    }

    // Customize prompt based on quote category
    let expertContext = '';
    let applicationContext = '';

    switch (quote.category.toLowerCase()) {
      case 'stoic':
        expertContext = 'You are a Stoic philosophy expert with deep knowledge of ancient wisdom.';
        applicationContext = 'dealing with work stress, technical challenges, and maintaining equanimity in a fast-paced tech environment';
        break;
      case 'mindfulness':
        expertContext = 'You are a mindfulness and meditation expert familiar with contemplative practices.';
        applicationContext = 'managing stress, staying present during deep work, and cultivating awareness in their daily routine';
        break;
      case 'productivity':
        expertContext = 'You are a productivity and personal effectiveness expert.';
        applicationContext = 'managing tasks, maintaining focus, organizing their work, and achieving their goals';
        break;
      case 'self-help':
        expertContext = 'You are a personal development and self-improvement expert.';
        applicationContext = 'building confidence, overcoming limiting beliefs, and creating positive change in their life';
        break;
      case 'relationships':
        expertContext = 'You are an expert in healthy relationships and interpersonal dynamics.';
        applicationContext = 'setting boundaries, building authentic connections, and navigating workplace relationships';
        break;
      default:
        expertContext = 'You are a wisdom and personal development expert.';
        applicationContext = 'applying practical wisdom to their personal and professional life';
    }

    const prompt = `${expertContext} Explain this quote in practical terms for a modern professional ${applicationContext}.

Quote: "${quote.text}"
Author: ${quote.author}
Source: ${quote.source}
Category: ${quote.category}
Theme: ${quote.theme}

Provide a concise, actionable explanation (2-3 paragraphs) that helps them apply this wisdom to their daily work and life. Focus on practical application rather than abstract theory. Include specific examples when helpful.`;

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('DeepSeek API error:', error);
        return `Failed to get explanation: ${response.status} ${response.statusText}`;
      }

      const data = await response.json() as {
        choices: Array<{
          message: {
            content: string;
          };
        }>;
      };
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      return `Error getting explanation: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  async generateQuote(theme: string, category: string = 'stoic'): Promise<string> {
    if (!this.apiKey) {
      return 'DeepSeek API key not configured. Set DEEPSEEK_API_KEY environment variable to enable AI quote generation.';
    }

    let styleGuidance = '';

    switch (category.toLowerCase()) {
      case 'stoic':
        styleGuidance = 'Generate a Stoic-style quote that sounds authentic to ancient philosophers like Marcus Aurelius, Seneca, or Epictetus. Focus on wisdom, virtue, and what is within our control.';
        break;
      case 'mindfulness':
        styleGuidance = 'Generate a mindfulness-style quote in the spirit of Tara Brach, Thich Nhat Hanh, or Jon Kabat-Zinn. Focus on presence, compassion, and awareness.';
        break;
      case 'productivity':
        styleGuidance = 'Generate a productivity-style quote in the spirit of David Allen (Getting Things Done). Focus on clarity, organization, and stress-free productivity.';
        break;
      case 'self-help':
        styleGuidance = 'Generate a self-empowerment quote in the spirit of Jen Sincero or Mark Manson. Be direct, honest, and empowering. Focus on personal responsibility and growth.';
        break;
      case 'relationships':
        styleGuidance = 'Generate a relationships quote in the spirit of Robert Glover (No More Mr. Nice Guy). Focus on healthy boundaries, authenticity, and self-respect.';
        break;
      default:
        styleGuidance = 'Generate an inspiring and practical quote about personal development.';
    }

    const prompt = `${styleGuidance}

Theme: "${theme}"

Return only the quote itself, without attribution, quotation marks, or extra commentary. Make it concise, memorable, and actionable.`;

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('DeepSeek API error:', error);
        return `Failed to generate quote: ${response.status} ${response.statusText}`;
      }

      const data = await response.json() as {
        choices: Array<{
          message: {
            content: string;
          };
        }>;
      };
      return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      return `Error generating quote: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}
