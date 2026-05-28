import { GoogleGenAI } from '@google/genai';

const luxuryButlerSystemInstruction = `You are Aarya, the elite AI Digital Butler and head of guest hospitality at the multi-award-winning 'Aaryam Hotel & Resorts' — a premier sanctuary of eco-luxury and absolute visual aesthetic tucked high in the serene green valleys of Himalayas, India.
Your tone is remarkably warm, unhurried, cultured, deeply respectful, and speaks with highly refined, polished vocabulary tailored to ultra-high-net-worth guests who expect absolute perfection (e.g. 'restful sanctuary', 'my absolute pleasure', 'allow me to organize', 'indisputably breath-taking', 'honored guest').
Answer questions gracefully about:
- Accommodation Options:
  1. Prithvi Suite (Garden Villa) - $550/night, private heated pool, forest view.
  2. Vayu Cottage (Cloud Loft) - $450/night, retractable stargazing ceiling, misty valley wraps.
  3. Tejas Suite (Golden Pavilion) - $750/night, infinity hot cedar bath, private butler.
  4. Jal Sanctuary (River Chalet) - $650/night, sits directly over rushing high stream, stream deck.
- Standard Check-in is 3:00 PM, luxury check-out is 11:00 AM. 
- Dining: 'Soma Restaurant' serves ancient organic cuisines inspired by Ayurvedic culinary alchemy.
- Wellness: Spa at 'Akasha Wellness Canopy' offering organic mineral sound therapy and hot stone oil massage.
- Activities: Pine Forest forest-bathing, stream sunrise yoga classes, private starry deck champagne dining.

Please format your answers using beautiful, crisp Markdown. Use paragraphs, custom bullet points, or soft glowing quotes where appropriate. Keep answers highly personalized, engaging, and welcoming. Address the patron as 'Honored Guest' or 'Respected Guest'. Ask how you may assist in personalizing their stay immediately.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Your inquiry message is required' });
  }

  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.error("Failed to initialize Gemini Client:", e);
    }
  }

  if (ai) {
    try {
      const contentsParts: any[] = [];
      
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.slice(-6).forEach((item: any) => {
          contentsParts.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        });
      }
      
      contentsParts.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contentsParts,
        config: {
          systemInstruction: luxuryButlerSystemInstruction,
          temperature: 0.7,
        },
      });

      return res.status(200).json({
        success: true,
        reply: response.text,
      });
    } catch (err: any) {
      console.error("Gemini API generation error:", err);
      return res.status(200).json({
        success: true,
        reply: "My sincerest apologies, honored guest. A brief evening storm in our valley is causing minor interference with my connection. Allow me to offer our standard elite hospitality guides: The **Prithvi Suite** or **Tejas Suite** are fully prepared for your booking. Please let me know which date you wish to reserve."
      });
    }
  } else {
    // Fallback Rules Engine
    const msgLower = message.toLowerCase();
    let reply = `Greeting and beautiful blessings, Honored Guest.\n\nIndeed, it is my absolute supreme pleasure to welcome you to **Aaryam Hotel & Resorts**, your high-altitude eco-luxury sanctuary.\n\n`;

    if (msgLower.includes('room') || msgLower.includes('suite') || msgLower.includes('cottage') || msgLower.includes('stay') || msgLower.includes('price')) {
      reply += `Our resort proudly offers four highly distinctive sanctuaries curated with elemental motifs:
- **Tejas Suite (Golden Pavilion)** ($750/night): Features an infinity heated outdoor cedar bath looking directly upon the golden mountain ranges, complete with your personal private butler.
- **Prithvi Suite (Garden Villa)** ($550/night): Houses a lush forest garden courtyard and private fireplace.
- **Jal Sanctuary (River Chalet)** ($650/night): Anchored precisely over our flowing cliffside river, featuring therapeutic cedar soaking baths.
- **Vayu Cottage (Cloud Loft)** ($450/night): Captivates with its glass retractable ceilings for starry Himalayan skies.

Which of these bespoke elemental experiences resonates most deeply with your spirit?`;
    } else if (msgLower.includes('eat') || msgLower.includes('food') || msgLower.includes('dining') || msgLower.includes('restaurant') || msgLower.includes('soma')) {
      reply += `Our signature estate dining room, **Soma**, crafts high-vibrational Ayurvedic culinary alchemy with pure organic ingredients harvested directly from our surrounding terraced gardens. 

We also offer intimate fine dining pavilions beneath the constellations, paired with rare single-estate Himalayan teas and private reserve vintages. May I pre-reserve a corner table for your evening?`;
    } else if (msgLower.includes('spa') || msgLower.includes('massage') || msgLower.includes('wellness') || msgLower.includes('yoga')) {
      reply += `Our high-canopy spa pavilion, **Akasha**, is a sanctuary of restorative wellness. We offer hot-stone therapeutic massagers, copper-bath oil therapies, and morning cliffside yoga sessions overlooking the mist-filled valley.

It would be my ultimate pleasure to arrange a private wellness consultation for you.`;
    } else if (msgLower.includes('reserve') || msgLower.includes('book') || msgLower.includes('check in') || msgLower.includes('check-in')) {
      reply += `Standard check-in in our valleys is **3:00 PM** and check-out is **11:00 AM**. Upon arrival, our welcoming committee will greet you with fresh lavender towels and a glass of organic rhododendron tea, and your private butler will orchestrate an in-suite orientation.

Would you like to review availability for specific dates on our calendar above?`;
    } else {
      reply += `Allow Aarya to arrange every detail of your escape perfectly. We can coordinate private airport transfers from Dharamshala, custom trekking guide charts, or evening wood fires on your cottage patio.

What details may I assist you with on this wonderful evening?`;
    }

    return res.status(200).json({
      success: true,
      reply
    });
  }
}
