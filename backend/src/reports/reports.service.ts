import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { mockReports } from './mock-data';

@Injectable()
export class ReportsService {
  private supabase;
  private useMockData = false;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY') || '';

    // Usar datos mock si no hay configuración de Supabase
    if (!supabaseUrl || supabaseUrl.includes('demo')) {
      this.useMockData = true;
      console.log('⚠️  Usando datos de demostración para reportes');
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async create(reportData: any, reporterId: string) {
    if (this.useMockData) {
      const newReport = {
        id: String(mockReports.length + 1),
        ...reportData,
        reporterId,
        status: 'ACTIVE',
        createdAt: new Date(),
      };
      console.log('📝 [DEMO] Reporte creado:', newReport);
      return newReport;
    }

    if (!this.supabase) throw new Error('Database not configured');

    const { data, error } = await this.supabase
      .from('reports')
      .insert([{ ...reportData, reporterId, status: 'ACTIVE' }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findNearby(latitude: number, longitude: number, radiusKm: number = 5) {
    if (this.useMockData) {
      // Filtrar reportes cercanos usando cálculo simple
      return mockReports.filter((report) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          report.location.latitude,
          report.location.longitude,
        );
        return distance <= radiusKm;
      });
    }

    if (!this.supabase) throw new Error('Database not configured');

    const { data, error } = await this.supabase.rpc('find_nearby_reports', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(filters?: any) {
    if (this.useMockData) {
      let filtered = [...mockReports];
      
      if (filters?.type) {
        filtered = filtered.filter((r) => r.type === filters.type);
      }
      if (filters?.status) {
        filtered = filtered.filter((r) => r.status === filters.status);
      }
      
      return filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (!this.supabase) throw new Error('Database not configured');

    let query = this.supabase.from('reports').select('*');

    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error } = await query.order('createdAt', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
