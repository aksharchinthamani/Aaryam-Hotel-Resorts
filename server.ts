import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure DB directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Helpers to read/write DB
const readDB = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  return { rooms: [], bookings: [] };
};

const writeDB = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database:", error);
  }
};

app.use(express.json());

// Initialize Gemini client (server-side only)
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
    console.log("Gemini API Client initialized successfully for AI Butler.");
  } catch (e) {
    console.error("Failed to initialize Gemini Client:", e);
  }
} else {
  console.log("No valid GEMINI_API_KEY environment variable found. AI Butler falling back to refined luxury rules engine.");
}

// REST APIs
// 1. Get all rooms
app.get('/api/rooms', (req, res) => {
  const db = readDB();
  res.json(db.rooms || []);
});

// 2. Get a single room
app.get('/api/rooms/:id', (req, res) => {
  const db = readDB();
  const room = (db.rooms || []).find((r: any) => r.id === req.params.id);
  if (!room) {
    res.status(404).json({ error: 'Room sanctuary not found' });
    return;
  }
  res.json(room);
});

// 3. Create a room (Admin CRUD)
app.post('/api/rooms', (req, res) => {
  const db = readDB();
  const newRoom = {
    id: req.body.id || req.body.name.toLowerCase().replace(/\s+/g, '-'),
    name: req.body.name,
    type: req.body.type || 'Suite',
    price: Number(req.body.price) || 300,
    image: req.body.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    gallery: req.body.gallery || [req.body.image],
    rating: 4.8,
    size: Number(req.body.size) || 500,
    maxGuests: Number(req.body.maxGuests) || 2,
    view: req.body.view || 'Scenic Mountain Vista',
    description: req.body.description || 'A sanctuary of luxury nestled in hills',
    amenities: req.body.amenities || ['High-speed Wi-Fi', 'Room service']
  };

  db.rooms = db.rooms || [];
  db.rooms.push(newRoom);
  writeDB(db);
  res.status(201).json(newRoom);
});

// 4. Update a room (Admin CRUD)
app.put('/api/rooms/:id', (req, res) => {
  const db = readDB();
  const index = (db.rooms || []).findIndex((r: any) => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  db.rooms[index] = {
    ...db.rooms[index],
    name: req.body.name || db.rooms[index].name,
    type: req.body.type || db.rooms[index].type,
    price: Number(req.body.price) || db.rooms[index].price,
    image: req.body.image || db.rooms[index].image,
    size: Number(req.body.size) || db.rooms[index].size,
    maxGuests: Number(req.body.maxGuests) || db.rooms[index].maxGuests,
    view: req.body.view || db.rooms[index].view,
    description: req.body.description || db.rooms[index].description,
    amenities: req.body.amenities || db.rooms[index].amenities,
  };

  writeDB(db);
  res.json(db.rooms[index]);
});

// 5. Delete a room (Admin CRUD)
app.delete('/api/rooms/:id', (req, res) => {
  const db = readDB();
  const rooms = db.rooms || [];
  const exists = rooms.some((r: any) => r.id === req.params.id);
  if (!exists) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  db.rooms = rooms.filter((r: any) => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Room sanctuary discontinued gracefully' });
});

// 6. Submit a booking request
app.post('/api/bookings', (req, res) => {
  const { roomId, roomName, guestName, guestEmail, checkIn, checkOut, guestsCount, totalAmount, specialRequests } = req.body;

  if (!guestName || !guestEmail || !checkIn || !checkOut || !roomId) {
    res.status(400).json({ error: 'All primary reservations fields are required.' });
    return;
  }

  const db = readDB();
  const bookingId = 'bk-' + Math.floor(10000 + Math.random() * 90000);

  const newBooking = {
    id: bookingId,
    roomId,
    roomName: roomName || roomId,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    guestsCount: Number(guestsCount) || 1,
    totalAmount: Number(totalAmount) || 0,
    status: 'pending',
    specialRequests: specialRequests || '',
    createdAt: new Date().toISOString()
  };

  db.bookings = db.bookings || [];
  db.bookings.push(newBooking);
  writeDB(db);

  res.status(201).json({
    success: true,
    booking: newBooking
  });
});

// 7. Get bookings (Admin Protected)
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  res.json(db.bookings || []);
});

// 8. Update booking status (confirm/reject/cancel)
app.put('/api/bookings/:id/status', (req, res) => {
  const db = readDB();
  const index = (db.bookings || []).findIndex((b: any) => b.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }

  const { status } = req.body;
  if (!['confirmed', 'rejected', 'pending', 'cancelled'].includes(status)) {
    res.status(400).json({ error: 'Invalid sanctuary booking status' });
    return;
  }

  db.bookings[index].status = status;
  writeDB(db);
  res.json(db.bookings[index]);
});

// 8.5. Update booking special requests (Guest Self-Service)
app.put('/api/bookings/:id/requests', (req, res) => {
  const db = readDB();
  const index = (db.bookings || []).findIndex((b: any) => b.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }

  const { specialRequests } = req.body;
  db.bookings[index].specialRequests = specialRequests || '';
  writeDB(db);
  res.json(db.bookings[index]);
});

// 9. Simple Authentication for Admin
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  // Aaryam Luxury Default Administrative Credentials
  if (email === 'admin@aaryam.com' && password === 'luxury2026') {
    res.json({
      success: true,
      token: 'aaryam-royal-signature-token-998822',
      email: 'admin@aaryam.com',
      name: 'Royal Concierge'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials. Only the royal concierge owns access.' });
  }
});

// 10. AI Concierge powered by Gemini
app.post('/api/ai/concierge', async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Your inquiry message is required' });
    return;
  }

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

  if (ai) {
    try {
      // Re-create simple dialogue thread using contents parameter of generateContent
      const contentsParts: any[] = [];
      
      // Map previous chatHistory into standard dialog flow
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.slice(-6).forEach((item: any) => {
          contentsParts.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        });
      }
      
      // Append current message
      contentsParts.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsParts,
        config: {
          systemInstruction: luxuryButlerSystemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        success: true,
        reply: response.text,
      });
    } catch (err: any) {
      console.error("Gemini API generation error:", err);
      res.json({
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

    res.json({
      success: true,
      reply
    });
  }
});

// Vite & Static Asset Setup
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aaryam Hotel & Resorts server fully live on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error("Failed to boot Aaryam backend server:", err);
});
