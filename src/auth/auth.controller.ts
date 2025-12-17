import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  email: string;
  password: string;
  role?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint - validates credentials and returns JWT token
   * In a real application, you would validate the user credentials against your database
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // TODO: Add your user validation logic here
    // This is just an example - you should validate against your database
    
    // Example: After validating user credentials
    const user = {
      userId: 'user123', // Get from database
      email: loginDto.email,
      role: 'user', // Get from database
    };

    const token = await this.authService.generateToken(user);
    
    return {
      access_token: token,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Register endpoint - creates new user and returns JWT token
   * In a real application, you would create the user in your database
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // TODO: Add your user creation logic here
    // This is just an example - you should:
    // 1. Hash the password
    // 2. Save user to database
    // 3. Return JWT token
    
    // Example: After creating user in database
    const user = {
      userId: 'newuser123', // Get from database after creation
      email: registerDto.email,
      role: registerDto.role || 'user',
    };

    const token = await this.authService.generateToken(user);
    
    return {
      access_token: token,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Protected endpoint example - requires valid JWT token
   */
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }

  /**
   * Refresh token endpoint - generates new JWT token from existing valid token
   */
  @UseGuards(AuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const token = await this.authService.generateToken({
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    });
    
    return {
      access_token: token,
    };
  }
}

