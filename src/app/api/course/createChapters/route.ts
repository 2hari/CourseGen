import { NextResponse } from 'next/server'
import { createChaptersSchema } from '@/validators/course'
import { ZodError } from 'zod'
import { strict_output } from '@/lib/gpt'
import { getUnsplashImage } from '@/lib/unsplash'
import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new NextResponse('unauthorised', { status: 401 })
    }

    const body = await req.json()
    const { title, units } = createChaptersSchema.parse(body)

    type outputUnits = {
      title: string
      chapters: {
        youtube_search_query: string
        chapter_title: string
      }[]
    }[]

    let output_units: outputUnits = await strict_output(
      'You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter',
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give an educational informative course in youtube.`
      ),
      {
        title: 'title of the unit',
        chapters:
          'an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object'
      }
    )

    return NextResponse.json({ output_units })
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse('invalid body', { status: 400 })
    }
    console.error(error)
  }
}
