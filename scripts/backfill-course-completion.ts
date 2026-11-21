/**
 * One-time backfill: flag enrollments as completed (Student.lecturesCompleted)
 * when every live lecture already has a completed record, i.e. the progress bar
 * shows 100% but the course is missing from the "Completed" tab.
 *
 * Same rules as syncCourseCompletion in src/services/student/course.ts.
 * Only ever sets the flag to true; never clears it.
 *
 *   Dry run (default, read-only):  npx tsx scripts/backfill-course-completion.ts --env .env.production
 *   Apply:                         npx tsx scripts/backfill-course-completion.ts --env .env.production --apply
 */
import { config } from "dotenv";
import { createHash } from "crypto";

const args = process.argv.slice(2);
const envFile = args.includes("--env") ? args[args.indexOf("--env") + 1] : ".env.local";
const apply = args.includes("--apply");
config({ path: envFile, override: true });

const STUCK = `
    SELECT s.id
    FROM "Student" s
    CROSS JOIN LATERAL (
        SELECT count(*)::int AS total,
               count(*) FILTER (WHERE EXISTS (
                   SELECT 1 FROM "StudentLectureRecord" r
                   WHERE r."studentModuleComponentId" = c.id
                     AND r.status = 'completed'
                     AND r."deletedAt" IS NULL
               ))::int AS done
        FROM "StudentModuleComponent" c
        JOIN "StudentModule" m ON m.id = c."studentModuleId"
        WHERE m."studentId" = s.id AND m."deletedAt" IS NULL AND c."deletedAt" IS NULL
    ) p
    WHERE s."deletedAt" IS NULL
      AND s."lecturesCompleted" = false
      AND p.total > 0
      AND p.done = p.total`;

(async () => {
    const { default: prisma } = await import("../src/lib/prisma");
    const host = new URL(process.env.DATABASE_URL!).hostname;
    console.log(`env: ${envFile}  db host fingerprint: ${createHash("sha256").update(host).digest("hex").slice(0, 10)}`);

    const stuck = await prisma.$queryRawUnsafe<{ id: string }[]>(STUCK);
    console.log(`enrollments at 100% but not flagged completed: ${stuck.length}`);

    if (!apply) {
        console.log("dry run: nothing changed (add --apply to fix them)");
    } else if (stuck.length > 0) {
        // Re-checks the condition inside the UPDATE so it only touches rows still stuck.
        const updated = await prisma.$executeRawUnsafe(
            `UPDATE "Student" SET "lecturesCompleted" = true, "updatedAt" = now() WHERE id IN (${STUCK})`,
        );
        console.log(`updated: ${updated}`);
    }
    await prisma.$disconnect();
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
