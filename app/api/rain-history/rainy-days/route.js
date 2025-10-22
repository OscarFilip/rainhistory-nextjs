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

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      );
    }

    const data = await getRainyDays(lat, lon);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in rain history API:', error);
    
    // Handle specific error types
    if (error.message === 'No weather stations available') {
      return NextResponse.json(
        { error: 'No weather stations available' },
        { status: 500 }
      );
    }
    
    if (error.message === 'No nearby weather station found') {
      return NextResponse.json(
        { error: 'No nearby weather station found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}