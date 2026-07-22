export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  course: string;
  courseSlug: string;
  comment: string;
}

export const reviews: Review[] = [
  { id: "1", name: "Amina Okafor", avatar: "AO", rating: 5, date: "2026-02-15", course: "Cake Baking Masterclass", courseSlug: "cake-baking-masterclass", comment: "This course completely changed my baking skills! The step-by-step instructions were so easy to follow, and I've already started taking orders from friends and family." },
  { id: "2", name: "Blessing Eze", avatar: "BE", rating: 5, date: "2026-02-10", course: "Mocktail Making", courseSlug: "mocktail-making", comment: "I loved every moment of this course. The recipes are creative and the business tips helped me launch my own mocktail service at events." },
  { id: "3", name: "Chidinma Nwosu", avatar: "CN", rating: 4, date: "2026-01-28", course: "Paper Craft & Gift Wrapping", courseSlug: "paper-craft-gift-wrapping", comment: "Very detailed and practical. I wish there were more advanced techniques, but overall a fantastic introduction to paper crafts." },
  { id: "4", name: "Fatima Bello", avatar: "FB", rating: 5, date: "2026-01-22", course: "Skincare Formulation", courseSlug: "skincare-formulation", comment: "The skincare formulation course is gold! I now make and sell my own products. The raw material sourcing guide was incredibly helpful." },
  { id: "5", name: "Grace Adeyemi", avatar: "GA", rating: 5, date: "2026-01-15", course: "Cake Baking Masterclass", courseSlug: "cake-baking-masterclass", comment: "Professional quality content. The instructor explains everything so clearly. My cakes now look like they came from a professional bakery!" },
  { id: "6", name: "Halima Yusuf", avatar: "HY", rating: 4, date: "2026-01-10", course: "Mocktail Making", courseSlug: "mocktail-making", comment: "Great course with amazing recipes. The presentation tips were a game-changer for my catering business." },
  { id: "7", name: "Ifeoma Chukwu", avatar: "IC", rating: 5, date: "2025-12-28", course: "Digital Marketing", courseSlug: "digital-marketing", comment: "This course gave me the confidence to manage social media for small businesses. Already landed two clients!" },
  { id: "8", name: "Joy Adekunle", avatar: "JA", rating: 5, date: "2025-12-20", course: "Beverage Production", courseSlug: "beverage-production", comment: "Absolutely worth every penny. I learned how to produce and package beverages professionally. The costing module was eye-opening." },
  { id: "9", name: "Kemi Oladipo", avatar: "KO", rating: 4, date: "2025-12-15", course: "Paper Craft & Gift Wrapping", courseSlug: "paper-craft-gift-wrapping", comment: "Fun and creative course! My gift wrapping skills have improved tremendously. Clients are always impressed now." },
  { id: "10", name: "Lola Bamidele", avatar: "LB", rating: 5, date: "2025-12-08", course: "Cake Baking Masterclass", courseSlug: "cake-baking-masterclass", comment: "The best investment I've made in myself. The business tips section alone is worth the entire course fee." },
  { id: "11", name: "Maryam Abdullahi", avatar: "MA", rating: 5, date: "2025-12-01", course: "Skincare Formulation", courseSlug: "skincare-formulation", comment: "Comprehensive and well-structured. I went from zero knowledge to confidently making my own skincare line in weeks." },
  { id: "12", name: "Ngozi Ibe", avatar: "NI", rating: 4, date: "2025-11-25", course: "Mocktail Making", courseSlug: "mocktail-making", comment: "Loved the variety of recipes. The instructor's energy is contagious and makes learning fun." },
  { id: "13", name: "Omolara Akin", avatar: "OA", rating: 5, date: "2025-11-18", course: "Digital Marketing", courseSlug: "digital-marketing", comment: "Perfect for beginners! I now understand SEO, content marketing, and social media strategy. Highly recommend." },
  { id: "14", name: "Patricia Udo", avatar: "PU", rating: 5, date: "2025-11-10", course: "Beverage Production", courseSlug: "beverage-production", comment: "This course is a goldmine for anyone wanting to start a beverage business. The practical demonstrations are top-notch." },
  { id: "15", name: "Queen Emeka", avatar: "QE", rating: 4, date: "2025-11-05", course: "Cake Baking Masterclass", courseSlug: "cake-baking-masterclass", comment: "Very informative course. I especially loved the decoration techniques. Would love a part 2!" },
  { id: "16", name: "Rashidat Lawal", avatar: "RL", rating: 5, date: "2025-10-28", course: "Skincare Formulation", courseSlug: "skincare-formulation", comment: "Changed my life! I quit my 9-5 and now run a successful skincare brand. Thank you Women Skills Hub!" },
  { id: "17", name: "Sarah Obi", avatar: "SO", rating: 5, date: "2025-10-20", course: "Paper Craft & Gift Wrapping", courseSlug: "paper-craft-gift-wrapping", comment: "Such a relaxing and rewarding course. I make beautiful handmade cards and gift boxes now. My friends are amazed!" },
  { id: "18", name: "Toyin Fashola", avatar: "TF", rating: 4, date: "2025-10-15", course: "Mocktail Making", courseSlug: "mocktail-making", comment: "Good content and well-paced. I now offer mocktail packages for birthdays and weddings." },
  { id: "19", name: "Uju Okonkwo", avatar: "UO", rating: 5, date: "2025-10-08", course: "Digital Marketing", courseSlug: "digital-marketing", comment: "The hands-on approach makes this course stand out. I built my first ad campaign during the course!" },
  { id: "20", name: "Victoria Nnamdi", avatar: "VN", rating: 5, date: "2025-10-01", course: "Beverage Production", courseSlug: "beverage-production", comment: "Excellent course material. The instructor is very knowledgeable and supportive. Highly recommended for aspiring entrepreneurs." },
];
