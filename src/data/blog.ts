// Category options for the blog. "All" is only used by the public filter UI;
// use `blogCategoryOptions` (without "All") for the admin post form.
export const blogCategories = [
    "All",
    "Business Tips",
    "Success Stories",
    "Recipes & Tutorials",
    "Lifestyle",
    "Announcements",
];

export const blogCategoryOptions = blogCategories.filter((c) => c !== "All");
