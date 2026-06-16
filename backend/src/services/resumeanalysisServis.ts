
import { prisma } from "../config/db";
import { getFilePathFromDB } from "../services/uploadResumeServive";
import { extractPDFText } from "../utils/pdfParser";
import { analyzeWithGemini } from "./geminiService";
export const analyzeThisResume = async (thisFileID: string) => {
    try {
        const filePath: string | null = await getFilePathFromDB(thisFileID);
        if (!filePath) {
            throw new Error('File not found');
        }
        const resume = await prisma.resume.findUnique({
            where: { id: thisFileID },
            // select: { status: true, analysisResult: true }
        });
        if (resume && resume.status === "COMPLETED" && resume.analysisResult) {
            return typeof resume.analysisResult === "string"
                ? resume.analysisResult
                : JSON.stringify(resume.analysisResult);
        }
        const extractedData = await extractPDFText(filePath);
        const analyzedData = await analyzeWithGemini(extractedData);
        const parsedAnalysis = JSON.parse(analyzedData);
        await prisma.resume.update({
            where: {
                id: thisFileID,
            },
            data: {
                status: "COMPLETED",
                analysisResult: parsedAnalysis,
            },
        });


        return analyzedData;

    } catch (error) {
        console.log("Error in analyzeThisResume function: ", error);

        await prisma.resume.update({
            where: { id: thisFileID },
            data: {
                status: "FAILED",
            },
        });
        throw error;
    }
}



