"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/db";
import { ClientPageRoot } from "next/dist/client/components/client-page";

export const createPost = async (formData: FormData) => {
  try {
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    console.log(title, body);
    await prisma.post.create({
      data: {
        title,
        body,
        author: {
          connect: {
            email: "john.doe@example.com",
          },
        },
      },
    });
    revalidatePath("/posts");
  } catch (error) {
    console.error("Error creating post:", error);
  }
};
