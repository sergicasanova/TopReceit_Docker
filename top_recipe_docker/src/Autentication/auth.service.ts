// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/users.entity';
// import { Repository } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async generateToken(id: number): Promise<string> {
//     const token = uuidv4();
//     const expirationDate = new Date();
//     expirationDate.setHours(expirationDate.getMonth() + 1);

//     await this.userRepository.update(id, {
//       token,
//       tokenExpiration: expirationDate,
//     });

//     return token;
//   }

//   async validateToken(token: string): Promise<boolean> {
//     const UserEntity = await this.userRepository.findOne({ where: { token } });
//     if (!UserEntity) return false;

//     const now = new Date();
//     if (UserEntity.tokenExpiration < now) {
//       await this.userRepository.update(UserEntity.id, {
//         token: null,
//         tokenExpiration: null,
//       });
//       return false;
//     }

//     return true;
//   }

//   async clearToken(id: number): Promise<void> {
//     await this.userRepository.update(id, {
//       token: null,
//       tokenExpiration: null,
//     });
//   }
// }
