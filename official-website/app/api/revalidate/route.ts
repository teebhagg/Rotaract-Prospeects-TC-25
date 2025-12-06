import {revalidatePath, revalidateTag} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')

  // Verify the secret token
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({message: 'Invalid secret'}, {status: 401})
  }

  try {
    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({revalidated: true, tag})
    }

    // Revalidate all pages
    revalidatePath('/', 'layout')
    return NextResponse.json({revalidated: true, now: Date.now()})
  } catch (err) {
    return NextResponse.json(
      {message: 'Error revalidating', error: err},
      {status: 500}
    )
  }
}

