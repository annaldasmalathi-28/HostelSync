import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client securely on server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System status endpoint
app.get('/api/system-status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'HostelSync — Smart Hostel Management System',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    storageMode: 'hybrid_server_local',
    timestamp: new Date().toISOString(),
  });
});

// AI Health Assistance Endpoint
app.post('/api/gemini/health-assist', async (req: Request, res: Response) => {
  const { symptoms, studentName, age } = req.body;

  if (!symptoms || typeof symptoms !== 'string') {
    return res.status(400).json({ error: 'Symptoms description is required.' });
  }

  // If Gemini API is available, query the model with timeout
  if (aiClient) {
    try {
      const prompt = `Student ${studentName || 'Resident'} describes the following symptoms:\n"${symptoms}"\nProvide educational health guidance, general wellness steps, triage urgency, and red flags.`;

      const geminiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the HostelSync Campus Medical First-Responder Assistant. You provide helpful, calming, and medically cautious initial health information to university students living in college hostels.
CRITICAL SAFETY RULES:
1. Always state prominently that this is NOT a medical diagnosis and cannot replace an in-person clinical examination.
2. If symptoms suggest emergency (e.g. chest pain, severe shortness of breath, anaphylaxis, severe head trauma, acute high fever with stiff neck, severe dehydration), set urgencyLevel to 'emergency' and strongly urge immediate dispatch to the campus dispensary or 24/7 ambulance.
3. Recommend safe self-care (hydration, rest, fever cooling measures) and emphasize visiting the campus dispensary.
Return ONLY a valid JSON object matching the requested schema.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'A compassionate, plain-language summary of what might be happening.',
              },
              possibleCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 common benign causes to discuss with a clinician.',
              },
              selfCareSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Safe self-care steps (e.g. oral hydration, rest, bland diet).',
              },
              redFlagWarning: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Warning signs that require immediate emergency care.',
              },
              urgencyLevel: {
                type: Type.STRING,
                description: 'One of: low, moderate, high, emergency',
              },
              dispensaryRecommendation: {
                type: Type.STRING,
                description: 'Specific advice regarding when to visit the hostel clinic doctor.',
              },
            },
            required: [
              'summary',
              'possibleCauses',
              'selfCareSteps',
              'redFlagWarning',
              'urgencyLevel',
              'dispensaryRecommendation',
            ],
          },
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        ...parsed,
        source: 'gemini-ai',
        disclaimer:
          'Medical Disclaimer: This information is for general educational awareness only and does not constitute formal medical diagnosis or prescription. Always consult the Hostel Medical Officer or local clinic for clinical evaluation.',
        emergencyContacts: [
          { name: 'Hostel Health Dispensary', phone: '+91 98765 43210', location: 'Block A, Ground Floor, Room 004' },
          { name: 'Campus 24x7 Ambulance', phone: '108 (Campus Ext 22)', location: 'Central Security Pavilion' },
          { name: 'Resident Warden On-Duty', phone: '+91 98765 43201', location: 'Warden Office Block A' },
        ],
      });
    } catch (err: any) {
      console.warn('Gemini API call skipped or timed out, falling back to clinical triage rules:', err?.message);
    }
  }

  // Reliable Clinical Rule-Based Fallback when API key is missing or quota reached
  const lower = symptoms.toLowerCase();
  let urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency' = 'low';
  let causes: string[] = ['Common viral flu', 'Physical exhaustion', 'Mild seasonal allergy'];
  let steps: string[] = [
    'Drink plenty of warm fluids (water, ORS, herbal tea)',
    'Ensure 8 hours of uninterrupted rest in a well-ventilated room',
    'Monitor temperature twice daily using a digital thermometer',
  ];
  let redFlags: string[] = [
    'Fever exceeding 103°F (39.4°C) not responding to paracetamol',
    'Difficulty breathing, wheezing, or chest tightness',
    'Persistent vomiting leading to inability to retain water',
  ];

  if (lower.includes('chest') || lower.includes('breath') || lower.includes('faint') || lower.includes('seizure')) {
    urgencyLevel = 'emergency';
    causes = ['Acute respiratory or cardiac stress', 'Severe allergic reaction', 'Acute panic episode'];
    redFlags.unshift('Immediate clinical evaluation required immediately');
  } else if (lower.includes('fever') || lower.includes('vomit') || lower.includes('diarrhea') || lower.includes('stomach')) {
    urgencyLevel = 'moderate';
    causes = ['Gastroenteritis / foodborne infection', 'Viral upper respiratory tract infection', 'Dehydration'];
    steps.push('Take Electral / ORS solution in small, frequent sips');
    steps.push('Eat light, easily digestible food (khichdi, curd rice, bananas)');
  } else if (lower.includes('sprain') || lower.includes('ankle') || lower.includes('swelling') || lower.includes('pain')) {
    urgencyLevel = 'moderate';
    causes = ['Ligament sprain or muscle strain', 'Blunt sports contusion'];
    steps = [
      'Apply R.I.C.E. protocol (Rest, Ice pack wrapped in cloth for 15 mins, Compression, Elevation)',
      'Avoid bearing excessive weight on the affected limb',
    ];
  }

  res.json({
    source: 'clinical-triage-engine',
    summary: `Based on your description of "${symptoms.slice(0, 80)}${symptoms.length > 80 ? '...' : ''}", this appears to be a ${urgencyLevel}-urgency condition that merits observation and proper care.`,
    possibleCauses: causes,
    selfCareSteps: steps,
    redFlagWarning: redFlags,
    urgencyLevel,
    dispensaryRecommendation:
      urgencyLevel === 'emergency'
        ? 'ALERT: Proceed immediately to the campus emergency dispensary or dial the ambulance hotline below.'
        : 'Visit the Hostel Health Dispensary between 9:00 AM – 1:00 PM or 4:00 PM – 7:00 PM for vital checks and standard consultation.',
    disclaimer:
      'Medical Disclaimer: This information is for general educational awareness only and does not constitute formal medical diagnosis. Always consult the Hostel Medical Officer for proper treatment.',
    emergencyContacts: [
      { name: 'Hostel Health Dispensary', phone: '+91 98765 43210', location: 'Block A, Ground Floor, Room 004' },
      { name: 'Campus 24x7 Ambulance', phone: '108 (Campus Ext 22)', location: 'Central Security Pavilion' },
      { name: 'Resident Warden On-Duty', phone: '+91 98765 43201', location: 'Warden Office Block A' },
    ],
  });
});

