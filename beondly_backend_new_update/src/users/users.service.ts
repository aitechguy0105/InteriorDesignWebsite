import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRefreshDto } from './dto/update-refresh.dto';
import { VerifyemailDto } from './dto/verifyemail.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { ResetpasswordDto } from 'src/auth/dto/resetpassword.dto';
import { UserEntity } from './entities/user.entity';
import { PaginateUserDto } from './dto/paginate-user.dto';
import { contains } from 'class-validator';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return new UserEntity(await this.prisma.user.findUnique({ where: { id } }));
  }

  async findByUserEmail(email: string) {
    return new UserEntity(
      await this.prisma.user.findUnique({ where: { email } }),
    );
  }

  async userLogin(email: string) {
    await this.prisma.user.update({
      where: { email },
      data: {
        lastlogindate: new Date(),
      },
    });
  }

  async updatePass(
    id: number,
    createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: createUserDto });
  }

  async updateAvatar(
    id: number,
    updateAvatarDto: UpdateAvatarDto,
  ): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: updateAvatarDto });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async updateToken(id: number, updaterefreshDto: UpdateRefreshDto) {
    return this.prisma.user.update({ where: { id }, data: updaterefreshDto });
  }

  async updateVerifyToken(id: number, verifyTokenDto: VerifyTokenDto) {
    return this.prisma.user.update({ where: { id }, data: verifyTokenDto });
  }

  async verifyemail(id: number, verifyemailDto: VerifyemailDto) {
    return this.prisma.user.update({ where: { id }, data: verifyemailDto });
  }

  async resetPassword(id: number, resetpasswordDto: ResetpasswordDto) {
    return this.prisma.user.update({ where: { id }, data: resetpasswordDto });
  }

  async count() {
    return await this.prisma.user.count({
      select: {
        _all: true, // Count all records
        email: true, // Count all non-null field values
      },
    });
  }

  async paginate(paginateUserDto: PaginateUserDto) {
    return await this.prisma.user.findMany({
      skip: paginateUserDto.skip,
      take: paginateUserDto.take,
      orderBy: {
        [paginateUserDto.orderBy]: paginateUserDto.order,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
