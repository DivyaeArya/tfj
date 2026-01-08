import { NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as any;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const filename = file.name || 'resume';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tmpDir = os.tmpdir();
    const tmpPath = path.join(tmpDir, `resume_${Date.now()}_${filename}`);
    fs.writeFileSync(tmpPath, buffer);

    const scriptPath = path.join(process.cwd(), 'resume.py');
    if (fs.existsSync(scriptPath)) {
      // If resume.py exists, call it with the temp path and expect JSON on stdout
      const result = spawnSync('python', [scriptPath, tmpPath], {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 60_000,
      });

      if (result.error) {
        return NextResponse.json({ error: String(result.error) }, { status: 500 });
      }

      try {
        const parsed = JSON.parse(result.stdout);
        return NextResponse.json({ parsed });
      } catch (e) {
        return NextResponse.json({ error: 'resume.py did not return valid JSON', raw: result.stdout }, { status: 500 });
      }
    }

    // Fallback: return a mock parsed result (useful for development)
    const mock = {
      job_dict: {
        github: "https://github.com/divyae-arya",
        linkedin: "https://www.linkedin.com/in/divyae-arya-9788b3332",
        college: "Indian Institute Of Technology Indore",
        branch: "Computer Science and Engineering",
        year_of_graduation: 2028,
        experiences: [
          {
            company: "Charak Center For Digital Healthcare",
            position: "Machine Learning Intern",
            duration: "May 2025 - Jul. 2025",
            description: "Developed a real-time ICU event monitoring system using YOLOv8 and integrated a Qwen-powered OCR module with PTZ camera."
          },
          {
            company: null,
            position: "Research Project",
            duration: "Aug. 2025 - Present",
            description: "Working on xBD dataset for building segmentation using U-Net and Swin Transformers and subsequent classification of disaster damage using position constrained differential attention based siamese networks"
          }
        ],
        projects: [
          {
            name: "SpeakPortrait",
            duration: "May. 2025 - Jul. 2025",
            description: "Developed an end-to-end pipeline by integrating the Zonos-v0.1 TTS model with the SadTalker facial animation core to generate realistic, audio-driven talking head videos."
          },
          {
            name: "Financial Analysis: Multi-Agent System",
            duration: "Feb. 2025 - March. 2025",
            description: "Built a stock analysis tool with agentic workflow to automate technical, fundamental and sentimental analysis."
          }
        ],
        tech_stack: [
          "Python",
          "C/C++",
          "SQL",
          "VHDL",
          "HTML/CSS/JS",
          "NumPy",
          "Pandas",
          "Scikit-learn",
          "TensorFlow",
          "PyTorch",
          "React",
          "Next.js",
          "Streamlit",
          "Git",
          "Jupyter Notebooks"
        ],
        certifications: null,
        achievements: [
          "JEE Advanced AIR 1388, 2024",
          "JEE Mains AIR 4374, 2024",
          "MHT-CET Rank 208, 2024",
          "Runner Up at AirBus Sustainablility Challenge"
        ],
        positions_of_responsibility: [
          "Coordinator, Computer Science and Engineering Student Association, IIT Indore",
          "Volunteer, Google Developer Student Club - AI/ML division, IIT Indore",
          "Volunteer, Consulting Finance and Analytics, IIT Indore",
          "Content Team, SnT Council, IIT Indore",
          "Core Member, The Debating Society, IIT Indore",
          "Member, E-cell, IIT Indore",
          "Associate, Fluxus - Marketing Team, IIT Indore"
        ],
        key_courses_taken: [
          "Maths for AI/ML",
          "Discrete Maths",
          "Linear Algebra",
          "Complex Analysis",
          "Differential Equations",
          "Computer Programming",
          "Data Structures and Algorithms",
          "Database and Information Systems",
          "Logic Design & Basic Electronics Engineering"
        ],
        cgpa: 9.38
      },
      info_dict: {
        full_name: "Divyae Arya",
        email: "divyae.aryaQ@gmail.com",
        phone: "+91-9987739052",
        location: "Indore",
        roll_no: "240001027"
      },
      new_keys_tracker: {
        job_dict: [
          "certifications",
          "achievements",
          "positions_of_responsibility",
          "key_courses_taken",
          "cgpa"
        ],
        info_dict: [
          "roll_no"
        ]
      }
    };

    return NextResponse.json({ parsed: mock });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
