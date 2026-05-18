import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-mock')
  async login(@Body() body: any) {
    return { success: true, message: 'Auth scaffolded successfully' };
  }
}
