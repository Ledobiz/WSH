export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive" | "suspended";
}

export interface AdminTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  currency: string;
  paymentMethod: "Flutterwave" | "Paystack" | "Bank Transfer" | "Manual";
  status: "successful" | "pending" | "failed" | "refunded";
  reference: string;
  date: string;
}

export interface AdminReview {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseId: string;
  rating: number;
  text: string;
  anonymous: boolean;
  images: string[];
  status: "published" | "pending" | "hidden";
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: string;
  enrolledStudents: number;
  totalRevenue: number;
  status: "published" | "draft" | "archived";
  modulesCount: number;
  lessonsCount: number;
  createdAt: string;
}

export interface CourseComponent {
  id: string;
  title: string;
  type: "video" | "pdf" | "text" | "quiz" | "assignment";
  duration?: string;
  url?: string;
  order: number;
  description?: string;
  isPrerequisite?: boolean;
  isFree?: boolean;
  isPublic?: boolean;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  components: CourseComponent[];
  duration?: string;
  description?: string;
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  totalTransactions: number;
  activeStudents: number;
  pendingReviews: number;
  revenueGrowth: number;
  studentGrowth: number;
}

export interface MonthlyData {
  month: string;
  enrollments: number;
  revenue: number;
  completions: number;
}

export const monthlyAnalytics: MonthlyData[] = [
  { month: "Oct 2025", enrollments: 45, revenue: 315000, completions: 12 },
  { month: "Nov 2025", enrollments: 62, revenue: 434000, completions: 18 },
  { month: "Dec 2025", enrollments: 78, revenue: 546000, completions: 25 },
  { month: "Jan 2026", enrollments: 95, revenue: 760000, completions: 34 },
  { month: "Feb 2026", enrollments: 110, revenue: 880000, completions: 41 },
  { month: "Mar 2026", enrollments: 128, revenue: 1024000, completions: 52 },
];

export const courseCompletionRates = [
  { course: "Ice-cream Class", enrolled: 156, completed: 89, rate: 57 },
  { course: "Mocktail Class", enrolled: 234, completed: 102, rate: 44 },
  { course: "Small Chops", enrolled: 312, completed: 198, rate: 63 },
  { course: "Liquid Soap", enrolled: 189, completed: 134, rate: 71 },
];

export const revenueByCategory = [
  { category: "Beverage Production", revenue: 2496000 },
  { category: "Nigerian Snacks", revenue: 1747200 },
  { category: "Soap & Cosmetics", revenue: 945000 },
  { category: "Baking", revenue: 0 },
];

export const courseModules: CourseModule[] = [
  {
    id: "m1", courseId: "c1", title: "Introduction to Ice-cream Making", order: 1,
    components: [
      { id: "comp1", title: "Welcome & Course Overview", type: "video", duration: "5:30", order: 1 },
      { id: "comp2", title: "Equipment & Ingredients Guide", type: "pdf", order: 2 },
      { id: "comp3", title: "Understanding Ice-cream Science", type: "text", order: 3 },
    ],
  },
  {
    id: "m2", courseId: "c1", title: "Basic Flavors & Techniques", order: 2,
    components: [
      { id: "comp4", title: "Vanilla Ice-cream Masterclass", type: "video", duration: "18:45", order: 1 },
      { id: "comp5", title: "Chocolate Variations", type: "video", duration: "22:10", order: 2 },
      { id: "comp6", title: "Flavor Recipes PDF", type: "pdf", order: 3 },
    ],
  },
  {
    id: "m3", courseId: "c1", title: "Advanced Techniques", order: 3,
    components: [
      { id: "comp7", title: "Swirl & Layering Techniques", type: "video", duration: "15:20", order: 1 },
      { id: "comp8", title: "Module Quiz", type: "quiz", order: 2 },
    ],
  },
  {
    id: "m4", courseId: "c1", title: "Business & Packaging", order: 4,
    components: [
      { id: "comp9", title: "Pricing Your Products", type: "video", duration: "12:00", order: 1 },
      { id: "comp10", title: "Packaging Guide", type: "pdf", order: 2 },
      { id: "comp11", title: "Final Assignment", type: "assignment", order: 3 },
    ],
  },
  {
    id: "m5", courseId: "c2", title: "Mocktail Fundamentals", order: 1,
    components: [
      { id: "comp12", title: "Introduction to Mocktails", type: "video", duration: "8:00", order: 1 },
      { id: "comp13", title: "Essential Tools & Ingredients", type: "pdf", order: 2 },
    ],
  },
  {
    id: "m6", courseId: "c2", title: "Classic Mocktail Recipes", order: 2,
    components: [
      { id: "comp14", title: "Virgin Mojito", type: "video", duration: "14:30", order: 1 },
      { id: "comp15", title: "Tropical Sunrise", type: "video", duration: "12:15", order: 2 },
    ],
  },
];

// Mock data
export const adminStats: AdminStats = {
  totalStudents: 1247,
  totalCourses: 12,
  totalRevenue: 8945600,
  totalTransactions: 2341,
  activeStudents: 892,
  pendingReviews: 8,
  revenueGrowth: 23.5,
  studentGrowth: 12.8,
};

