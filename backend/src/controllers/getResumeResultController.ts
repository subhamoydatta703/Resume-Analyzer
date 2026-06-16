import type { Request, Response } from "express";
import { getResumeResultService } from "../services/getResumeService";

export const getResumeController = async(req: Request, res: Response)=>{
    try {
        if (!req.params.id) {
            throw new Error("Invalid or missing file ID");
        }
        const resumeID = req.params.id as string;
        const resumeRes = await  getResumeResultService(resumeID);
        console.log("extracteddata comes from get resume controller: ",JSON.stringify(resumeRes, null,2))
        return res.status(200).json({
            success: true,
            message: "Resume analysis result retrieved successfully",
            resumeRes,
        })
    } catch (error) {
        console.error("Error in getResumeController function: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in getResumeController function",
        });
    }
}