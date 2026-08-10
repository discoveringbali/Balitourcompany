const names = [
  "John D.", "Emily S.", "Michael B.", "Sarah T.", "David R.",
  "Jessica M.", "Christopher W.", "Amanda K.", "Matthew L.", "Brittany P.",
  "James C.", "Samantha H.", "Joshua F.", "Ashley G.", "Andrew V.",
  "Elizabeth N.", "Daniel Y.", "Megan Z.", "William J.", "Lauren E.",
  "Ryan A.", "Nicole O.", "Nicholas Q.", "Rachel I.", "Tyler X.",
  "Kayla U.", "Alexander S.", "Hannah D.", "Anthony P.", "Olivia M.",
  "Jonathan L.", "Victoria C.", "Christian K.", "Brianna R.", "Kevin W.",
  "Chloe G.", "Thomas H.", "Natalie B.", "Aaron F.", "Grace V.",
  "Justin N.", "Alyssa T.", "Jose Y.", "Sophia E.", "Charles J.",
  "Isabella A.", "Steven O.", "Mia Q.", "Brandon I.", "Ava X.",
  "Benjamin U.", "Madison S.", "Samuel D.", "Abigail M.", "Gregory P.",
  "Lily L.", "Patrick C.", "Emma K.", "Henry R.", "Ella W.",
  "Peter G.", "Avery H.", "Timothy B.", "Scarlett F.", "Edward V.",
  "Aria N.", "Richard T.", "Evelyn Y.", "Lucas E.", "Camila J.",
  "Mark A.", "Luna O.", "Paul Q.", "Sofia I.", "Steven X.",
  "Mila U.", "Kenneth S.", "Eleanor D.", "George P.", "Penelope M.",
  "Brian L.", "Layla C.", "Edward K.", "Riley R.", "Ronald W.",
  "Zoey G.", "Anthony H.", "Nora B.", "Kevin F.", "Lily V.",
  "Jason N.", "Eleanor T.", "Matthew Y.", "Hannah E.", "Gary J.",
  "Lillian A.", "Timothy O.", "Addison Q.", "Jose I.", "Aubrey X.",
  "Larry U.", "Ellie S.", "Jeffrey D.", "Stella P.", "Frank M.",
  "Natalie L.", "Scott C.", "Zoe K.", "Eric R.", "Leah W.",
  "Stephen G.", "Hazel H.", "Andrew B.", "Violet F.", "Raymond V.",
  "Aurora N.", "Gregory T.", "Savannah Y.", "Joshua E.", "Audrey J.",
  "Jerry A.", "Brooklyn O.", "Dennis Q.", "Bella I.", "Walter X.",
  "Claire U.", "Patrick S.", "Skylar D.", "Peter P.", "Lucy M.",
  "Marcus B.", "Liam C.", "Noah H.", "Oliver M.", "Elias W.",
  "Mateo R.", "Thiago L.", "Santiago P.", "Leonardo G.", "Diego V.",
  "Hans M.", "Lars E.", "Jens K.", "Klaus S.", "Dieter F.",
  "Marie L.", "Sophie B.", "Emma C.", "Clara W.", "Lea R.",
  "Jean P.", "Pierre M.", "Michel D.", "Alain C.", "Philippe B.",
  "Marie T.", "Camille L.", "Julie R.", "Lucie V.", "Alice G.",
  "Luca B.", "Marco R.", "Francesco E.", "Alessandro M.", "Lorenzo C.",
  "Giulia S.", "Sofia B.", "Martina M.", "Chiara G.", "Anna F.",
  "Miguel A.", "Carlos G.", "Juan M.", "Jose F.", "Antonio R.",
  "Maria C.", "Carmen L.", "Ana M.", "Isabel G.", "Laura S.",
  "Yuto S.", "Haruto T.", "Sota K.", "Yuki M.", "Riku I.",
  "Hina W.", "Yui K.", "Sakura Y.", "Mei S.", "Rio T.",
  "Wei C.", "Hao L.", "Yu Z.", "Ming W.", "Jian L.",
  "Li N.", "Fang Z.", "Min Y.", "Jing C.", "Yan L.",
  "Min-jun K.", "Ji-hoon P.", "Seo-jun L.", "Do-yoon C.", "Ye-jun J.",
  "Seo-yeon K.", "Ji-woo P.", "Ha-yoon L.", "Seo-yun C.", "Min-seo J."
];

const genericShortTemplates = [
  "Amazing experience! It was completely worth it.",
  "Highly recommended. Exploring this part of Bali was fantastic.",
  "Absolutely perfect. The guide was so knowledgeable.",
  "Great day out! Exceeded all our expectations.",
  "Five stars! The best way to see the island.",
  "Unforgettable memories. Thank you for a wonderful day.",
  "Very professional and friendly. We loved every minute.",
  "Beautiful sights and excellent service all around.",
  "Everything was organized perfectly. A must-do.",
  "Incredible value for money. The scenery was breathtaking.",
  "A flawless experience from start to finish. Highly recommend.",
  "We had the best time. Don't hesitate to book.",
  "The highlight of our trip to Bali. Truly special.",
  "Fantastic. The pace was great and it was beautiful.",
  "Top notch service. Very well put together."
];