export const adminStudents: AdminStudent[] = [
  { id: "s1", name: "Adaeze Okonkwo", email: "adaeze@email.com", phone: "+234 801 234 5678", enrolledCourses: ["online-mocktail-mixology-class", "online-small-chops-class"], joinDate: "2026-01-15", lastActive: "2026-03-07", status: "active" },
  { id: "s2", name: "Fatima Ibrahim", email: "fatima@email.com", phone: "+234 802 345 6789", enrolledCourses: ["commercial-ice-cream-and-milkshakes-class"], joinDate: "2026-02-01", lastActive: "2026-03-06", status: "active" },
  { id: "s3", name: "Grace Adekunle", email: "grace@email.com", phone: "+234 803 456 7890", enrolledCourses: ["online-small-chops-class", "commercial-ice-cream-and-milkshakes-class", "online-mocktail-mixology-class"], joinDate: "2025-11-20", lastActive: "2026-03-05", status: "active" },
  { id: "s4", name: "Blessing Nwosu", email: "blessing@email.com", phone: "+234 804 567 8901", enrolledCourses: ["online-mocktail-mixology-class"], joinDate: "2026-02-10", lastActive: "2026-02-28", status: "inactive" },
  { id: "s5", name: "Chidinma Eze", email: "chidinma@email.com", phone: "+234 805 678 9012", enrolledCourses: ["online-small-chops-class"], joinDate: "2026-01-05", lastActive: "2026-03-07", status: "active" },
  { id: "s6", name: "Hauwa Mohammed", email: "hauwa@email.com", phone: "+234 806 789 0123", enrolledCourses: [], joinDate: "2026-03-01", lastActive: "2026-03-01", status: "suspended" },
  { id: "s7", name: "Ifeoma Chukwu", email: "ifeoma@email.com", phone: "+234 807 890 1234", enrolledCourses: ["commercial-ice-cream-and-milkshakes-class", "online-mocktail-mixology-class"], joinDate: "2025-12-15", lastActive: "2026-03-04", status: "active" },
  { id: "s8", name: "Jumoke Adeyemi", email: "jumoke@email.com", phone: "+234 808 901 2345", enrolledCourses: ["online-small-chops-class"], joinDate: "2026-01-22", lastActive: "2026-03-07", status: "active" },
];

export const adminTransactions: AdminTransaction[] = [
  { id: "t1", studentId: "s1", studentName: "Adaeze Okonkwo", studentEmail: "adaeze@email.com", courseTitle: "Online Mocktail Mixology Class", amount: 8000, currency: "NGN", paymentMethod: "Flutterwave", status: "successful", reference: "FLW-2026030712345", date: "2026-03-07T10:30:00Z" },
  { id: "t2", studentId: "s1", studentName: "Adaeze Okonkwo", studentEmail: "adaeze@email.com", courseTitle: "Online Small Chops Class", amount: 5600, currency: "NGN", paymentMethod: "Flutterwave", status: "successful", reference: "FLW-2026030712346", date: "2026-03-07T10:30:00Z" },
  { id: "t3", studentId: "s2", studentName: "Fatima Ibrahim", studentEmail: "fatima@email.com", courseTitle: "Commercial Ice-cream And Milkshakes Class", amount: 4000, currency: "NGN", paymentMethod: "Paystack", status: "successful", reference: "PSK-2026030154321", date: "2026-03-01T14:15:00Z" },
  { id: "t4", studentId: "s3", studentName: "Grace Adekunle", studentEmail: "grace@email.com", courseTitle: "Online Small Chops Class", amount: 5600, currency: "NGN", paymentMethod: "Flutterwave", status: "successful", reference: "FLW-2025112098765", date: "2025-11-20T09:00:00Z" },
  { id: "t5", studentId: "s3", studentName: "Grace Adekunle", studentEmail: "grace@email.com", courseTitle: "Online Mocktail Mixology Class", amount: 8000, currency: "NGN", paymentMethod: "Bank Transfer", status: "successful", reference: "BT-2025122045678", date: "2025-12-20T11:30:00Z" },
  { id: "t6", studentId: "s4", studentName: "Blessing Nwosu", studentEmail: "blessing@email.com", courseTitle: "Online Mocktail Mixology Class", amount: 8000, currency: "NGN", paymentMethod: "Paystack", status: "failed", reference: "PSK-2026021067890", date: "2026-02-10T16:45:00Z" },
  { id: "t7", studentId: "s5", studentName: "Chidinma Eze", studentEmail: "chidinma@email.com", courseTitle: "Online Small Chops Class", amount: 5600, currency: "NGN", paymentMethod: "Flutterwave", status: "successful", reference: "FLW-2026010534567", date: "2026-01-05T08:20:00Z" },
  { id: "t8", studentId: "s7", studentName: "Ifeoma Chukwu", studentEmail: "ifeoma@email.com", courseTitle: "Commercial Ice-cream And Milkshakes Class", amount: 20, currency: "USD", paymentMethod: "Flutterwave", status: "successful", reference: "FLW-2025121578901", date: "2025-12-15T13:10:00Z" },
  { id: "t9", studentId: "s8", studentName: "Jumoke Adeyemi", studentEmail: "jumoke@email.com", courseTitle: "Online Small Chops Class", amount: 5600, currency: "NGN", paymentMethod: "Manual", status: "successful", reference: "MAN-2026012223456", date: "2026-01-22T10:00:00Z" },
  { id: "t10", studentId: "s3", studentName: "Grace Adekunle", studentEmail: "grace@email.com", courseTitle: "Commercial Ice-cream And Milkshakes Class", amount: 4000, currency: "NGN", paymentMethod: "Flutterwave", status: "pending", reference: "FLW-2026030589012", date: "2026-03-05T15:30:00Z" },
];

