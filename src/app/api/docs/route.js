import swaggerSpec from '@/utils/swagger'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(swaggerSpec)
}