const genericLongTemplates = [
  "We booked this for our family and it completely exceeded our expectations. The sights were breathtaking, especially in the morning light. Our guide was punctual, friendly, and shared so much local history with us. I would absolutely book this again when we return.",
  "This was our first time in Bali and taking this trip was the best decision we made. The entire day was seamless. We were picked up right on time, the vehicle was comfortable, and the places we visited left us speechless. Thank you for such an incredible day out.",
  "If you are thinking about booking this, just do it. From the moment we were picked up to the drop off, everything was handled professionally. Getting to see the local culture with an expert guide made all the difference. Five stars without a doubt.",
  "What an amazing adventure! The itinerary was packed with beautiful sights but never felt rushed. Our guide took some fantastic photos of us and knew exactly where the best spots were. We felt very well taken care of the entire time.",
  "I cannot say enough good things about our experience. The itinerary was perfectly planned, allowing us to truly experience the beauty of Bali. The guide was exceptionally knowledgeable and polite. It was a flawless day.",
  "This was the absolute highlight of our vacation. Exploring the island with a private guide made it so personal and relaxed. They accommodated all our requests and provided great recommendations for the rest of our trip.",
  "We had an absolutely fantastic time. The scenery is stunning and our driver was very safe and professional. We learned so much about the local culture and history. We highly recommend this to anyone visiting.",
  "An unforgettable experience. It was exactly as described and then some. Walking through the different locations and taking in the views was surreal. The booking process was easy and the communication was excellent throughout.",
  "Exceeded all expectations. We were looking for a high quality way to see the authentic side of Bali and this delivered perfectly. The attention to detail, the friendly service, and the sheer beauty of the places we visited made it a perfect day.",
  "A genuinely wonderful day. Having everything taken care of allowed us to relax and enjoy without any stress about navigation or timing. The guide was wonderful, the car was cool and clean, and the memories will last a lifetime."
];

const keywordPhrases = {
  waterfall: [
    "The waterfalls were absolutely breathtaking.",
    "Swimming in the waterfall was so refreshing and a perfect break from the heat.",
    "The trek down to the waterfall was totally worth it for the views.",
    "Getting to see the hidden waterfalls was magical."
  ],
  temple: [
    "The temple visits were so peaceful and spiritual.",
    "Learning about the history at the water temple was fascinating.",
    "The architecture and the history of the temples were incredible to witness.",
    "Experiencing the holy water temple was a very spiritual and unique moment."
  ],
  rice: [
    "Walking through the lush green rice terraces was like stepping into a postcard.",
    "The views of the rice fields were stunning, especially with the morning sun.",
    "We loved learning about the traditional farming at the rice terraces.",
    "The rice terraces are vast and beautifully maintained, definitely a highlight."
  ],
  monkey: [
    "Seeing the monkeys up close in the forest was hilarious and so much fun.",
    "The monkey forest was beautiful, just remember to hold onto your sunglasses!",
    "Walking through the sanctuary with the monkeys swinging around was a great experience."
  ],
  snorkeling: [
    "The snorkeling was out of this world, so many colorful fish and corals.",
    "Swimming with the manta rays was an absolute dream come true.",
    "The crystal clear water made the snorkeling incredible."
  ],
  batur: [
    "The sunrise hike up Mount Batur was challenging but the view at the top is unmatched.",
    "Watching the sunrise from the volcano was the most memorable part of our trip.",
    "Our guide for the Batur hike was so encouraging and helpful the whole way up."
  ],
  village: [
    "Visiting the traditional villages gave us such a great perspective on local life.",
    "The local village tour was incredibly authentic and heartwarming.",
    "We loved seeing how the locals live and craft their traditional goods."
  ]
};

// Helper to get random item
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper to randomly pick a date within the last year
const getRandomDate = () => {
  const end = new Date();
  const start = new Date(end.getTime() - (365 * 24 * 60 * 60 * 1000));
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

export const generateTourReviews = (tourTitle, location, count) => {
  const safeTitle = (tourTitle || '').toLowerCase();
  
  // Extract keywords based on title
  const activeKeywords = [];
  if (safeTitle.includes('waterfall')) activeKeywords.push('waterfall');
  if (safeTitle.includes('temple')) activeKeywords.push('temple');
  if (safeTitle.includes('rice')) activeKeywords.push('rice');
  if (safeTitle.includes('monkey')) activeKeywords.push('monkey');
  if (safeTitle.includes('snorkel') || safeTitle.includes('manta') || safeTitle.includes('penida')) activeKeywords.push('snorkeling');
  if (safeTitle.includes('batur') || safeTitle.includes('sunrise') || safeTitle.includes('volcano')) activeKeywords.push('batur');
  if (safeTitle.includes('village') || safeTitle.includes('culture')) activeKeywords.push('village');

  // Shuffle names to get unique names
  const shuffledNames = [...names].sort(() => 0.5 - Math.random());
  
  const reviews = [];
  const actualCount = Math.min(count, shuffledNames.length);

  for (let i = 0; i < actualCount; i++) {
    const isLong = Math.random() > 0.5;
    let comment = isLong ? getRandomItem(genericLongTemplates) : getRandomItem(genericShortTemplates);
    
    // Inject 1 or 2 keyword phrases if applicable to make it sound highly specific and natural
    if (activeKeywords.length > 0 && Math.random() > 0.3) {
       const randomKeyword = getRandomItem(activeKeywords);
       const specificPhrase = getRandomItem(keywordPhrases[randomKeyword]);
       
       if (isLong) {
         // Insert into the middle of the long review
         const sentences = comment.split('. ');
         sentences.splice(1, 0, specificPhrase);
         comment = sentences.join('. ');
       } else {
         // Prepend or append to short review
         comment = Math.random() > 0.5 ? `${specificPhrase} ${comment}` : `${comment} ${specificPhrase}`;
       }
    }

    reviews.push({
      id: Date.now().toString() + i + Math.random().toString().slice(2, 6),
      user: shuffledNames[i],
      userImage: null,
      rating: 5,
      comment: comment.trim(),
      date: getRandomDate(),
    });
  }

  // Sort by date descending
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
};
