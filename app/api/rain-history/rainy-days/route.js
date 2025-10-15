import { NextResponse } from 'next/server';
import { getRainyDays } from '@/lib/services/rainHistoryService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const data = await getRainyDays(parseFloat(latitude), parseFloat(longitude));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in rain history API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}