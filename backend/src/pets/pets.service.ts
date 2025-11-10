import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { mockPets } from './mock-data';

@Injectable()
export class PetsService {
  private supabase;
  private useMockData = false;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY') || '';

    // Usar datos mock si no hay configuración de Supabase
    if (!supabaseUrl || supabaseUrl.includes('demo')) {
      this.useMockData = true;
      console.log('⚠️  Usando mascotas de demostración');
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async create(petData: any, ownerId: string) {
    if (this.useMockData) {
      const newPet = {
        id: String(mockPets.length + 1),
        ...petData,
        ownerId,
        status: 'ACTIVE',
        qrCode: `QR-${petData.name.toUpperCase()}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPets.push(newPet);
      console.log('✅ [DEMO] Mascota creada:', newPet.name);
      return newPet;
    }

    if (!this.supabase) throw new Error('Database not configured');

    const { data, error } = await this.supabase
      .from('pets')
      .insert([{ ...petData, ownerId, status: 'ACTIVE' }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(ownerId?: string) {
    if (this.useMockData) {
      if (ownerId) {
        return mockPets.filter((pet) => pet.ownerId === ownerId);
      }
      return mockPets;
    }

    if (!this.supabase) throw new Error('Database not configured');

    let query = this.supabase.from('pets').select('*');
    
    if (ownerId) {
      query = query.eq('ownerId', ownerId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    if (this.useMockData) {
      const pet = mockPets.find((p) => p.id === id);
      if (!pet) throw new Error('Mascota no encontrada');
      return pet;
    }

    if (!this.supabase) throw new Error('Database not configured');

    const { data, error } = await this.supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, petData: any) {
    if (this.useMockData) {
      const index = mockPets.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Mascota no encontrada');
      
      mockPets[index] = {
        ...mockPets[index],
        ...petData,
        updatedAt: new Date(),
      };
      console.log('✅ [DEMO] Mascota actualizada:', mockPets[index].name);
      return mockPets[index];
    }

    if (!this.supabase) throw new Error('Database not configured');

    const { data, error } = await this.supabase
      .from('pets')
      .update(petData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async markAsLost(id: string) {
    return this.update(id, { status: 'LOST' });
  }
}
