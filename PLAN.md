# Plan: Womenskillshub redesign — student LMS

Living plan for continuing the redesign. Rule: **fully implement one page — every feature and
design detail — before starting the next.** No skipped functionality, no skipped design.

## Phase 1 — Finish the course lecture player (active WIP) — ✅ DONE
Fixed: added `getLectureNotes` service + load-on-mount; corrected `LessonNotes` filter/render/edit
to DB fields (`studentModuleComponentId`, `note`); fixed `handleEditNote` optimistic field; fixed
mobile-header title (`name`); aligned type label/icon maps + `Lesson` union to the real enum.
Typecheck: no new errors (pre-existing errors are in unrelated files).


`src/pages/learners/CourseLecturePage.tsx` is structurally complete and Next.js-adapted (real
services, URL-driven navigation, `VideoPlayer` with token auth). Remaining work, diffed against the
reference `wsh-ui/src/pages/lms/LMSCoursePlayer.tsx`:

### 1a. Bugs to fix (parity-breaking) — confirmed against DB layer
Note model (`prisma/schema.prisma`): fields are `note`, `studentModuleComponentId`, `courseId`,
`userId`. Component title field is `name`. `ComponentType` enum = `video | file | spreadsheet |
word | pdf` (no `text`/`quiz`).

1. **Notes never load.** No service exists to fetch notes; `fetchLecture` never sets them, so the
   panel is always empty and badges read 0. Add `getLectureNotes(userId, courseId)` server action +
   load on the page.
2. **LessonNotes field mismatch.** Component filters by `n.lessonId` and renders `note.content`, but
   notes carry `studentModuleComponentId` and `note`. Fix filter/render/edit-seed. (LessonNotes.tsx)
3. **Edit-note doesn't update UI.** `handleEditNote` writes `{ ...note, content }`; field is `note`.
4. **Mobile header title blank.** Header uses `currentComponent?.title`; correct DB field is `name`
   (the `<h1>` already uses `.name` correctly). Also add `file` to type label/icon maps.

### 1b. Lesson-type renderers — NO WORK NEEDED
The `wsh-ui` reference had `text`/`quiz` types, but the production `ComponentType` enum has only
`video | file | spreadsheet | word | pdf`. The current player already renders all five (video
player; download card for file/pdf; download card for word/spreadsheet). Dropped from scope.

### 1c. Intentional deltas to keep
- PDF/file shows a download card rather than inline iframe embed (deliberate).
- Fullscreen handled inside `VideoPlayer`, not a container ref.

## Phase 2 — Complete the STUDENT DASHBOARD first (per user directive) — ✅ code done
Build all missing student pages before touching website/admin.

- **My Notes** (`/learners/notes`) — ✅ list all notes across courses, search, course filter,
  edit, delete, deep-link to lecture. Service: `getAllUserNotes`.
- **Certificates** (`/learners/certificates`) — ✅ lists completed courses; generates a real
  downloadable certificate client-side (`src/utils/certificate.ts`, canvas → PNG).
- **My Reviews** (`/learners/reviews`) — ✅ full CRUD + star rating + anonymous + multiple image
  upload (Cloudinary). Services: `src/services/student/review.ts`.
- Re-enabled the three nav items in `learners/layout.tsx`. Added url constants.
- Audited existing pages (Dashboard, My Courses, Payments, Profile): all real, no stubs.

### ⚠️ ONE STEP LEFT — DB migration (touches the live/shared backend)
Added `images String[]` to `StudentReview` + migration file
`prisma/migrations/20260721000000_add_images_to_student_review/`. Prisma client is regenerated,
so ALL `StudentReview` queries now expect the `images` column. **The migration must be applied
(`npx prisma migrate deploy`) or existing review features break too.** Left unapplied pending
user confirmation since it hits the live DB.

