export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "pdf" | "document" | "spreadsheet" | "text" | "quiz";
  videoUrl?: string;
  bunnyVideoId?: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  modules: Module[];
  lastAccessed?: string;
  telegramLink?: string;
}

export interface CourseNote {
  id: string;
  courseId: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  rating: number;
  text: string;
  anonymous: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const enrolledCourses: EnrolledCourse[] = [
  {
    id: "mocktail",
    slug: "online-mocktail-mixology-class",
    title: "Online Mocktail Mixology Class",
    image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772168572/courses/thumbnails/ew0wvckyu8rpydgd7jqb.png",
    category: "Beverage Production",
    progress: 45,
    totalLessons: 12,
    completedLessons: 5,
    lastAccessed: "2026-03-07",
    modules: [
      {
        id: "m1",
        title: "Getting Started",
        lessons: [
          { id: "l1", title: "Welcome & Course Overview", duration: "5:30", type: "video", bunnyVideoId: "example-video-id-1", completed: true },
          { id: "l2", title: "Essential Tools & Equipment", duration: "8:15", type: "pdf", fileUrl: "https://example.com/tools-equipment.pdf", fileName: "Tools-Equipment-Guide.pdf", completed: true },
          { id: "l3", title: "Understanding Flavor Profiles", duration: "12:00", type: "text", content: "In this lesson, we'll explore the fundamental flavor profiles used in mocktail creation. Understanding how sweet, sour, bitter, and umami flavors interact is key to creating balanced and delicious drinks.\n\nThe five primary taste sensations are:\n\n1. **Sweet** – Sugar, honey, fruit juices, and syrups\n2. **Sour** – Citrus juices, vinegar, and fermented ingredients\n3. **Bitter** – Tonic water, certain herbs, and coffee\n4. **Salty** – A pinch of salt can enhance other flavors\n5. **Umami** – Tomato juice, mushroom broths\n\nWhen creating mocktails, balance is everything. A good mocktail typically combines 2-3 of these taste elements.", completed: true },
        ],
      },
      {
        id: "m2",
        title: "Basic Mocktail Recipes",
        lessons: [
          { id: "l4", title: "Classic Virgin Mojito", duration: "15:00", type: "video", bunnyVideoId: "example-video-id-2", completed: true },
          { id: "l5", title: "Tropical Sunrise Mocktail", duration: "12:30", type: "video", bunnyVideoId: "example-video-id-3", completed: true },
          { id: "l6", title: "Berry Bliss Spritzer", duration: "10:45", type: "video", bunnyVideoId: "example-video-id-4", completed: false },
        ],
      },
      {
        id: "m3",
        title: "Advanced Techniques",
        lessons: [
          { id: "l7", title: "Garnishing Like a Pro", duration: "18:00", type: "video", bunnyVideoId: "example-video-id-5", completed: false },
          { id: "l8", title: "Layering & Presentation", duration: "14:20", type: "document", fileUrl: "https://example.com/layering-guide.docx", fileName: "Layering-Presentation-Guide.docx", completed: false },
          { id: "l9", title: "Flavor Infusions", duration: "16:00", type: "text", content: "Learn how to create custom flavor infusions using fresh herbs, fruits, and spices. We'll cover cold infusion, hot infusion, and rapid infusion techniques.\n\n**Cold Infusion Method:**\nCombine ingredients in a sealed jar with water or simple syrup. Refrigerate for 12-24 hours. Strain and use.\n\n**Hot Infusion Method:**\nHeat your base liquid to just below boiling. Add ingredients, cover, and steep for 15-30 minutes. Strain and cool.\n\n**Rapid Infusion:**\nUsing a whipping siphon, you can infuse flavors in minutes rather than hours.", completed: false },
        ],
      },
      {
        id: "m4",
        title: "Business & Monetization",
        lessons: [
          { id: "l10", title: "Pricing Your Mocktails", duration: "10:00", type: "spreadsheet", fileUrl: "https://example.com/pricing-template.xlsx", fileName: "Mocktail-Pricing-Template.xlsx", completed: false },
          { id: "l11", title: "Marketing Your Brand", duration: "12:00", type: "text", content: "Discover effective marketing strategies specifically tailored for mocktail businesses. From social media content to local partnerships.", completed: false },
          { id: "l12", title: "Final Quiz", duration: "15:00", type: "quiz", completed: false },
        ],
      },
    ],
  },
  {
    id: "small-chops",
    slug: "online-small-chops-class",
    title: "Online Small Chops Class",
    image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772117588/courses/thumbnails/vbpzdpj9qasluvieevp8.jpg",
    category: "Nigerian Snacks",
    progress: 100,
    totalLessons: 8,
    completedLessons: 8,
    lastAccessed: "2026-03-05",
    telegramLink: "https://t.me/+example_small_chops_group",
    modules: [
      {
        id: "sc-m1",
        title: "Introduction",
        lessons: [
          { id: "sc-l1", title: "Welcome & Overview", duration: "4:00", type: "video", bunnyVideoId: "example-video-sc-1", completed: true },
          { id: "sc-l2", title: "Ingredients Sourcing", duration: "7:30", type: "pdf", fileUrl: "https://example.com/ingredients-guide.pdf", fileName: "Ingredients-Sourcing-Guide.pdf", completed: true },
        ],
      },
      {
        id: "sc-m2",
        title: "Recipes",
        lessons: [
          { id: "sc-l3", title: "Perfect Samosa", duration: "20:00", type: "video", bunnyVideoId: "example-video-sc-2", completed: true },
          { id: "sc-l4", title: "Spring Rolls Masterclass", duration: "18:00", type: "video", bunnyVideoId: "example-video-sc-3", completed: true },
          { id: "sc-l5", title: "Puff Puff Variations", duration: "15:00", type: "video", bunnyVideoId: "example-video-sc-4", completed: true },
          { id: "sc-l6", title: "Peppered Gizzard", duration: "12:00", type: "video", bunnyVideoId: "example-video-sc-5", completed: true },
        ],
      },
      {
        id: "sc-m3",
        title: "Business Setup",
        lessons: [
          { id: "sc-l7", title: "Costing & Pricing", duration: "10:00", type: "spreadsheet", fileUrl: "https://example.com/costing-template.xlsx", fileName: "Small-Chops-Costing.xlsx", completed: true },
          { id: "sc-l8", title: "Final Assessment", duration: "10:00", type: "quiz", completed: true },
        ],
      },
    ],
  },
  {
    id: "ice-cream",
    slug: "commercial-ice-cream-and-milkshakes-class",
    title: "Commercial Ice-cream And Milkshakes Class",
    image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772034500/courses/thumbnails/yciaulrypsbxu5xgnfkp.png",
    category: "Beverage Production",
    progress: 12,
    totalLessons: 10,
    completedLessons: 1,
    lastAccessed: "2026-03-01",
    modules: [
      {
        id: "ic-m1",
        title: "Foundations",
        lessons: [
          { id: "ic-l1", title: "Introduction to Ice Cream Making", duration: "6:00", type: "video", bunnyVideoId: "example-video-ic-1", completed: true },
          { id: "ic-l2", title: "Equipment Overview", duration: "8:00", type: "document", fileUrl: "https://example.com/equipment-overview.docx", fileName: "Equipment-Overview.docx", completed: false },
        ],
      },
      {
        id: "ic-m2",
        title: "Ice Cream Recipes",
        lessons: [
          { id: "ic-l3", title: "Vanilla Base Recipe", duration: "15:00", type: "video", bunnyVideoId: "example-video-ic-2", completed: false },
          { id: "ic-l4", title: "Chocolate Variations", duration: "14:00", type: "video", bunnyVideoId: "example-video-ic-3", completed: false },
          { id: "ic-l5", title: "Fruit Flavors", duration: "12:00", type: "video", bunnyVideoId: "example-video-ic-4", completed: false },
        ],
      },
      {
        id: "ic-m3",
        title: "Milkshakes",
        lessons: [
          { id: "ic-l6", title: "Classic Milkshake Techniques", duration: "10:00", type: "video", bunnyVideoId: "example-video-ic-5", completed: false },
          { id: "ic-l7", title: "Nigerian-Inspired Flavors", duration: "12:00", type: "video", bunnyVideoId: "example-video-ic-6", completed: false },
          { id: "ic-l8", title: "Presentation & Packaging", duration: "8:00", type: "pdf", fileUrl: "https://example.com/packaging-guide.pdf", fileName: "Presentation-Packaging-Guide.pdf", completed: false },
        ],
      },
      {
        id: "ic-m4",
        title: "Business",
        lessons: [
          { id: "ic-l9", title: "Starting Your Ice Cream Business", duration: "15:00", type: "video", bunnyVideoId: "example-video-ic-7", completed: false },
          { id: "ic-l10", title: "Final Quiz", duration: "10:00", type: "quiz", completed: false },
        ],
      },
    ],
  },
];

// Mock saved notes
export const savedNotes: CourseNote[] = [
  {
    id: "n1",
    courseId: "mocktail",
    lessonId: "l1",
    content: "Remember to get all the basic tools before starting. The shaker and muddler are essential!",
    createdAt: "2026-03-06T10:30:00Z",
    updatedAt: "2026-03-06T10:30:00Z",
  },
  {
    id: "n2",
    courseId: "mocktail",
    lessonId: "l3",
    content: "Sweet + sour is the most common combination. Always start with less sugar and adjust.",
    createdAt: "2026-03-06T14:15:00Z",
    updatedAt: "2026-03-06T14:15:00Z",
  },
  {
    id: "n3",
    courseId: "mocktail",
    lessonId: "l4",
    content: "The key to a good mojito is muddling the mint gently - don't tear the leaves!",
    createdAt: "2026-03-07T09:00:00Z",
    updatedAt: "2026-03-07T09:00:00Z",
  },
];

// Mock saved reviews
export const savedReviews: CourseReview[] = [];