export const adminReviews: AdminReview[] = [
  { id: "r1", studentName: "Adaeze Okonkwo", studentEmail: "adaeze@email.com", courseTitle: "Online Mocktail Mixology Class", courseId: "mocktail", rating: 5, text: "Amazing course! I learned so much about creating beautiful mocktails. The instructor was very detailed.", anonymous: false, images: [], status: "published", createdAt: "2026-03-06T10:30:00Z" },
  { id: "r2", studentName: "Grace Adekunle", studentEmail: "grace@email.com", courseTitle: "Online Small Chops Class", courseId: "small-chops", rating: 4, text: "Great content! The samosa recipe was perfect. Would have loved more variations.", anonymous: false, images: [], status: "published", createdAt: "2026-03-04T14:15:00Z" },
  { id: "r3", studentName: "Anonymous", studentEmail: "chidinma@email.com", courseTitle: "Online Small Chops Class", courseId: "small-chops", rating: 3, text: "Good course but the video quality could be better in some lessons.", anonymous: true, images: [], status: "pending", createdAt: "2026-03-07T09:00:00Z" },
  { id: "r4", studentName: "Ifeoma Chukwu", studentEmail: "ifeoma@email.com", courseTitle: "Commercial Ice-cream And Milkshakes Class", courseId: "ice-cream", rating: 5, text: "This course changed my business! I now make amazing ice cream. Highly recommended!", anonymous: false, images: [], status: "published", createdAt: "2026-02-28T11:00:00Z" },
  { id: "r5", studentName: "Jumoke Adeyemi", studentEmail: "jumoke@email.com", courseTitle: "Online Small Chops Class", courseId: "small-chops", rating: 5, text: "Perfect course for beginners. Everything was explained step by step.", anonymous: false, images: [], status: "pending", createdAt: "2026-03-07T16:00:00Z" },
];

export const adminCourses: AdminCourse[] = [
  { id: "c1", slug: "commercial-ice-cream-and-milkshakes-class", title: "Commercial Ice-cream And Milkshakes Class", image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772034500/courses/thumbnails/yciaulrypsbxu5xgnfkp.png", category: "Beverage Production", price: 4000, originalPrice: 10000, currency: "NGN", enrolledStudents: 156, totalRevenue: 624000, status: "published", modulesCount: 4, lessonsCount: 10, createdAt: "2025-06-15" },
  { id: "c2", slug: "online-mocktail-mixology-class", title: "Online Mocktail Mixology Class", image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772168572/courses/thumbnails/ew0wvckyu8rpydgd7jqb.png", category: "Beverage Production", price: 8000, originalPrice: 25000, currency: "NGN", enrolledStudents: 234, totalRevenue: 1872000, status: "published", modulesCount: 4, lessonsCount: 12, createdAt: "2025-08-20" },
  { id: "c3", slug: "online-small-chops-class", title: "Online Small Chops Class", image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772117588/courses/thumbnails/vbpzdpj9qasluvieevp8.jpg", category: "Nigerian Snacks", price: 5600, originalPrice: 15000, currency: "NGN", enrolledStudents: 312, totalRevenue: 1747200, status: "published", modulesCount: 3, lessonsCount: 8, createdAt: "2025-05-10" },
  { id: "c4", slug: "online-liquid-soap-class", title: "Online Liquid Soap Class", image: "https://res.cloudinary.com/di4obaqit/image/upload/v1769424491/courses/thumbnails/jlolloqpco9cx5am8pmr.png", category: "Soap & Cosmetics", price: 5000, originalPrice: 12000, currency: "NGN", enrolledStudents: 189, totalRevenue: 945000, status: "published", modulesCount: 3, lessonsCount: 9, createdAt: "2025-07-01" },
  { id: "c5", slug: "advanced-cake-baking-class", title: "Advanced Cake Baking Class", image: "https://res.cloudinary.com/di4obaqit/image/upload/v1772034500/courses/thumbnails/yciaulrypsbxu5xgnfkp.png", category: "Baking", price: 15000, originalPrice: 35000, currency: "NGN", enrolledStudents: 0, totalRevenue: 0, status: "draft", modulesCount: 0, lessonsCount: 0, createdAt: "2026-03-05" },
];