## Phase 3 — Website pages — ✅ code done
- **Public Course Detail** (`/courses/[slug]`) — the missing enroll entry point (course cards
  previously 404'd). Wired to `singleCourseWebsite` (now includes category + rating aggregate),
  cart-based enroll, real preview video/description, sticky sidebar, floating buy bar.
- **CourseReviews** component rewired from mock `@/data/reviews` to real `courseReviews(courseId)`
  with pagination + infinite scroll.
- **Terms & Conditions** (`/terms-and-conditions`) — was an empty route folder; built with the
  authoritative production legal content in the redesign's policy-page style.
- **Blog** (`/blog`) + **BlogPost** (`/blog/[slug]`) — ported from reference using static
  `src/data/blog.ts`; BlogPost "Recommended Courses" pulls real courses via `homepageCourses`.
- **Change Password** (`/change-password?token=&email=`) — token reset page matching the reset
  email link; wired to `changePassword(email, token, newPassword)`; invalid-link + success states.
- Reachability fixes: re-enabled Blog in the Navbar; fixed Footer Contact link (`/contact` →
  `/contact-us`) and pointed Blog/Contact at url constants.

Typecheck after each page: no new errors (still only the same 9 pre-existing, unrelated).

## Phase 5 — Coupons (code done)
- **Schema**: `Coupon` already existed (code, maxUse, totalUsed, isFixedAmount, discountAmount,
  start/end, isActive); added nullable `courseId` + relation (null = cart-wide, set = course-scoped)
  + migration `20260721020000_add_course_scope_to_coupon`.
- **Services**: admin `coupon.ts` (create/fetch/update/delete); website `coupon.ts`
  (`validateCoupon` enforcing active/date-window/maxUse/scope, `recordCouponUsage`). Zod
  `CreateCouponValidation`.
- **Admin Coupons** (`/admin/coupons`) — list + create/edit (code, label, scope all-cart/specific-
  course, fixed ₦/percentage, amount, max uses, start/end dates, active) + delete. Nav item added.
- **Cart** — replaced the mock `validCoupons` with real `validateCoupon`; real discount math
  (fixed/percentage × course/cart scope), applied to the charged total; conflict rules kept
  (one cart-wide + one per course); `recordCouponUsage` fires on successful payment (both gateways).
- Scope/basis: course-scoped discount applies to that course's price; cart-wide applies to the
  cart subtotal. Percentage capped, discount capped at subtotal.
- ⚠️ Migration #3 to apply: `add_course_scope_to_coupon` (with the other two pending migrations).

## Phase 4 — Admin surface (in progress)
Full admin services already exist (`src/services/admin/*`); no UI existed. Building it out.

- ✅ **Admin foundation** — `/admin` route-group layout (sidebar nav, mobile drawer, Shield
  branding), `RequireAdmin` role guard (redirects non-admins), `AdminHeader`, `/admin` → dashboard
  redirect, `adminAnalyticsUrl` constant.
- ✅ **Admin Dashboard** (`/admin/dashboard`) — real stats (enrolled students, revenue, courses,
  transactions), Top-Selling-Courses chart (recharts, real `topSalesCourses`), recent transactions
  + recent students. Dropped the reference's mock growth %/revenue-trend.
- ✅ **Admin Courses** (`/admin/courses`) — list + search + status filter + summary; full
  create/edit dialog (all Course fields, thumbnail/banner upload, rich-text description +
  whoIsCourseFor via `react-quill-new`); publish/unpublish + delete. Wired to fetchAllCourses/
  createCourse/updateCourse/deleteCourse. Also updated public CourseDetail to render description/
  whoIsCourseFor as HTML (matches rich-text + existing production data).
- ✅ **Admin Categories** (`/admin/categories`) — add/edit/delete wired to category services
  (needed for the course form's category select; nav item I added).
- ✅ **Admin Course Content** (`/admin/courses/[id]/content`) — modules + components CRUD wired to
  course_module + module_component services; TinyMCE descriptions; per-lesson Bunny folder field.
- ✅ **Admin Students** (`/admin/students`) — list, search, status filter, bulk select + bulk
  enroll, CSV export, per-student enroll + view-courses. Wired to getAllStudents /
  assignCourseToStudent / fetchActiveCourses. (Dropped Send-Email + Suspend — no backing service.)
- ✅ **Admin Student Courses** (`/admin/students/[id]/courses`) — real per-course progress
  (courseProgress), unenroll (removeStudentFromCourse), enroll-more.
- ✅ **Admin Reviews** (`/admin/reviews`) — reply / approve+publish / ignore+hide wired to the
  moderation services. (No admin delete service exists → delete omitted.)
- ✅ **Admin Finances** (`/admin/earnings`) — real transactions table (getSalesData) + revenue
  summary + search/status/method filters.
- ✅ **Admin Analytics** (`/admin/analytics`) — honest real-data version (stats, top-selling-course
  revenue bar + revenue-share pie + top-courses table). Dropped the reference's mock monthly
  trends / completion rates (no aggregation services exist — avoided fabricating).

### Rich text + Bunny changes (this phase)
- Rich text switched to **TinyMCE** (ported from live `TextEditor`, `NEXT_PUBLIC_TINYMCE_KEY`).
- **Bunny per-folder**: `signVideoUrl` takes an optional library override (blank → default env
  library); optional per-lesson `bunnyLibraryId` added to both component models (+ migration),
  wired through validation/services/populate/token+preview routes. Collections need no URL change,
  so existing videos are backward compatible by leaving it blank.

### ⚠️ Migration #2 to apply (with the reviews-images one)
`prisma/migrations/20260721010000_add_bunny_library_id_to_components/` — run `prisma migrate
deploy` before component queries work at runtime.

## Out of scope (separate track)
Website extras (Blog/BlogPost, Terms, ResetPassword) and the entire admin surface.

## Open questions
- (a) PDF download-card vs inline embed — confirm final design.
- (b) `quiz` type — real quiz in production, or is "mark complete" the placeholder?
