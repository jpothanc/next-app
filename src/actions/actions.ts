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

export async function saveOrders(formData: FormData) {
  const ordersJson = formData.get("orders") as string;
  const orders = JSON.parse(ordersJson);

  console.log("saving new orders");

  for (const order of orders) {
    console.log(order);
  }
  try {
    const createdRows = await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });
    revalidatePath("/grid");

    return { success: true, count: createdRows.count };
  } catch (error) {
    console.error("Error saving orders:", error);
    return { success: false, error: "Failed to save orders" };
  }
}

export async function deleteOrders(orderIds: string[]) {
  console.log(`deleting ${orderIds.length} rows`);
  try {
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        orderId: {
          in: orderIds,
        },
      },
    });

    revalidatePath("/grid");

    return { success: true, count: deletedOrders.count };
  } catch (error) {
    console.error("Error deleting orders:", error);
    return { success: false, error: "Failed to delete orders" };
  }
}

export async function updateOrders(formData: FormData) {
  const ordersJson = formData.get("orders") as string;
  const orders = JSON.parse(ordersJson);
  console.log("updateOrders");

  for (const order of orders) {
    console.log(order);
  }

  try {
    const updatePromises = orders.map(
      (order: { orderId: string; [key: string]: any }) =>
        prisma.order.update({
          where: { orderId: order.orderId },
          data: {
            userId: order.userId,
            userDesk: order.userDesk,
            client: order.client,
            symbol: order.symbol,
            quantity: order.quantity,
            price: order.price,
            entity: order.entity,
            account: order.account,
            dateTime: new Date(order.dateTime),
          },
        })
    );

    const updatedOrders = await Promise.all(updatePromises);
    revalidatePath("/grid");

    return { success: true, count: updatedOrders.length };
  } catch (error) {
    console.error("Error updating orders:", error);
    return { success: false, error: "Failed to update orders" };
  }
}
