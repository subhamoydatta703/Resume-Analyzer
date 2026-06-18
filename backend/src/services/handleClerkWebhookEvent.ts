import { prisma } from "../config/db";

export const handleClerkWebhookEvent = async (type: string, data: any) => {
    try {
        switch (type) {
            case "user.created": {
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
                break;
            case "user.deleted": {
                const clerkUserId = data.id;
                await prisma.user.deleteMany({
                    where: {
                        id: clerkUserId,
                    },
                });
                console.log("User deleted event received, id: ", clerkUserId);
            }
                break;
            case "user.updated": {
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
                console.log("User updated event received, id: ", clerkUserId, " email: ", email);
            }
                break;
            default:
                console.log(`Unhandled Clerk event: ${type}`);
        }


    } catch (error) {
        console.error("Error handling webhook event in service:", error);
        throw error;
    }

}