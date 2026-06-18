import { prisma } from "../config/db";

export const handleClerkWebhookEvent = async (type: string, data: any) => {
    try {

        if (type === "user.created") {
            const clerkUserId = data.id;
            const email = data.email_addresses?.[0]?.email_address;
            await prisma.user.upsert({
                where: {
                    id: clerkUserId,
                },
                update: {
                    email,
                },
                create: {
                    id: clerkUserId,
                    email,
                },
            });
            console.log("User created event received, id: ", clerkUserId, " email: ", email);
        }

    } catch (error) {
        console.error("Error handling webhook event in service:", error);
        throw error;
    }

}