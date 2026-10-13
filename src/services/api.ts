import { HealthAdviceResponse } from '../types';

export interface ComplaintCategorySuggestion {
  category: string;
  priority: string;
  suggestedTitle: string;
  safetyTip: string;
  source: string;
}

export async function fetchHealthGuidance(
  symptoms: string,
  studentName?: string
): Promise<HealthAdviceResponse> {
  try {
    const res = await fetch('/api/gemini/health-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, studentName }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API error, returning local guidance fallback:', err);
    return {
      summary: `Guidance for described symptoms: "${symptoms.slice(0, 100)}"`,
      possibleCauses: ['Common viral strain', 'Fatigue/Stress', 'Dehydration'],
      selfCareSteps: [
        'Rest in a quiet, cool environment',
        'Maintain oral hydration with electrolyte solution',
        'Avoid self-medicating with unprescribed antibiotics',
      ],
      redFlagWarning: [
        'High continuous fever > 102°F',
        'Breathing distress or chest heaviness',
        'Severe confusion or inability to stay awake',
      ],
      urgencyLevel: 'moderate',
      dispensaryRecommendation:
        'Please visit the hostel medical room in Block A ground floor for an on-site doctor examination.',
      emergencyContacts: [
        { name: 'Hostel Health Dispensary', phone: '+91 98765 43210', location: 'Block A, Ground Floor, Room 004' },
        { name: 'Campus 24x7 Ambulance', phone: '108 (Campus Ext 22)', location: 'Central Security Pavilion' },
        { name: 'Resident Warden On-Duty', phone: '+91 98765 43201', location: 'Warden Office Block A' },
      ],
    };
  }
}

export async function categorizeComplaintWithAI(
  title: string,
  description: string
): Promise<ComplaintCategorySuggestion> {
  try {
    const res = await fetch('/api/gemini/categorize-complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('AI categorization fallback used:', err);
    const text = `${title} ${description}`.toLowerCase();
    let category = 'other';
    let priority = 'medium';

    if (text.includes('water') || text.includes('tap') || text.includes('leak') || text.includes('pipe')) {
      category = 'plumbing';
      priority = 'high';
    } else if (text.includes('light') || text.includes('fan') || text.includes('switch') || text.includes('socket')) {
      category = 'electrical';
      priority = 'medium';
    } else if (text.includes('wifi') || text.includes('internet') || text.includes('network')) {
      category = 'wifi';
      priority = 'medium';
    } else if (text.includes('bed') || text.includes('table') || text.includes('chair') || text.includes('door')) {
      category = 'furniture';
      priority = 'low';
    }

    return {
      category,
      priority,
      suggestedTitle: title || 'Hostel Maintenance Issue',
      safetyTip: 'A technician will be dispatched according to room availability.',
      source: 'offline-rule-engine',
    };
  }
}
