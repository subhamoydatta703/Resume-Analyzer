import { prisma } from "../config/db";
// import { Resume } from '../../prisma/generated/browser';
import { extractPDFText } from "../utils/pdfParser";

export const createFileDB = async (existingfileName: string, existingfilePath: string, originalName: string) => {
  // Check for duplicates based on originalName
  const existingResume = await prisma.resume.findFirst({
    where: { originalName: originalName },
  });
  console.log("Checking duplicate in DB: ", existingResume);
  
  if (existingResume) {
    return { resume: existingResume };
  }
  
  const resume = await prisma.resume.create({ 
    data: { fileName: existingfileName, filePath: existingfilePath, originalName: originalName },
  });
  
  return { resume };
};



export const getFilePathFromDB = async ( fileID: string ) => {
    try {
      const file = await prisma.resume.findUnique({
          where: { id: fileID },
          select: { filePath: true },
      });
      if (!file) {
        throw new Error("File not found");
      }
      return file.filePath;
    } catch (error) {
      console.error("Error while get file path from DB in service", error);
      throw error;
    }
}