// AI Complaint Categorization & Priority Recommendation Endpoint
app.post('/api/gemini/categorize-complaint', async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Complaint description is required.' });
  }

  if (aiClient) {
    try {
      const geminiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze this hostel maintenance complaint:\nTitle: ${title || 'Untitled'}\nDescription: ${description}`,
        config: {
          systemInstruction: `You are an expert Facility & Hostel Maintenance Dispatch AI.
Your task:
1. Classify the complaint category accurately as one of: 'plumbing', 'electrical', 'cleaning', 'wifi', 'furniture', 'appliance', 'other'.
2. Classify priority as: 'low', 'medium', 'high', 'emergency' (emergency for active water floods, sparking live wires, gas leaks, locked-in students).
3. Provide a refined technical title (under 8 words).
4. Provide a 1-sentence quick safety tip or immediate action the student should take while technician is dispatched.
Return JSON only.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'plumbing | electrical | cleaning | wifi | furniture | appliance | other',
              },
              priority: {
                type: Type.STRING,
                description: 'low | medium | high | emergency',
              },
              suggestedTitle: {
                type: Type.STRING,
                description: 'Refined concise technical title',
              },
              safetyTip: {
                type: Type.STRING,
                description: 'Short mitigation or safety guideline',
              },
            },
            required: ['category', 'priority', 'suggestedTitle', 'safetyTip'],
          },
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        ...parsed,
        source: 'gemini-ai',
      });
    } catch (err: any) {
      console.warn('Gemini categorization skipped or timed out, falling back to rule engine:', err?.message);
    }
  }

  // Deterministic Keyword Rule Engine fallback
  const text = `${title || ''} ${description}`.toLowerCase();
  let category = 'other';
  let priority = 'medium';
  let safetyTip = 'Please keep the room accessible for the maintenance staff.';
  let suggestedTitle = title || 'Hostel Maintenance Request';

  if (text.includes('leak') || text.includes('tap') || text.includes('water') || text.includes('pipe') || text.includes('flush') || text.includes('drain') || text.includes('faucet')) {
    category = 'plumbing';
    priority = text.includes('flood') || text.includes('burst') ? 'emergency' : 'high';
    safetyTip = 'Turn off the local angle valve or washroom main inlet tap if accessible to avoid overflow.';
    suggestedTitle = 'Plumbing Inspection & Leakage Repair';
  } else if (text.includes('spark') || text.includes('socket') || text.includes('switch') || text.includes('fan') || text.includes('light') || text.includes('wire') || text.includes('short')) {
    category = 'electrical';
    priority = text.includes('spark') || text.includes('smoke') || text.includes('shock') ? 'emergency' : 'medium';
    safetyTip = 'Do not touch wet surfaces or damaged cables. Turn off the room MCB switch if sparking occurs.';
    suggestedTitle = 'Electrical Fitting & Power Circuit Repair';
  } else if (text.includes('wifi') || text.includes('internet') || text.includes('lan') || text.includes('router') || text.includes('network') || text.includes('signal')) {
    category = 'wifi';
    priority = 'medium';
    safetyTip = 'Check if nearby student rooms also experience the drop to help technician locate the PoE switch.';
    suggestedTitle = 'Corridor Wi-Fi AP & Network Troubleshooting';
  } else if (text.includes('bed') || text.includes('desk') || text.includes('table') || text.includes('chair') || text.includes('wardrobe') || text.includes('cupboard') || text.includes('hinge')) {
    category = 'furniture';
    priority = 'low';
    safetyTip = 'Avoid placing heavy items on the broken hinge or frame until repaired.';
    suggestedTitle = 'Carpentry & Furniture Adjustment';
  } else if (text.includes('clean') || text.includes('garbage') || text.includes('dust') || text.includes('pest') || text.includes('insect')) {
    category = 'cleaning';
    priority = 'low';
    safetyTip = 'Housekeeping staff has been queued for standard sanitation cycle.';
    suggestedTitle = 'Room Deep Cleaning & Sanitation Request';
  }

  res.json({
    category,
    priority,
    suggestedTitle,
    safetyTip,
    source: 'rule-engine',
  });
});

// Vite middleware for development or static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HostelSync Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
