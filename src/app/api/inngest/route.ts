import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { courseContentProvider } from "@/src/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        courseContentProvider
    ],
});