import type { Plan } from "@/generated/prisma/client";

/** The signed-in user, as the shell renders them. */
export interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  /** Gates the Pro-only item types in the sidebar. */
  plan: Plan;
}
