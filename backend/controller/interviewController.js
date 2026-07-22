const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');
const { askAi } = require('../services/openRouterService.js');


const analyzeResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    filePath = req.file.path;
    

    const filebuffer = await fs.promises.readFile(filePath);
    const fileContent = new Uint8Array(filebuffer);

    const pdf = await pdfjsLib.getDocument({ data: fileContent }).promise;
    console.log(`PDF loaded with ${pdf.numPages} page(s).`);

    let resumetext = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      resumetext += pageText + ' ';
    }

    resumetext = resumetext.replace(/\s+/g, ' ').trim();

    const prompt = [
      {
        role: 'system',
        content: `You are an expert resume parser. Extract candidate details from the provided resume text.
Return ONLY a raw JSON object with no Markdown formatting or backticks:
{
  "role": "extracted primary role or job title",
  "experience": "years or description of experience",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`,
      },
      {
        role: 'user',
        content: `Resume Content:\n${resumetext}`,
      },
    ];

    const responseText = await askAi(prompt);

    let parsedResponse = {};
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      throw new Error('AI response was not in expected JSON format.');
    }

    // Clean up file safely
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    return res.status(200).json({
      role: parsedResponse.role || '',
      experience: parsedResponse.experience || '',
      projects: parsedResponse.projects || [],
      skills: parsedResponse.skills || [],
      resumeText: resumetext,
    });
  } catch (err) {
    console.error('Error analyzing resume:', err);

    // Clean up temporary file on failure
    if (filePath && fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (cleanupErr) {
        console.error('Failed to clean up file:', cleanupErr);
      }
    }

    return res.status(500).json({
      message: `Error analyzing resume: ${err.message}`,
    });
  }
};

module.exports = { analyzeResume };