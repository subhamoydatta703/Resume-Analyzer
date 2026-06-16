import { prisma } from "../config/db";


export const getResumeResultService = async(resumeID: string) => {
    const file = await prisma.resume.findUnique({
        where: { id: resumeID },
        select: { 
            status: true,
            analysisResult: true,
        },
    });
    if (!file) {
        throw new Error("File not found");
    }
    return file;
}