import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// Almacenamiento en memoria para modo demo
const demoUsers: any[] = [];

@Injectable()
export class AuthService {
  private supabase;
  private useMockData = false;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY') || '';

    // Usar datos mock si no hay configuración de Supabase
    if (!supabaseUrl || supabaseUrl.includes('demo')) {
      this.useMockData = true;
      console.log('⚠️  Usando autenticación de demostración (en memoria)');
      this.initDemoUsers();
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  private async initDemoUsers() {
    // Crear usuarios de prueba
    const demoPassword = await bcrypt.hash('123456', 10);
    
    demoUsers.push({
      id: '1',
      email: 'admin@sabuesos.com',
      password: demoPassword,
      name: 'Administrador',
      role: 'ADMIN',
    });

    demoUsers.push({
      id: '2',
      email: 'usuario@sabuesos.com',
      password: demoPassword,
      name: 'Usuario Demo',
      role: 'USER',
    });

    console.log('✅ Usuarios demo creados:');
    console.log('   - admin@sabuesos.com / 123456');
    console.log('   - usuario@sabuesos.com / 123456');
  }

  async register(email: string, password: string, name: string) {
    if (this.useMockData) {
      // Verificar si el usuario ya existe
      const existingUser = demoUsers.find((u) => u.email === email);
      if (existingUser) {
        throw new UnauthorizedException('El email ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: String(demoUsers.length + 1),
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      };

      demoUsers.push(newUser);
      console.log('✅ [DEMO] Usuario registrado:', email);

      return this.generateToken(newUser);
    }

    if (!this.supabase) throw new Error('Database not configured');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await this.supabase
      .from('users')
      .insert([{ email, password: hashedPassword, name, role: 'USER' }])
      .select()
      .single();

    if (error) throw new UnauthorizedException(error.message);

    return this.generateToken(data);
  }

  async login(email: string, password: string) {
    if (this.useMockData) {
      const user = demoUsers.find((u) => u.email === email);
      
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      console.log('✅ [DEMO] Login exitoso:', email);
      return this.generateToken(user);
    }

    if (!this.supabase) throw new Error('Database not configured');

    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}
