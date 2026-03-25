const jsonDb = require('./utils/jsonDb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    const dataDir = path.join(__dirname, '../data');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Completely wipe all data for a fresh seed (Standard for Hackathon Demo)
    const files = fs.readdirSync(dataDir);
    for (const file of files) {
      fs.unlinkSync(path.join(dataDir, file));
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const specialistsData = [
      // General Medicine
      { name: "Dr. Adebayo Benson", specialization: "General Medicine", bio: "Experienced family physician focused on preventive care." },
      { name: "Dr. Sarah Olatunji", specialization: "General Medicine", bio: "Primary care expert with 10+ years in community health." },
      { name: "Dr. Michael Chen", specialization: "General Medicine", bio: "Holistic approach to health and lifestyle management." },
      { name: "Dr. Fatima Yusuf", specialization: "General Medicine", bio: "Dedicated to providing accessible healthcare for all families." },
      { name: "Dr. David Okafor", specialization: "General Medicine", bio: "Specialist in chronic disease management and geriatrics." },
      { name: "Dr. Lisa Wong", specialization: "General Medicine", bio: "Expert in infectious diseases and travel medicine." },

      // Cardiology
      { name: "Dr. Jane Smith", specialization: "Cardiology", bio: "Board-certified cardiologist specializing in heart failure." },
      { name: "Dr. John Doe", specialization: "Cardiology", bio: "Expert in interventional cardiology and cardiac imaging." },
      { name: "Dr. Robert Miller", specialization: "Cardiology", bio: "Specialist in heart rhythm disorders and electrophysiology." },
      { name: "Dr. Emily Davis", specialization: "Cardiology", bio: "Focused on pediatric cardiology and congenital heart diseases." },
      { name: "Dr. James Wilson", specialization: "Cardiology", bio: "Leading researcher in preventive cardiology and hypertension." },
      { name: "Dr. Maria Garcia", specialization: "Cardiology", bio: "Expert in valvular heart disease and echocardiography." },

      // Pediatrics
      { name: "Dr. Amaka Okafor", specialization: "Pediatrics", bio: "Compassionate pediatrician with a focus on neonatal care." },
      { name: "Dr. Kevin Adams", specialization: "Pediatrics", bio: "Specialist in child development and behavioral pediatrics." },
      { name: "Dr. Sophia Lee", specialization: "Pediatrics", bio: "Expert in pediatric nutrition and childhood obesity." },
      { name: "Dr. Brian Taylor", specialization: "Pediatrics", bio: "Focused on pediatric emergency medicine and acute care." },
      { name: "Dr. Chloe Martin", specialization: "Pediatrics", bio: "Specialist in pediatric allergy and immunology." },
      { name: "Dr. Daniel Brown", specialization: "Pediatrics", bio: "Dedicated to adolescent medicine and mental health." },

      // Dermatology
      { name: "Dr. Victor Hugo", specialization: "Dermatology", bio: "Expert in clinical and aesthetic dermatology." },
      { name: "Dr. Elena Rossi", specialization: "Dermatology", bio: "Specialist in skin cancer detection and dermatosurgery." },
      { name: "Dr. Liam Murphy", specialization: "Dermatology", bio: "Focused on inflammatory skin conditions like eczema and psoriasis." },
      { name: "Dr. Isabella Silva", specialization: "Dermatology", bio: "Expert in pediatric dermatology and rare skin disorders." },
      { name: "Dr. Noah Patel", specialization: "Dermatology", bio: "Specialist in laser therapy and cosmetic dermatology." },
      { name: "Dr. Mia Lopez", specialization: "Dermatology", bio: "Focused on hair and nail disorders and trichology." },

      // Neurology
      { name: "Dr. Alan Grant", specialization: "Neurology", bio: "Specialist in neurological disorders and stroke recovery." },
      { name: "Dr. Rachel Green", specialization: "Neurology", bio: "Expert in headache management and migraine therapy." },
      { name: "Dr. Steven Strange", specialization: "Neurology", bio: "Focused on epilepsy research and neuro-rehabilitation." },
      { name: "Dr. Grace Hopper", specialization: "Neurology", bio: "Specialist in neuromuscular disorders and ALS care." },
      { name: "Dr. Isaac Newton", specialization: "Neurology", bio: "Expert in movement disorders and Parkinson's disease." },
      { name: "Dr. Marie Curie", specialization: "Neurology", bio: "Focused on neuro-oncology and brain tumor therapy." },

      // Psychiatry
      { name: "Dr. Sigmund Freud", specialization: "Psychiatry", bio: "Expert in psychodynamic therapy and mental health." },
      { name: "Dr. Carl Jung", specialization: "Psychiatry", bio: "Specialist in analytical psychology and personality disorders." },
      { name: "Dr. Alfred Adler", specialization: "Psychiatry", bio: "Focused on individual psychology and social interest." },
      { name: "Dr. Karen Horney", specialization: "Psychiatry", bio: "Expert in neurosis and feminine psychology." },
      { name: "Dr. Erik Erikson", specialization: "Psychiatry", bio: "Specialist in psychosocial development and identity." },
      { name: "Dr. Anna Freud", specialization: "Psychiatry", bio: "Focused on child analysis and ego psychology." }
    ];

    for (const d of specialistsData) {
      const email = d.name.toLowerCase().replace(/\s/g, '.') + "@mediconnect.com";
      const user = jsonDb.create('users', {
        name: d.name,
        email,
        password: hashedPassword,
        role: 'specialist',
        isVerified: true,
        bvn: '22212345678'
      });

      const specialist = jsonDb.create('specialists', {
        userId: user.id,
        specialization: d.specialization,
        bio: d.bio,
        consultationFee: Math.floor(Math.random() * 5000) + 5000,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1)
      });

      // Create Slots
      const now = new Date();
      for (let i = 1; i <= 4; i++) {
        const startTime = new Date(now);
        startTime.setDate(now.getDate() + i);
        startTime.setHours(9 + i, 0, 0, 0);
        
        jsonDb.create('slots', {
          specialistId: specialist.id,
          startTime: startTime.toISOString(),
          isBooked: false
        });
      }
    }

    // Add one Test Patient
    await jsonDb.create('users', {
        name: "Test Patient",
        email: "patient@example.com",
        password: hashedPassword,
        role: "patient"
    });

    console.log('Seed data created successfully! 36 specialists and 1 test patient added.');
  } catch (err) {
    console.error(err);
  }
};

seedData();
