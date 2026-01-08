import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'Por favor ingrese un email válido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(30, { message: 'El nombre de usuario no puede exceder 30 caracteres' })
  username!: string;

  @IsEmail({}, { message: 'Por favor ingrese un email válido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
  })
  password!: string;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user._id || user.id;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class AuthResponseDto {
  success!: boolean;
  token?: string;
  user?: UserResponseDto;
  message?: string;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}