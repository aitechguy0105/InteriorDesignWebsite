import { Injectable } from '@nestjs/common';
import { CreateGenerateImageDto } from './dto/create-generate-image.dto';
import { UpdateGenerateImageDto } from './dto/update-generate-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { MyProjectDto } from './dto/my-project.dto';
import { DownloadDto } from './dto/download.dto';
import DownloadImage from 'src/util/download/downloadImage';

@Injectable()
export class GenerateImageService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(createGenerateImageDto: CreateGenerateImageDto) {
    await this.includegenNumber(createGenerateImageDto.userId);
    return await this.prisma.generateImage.create({
      data: createGenerateImageDto,
    });
  }

  findAll() {
    return this.prisma.generateImage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 20,
    });
  }

  async findMyProject(myProjectDto: MyProjectDto) {
    return await this.prisma.generateImage.findMany({
      where: { userId: myProjectDto.userId },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 20,
    });
  }

  async findRestyleProject(myProjectDto: MyProjectDto) {
    return await this.prisma.generateImage.findMany({
      where: { userId: myProjectDto.userId, method: 'restyle' },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findStagingProject(myProjectDto: MyProjectDto) {
    return await this.prisma.generateImage.findMany({
      where: { userId: myProjectDto.userId, method: 'staging' },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMyProjectAll(myProjectDto: MyProjectDto) {
    return await this.prisma.generateImage.findMany({
      where: { userId: myProjectDto.userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findRestyleProjectAll(myProjectDto: MyProjectDto) {
    return await this.prisma.generateImage.findMany({
      where: { userId: myProjectDto.userId, method: 'restyle' },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findStagingProjectAll(myProjectDto: MyProjectDto) {
    return await this.prisma.generateImage.findMany({
      where: { userId: myProjectDto.userId, method: 'staging' },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(userId: number) {
    return this.prisma.generateImage.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 20,
    });
  }

  update(id: number, updateGenerateImageDto: UpdateGenerateImageDto) {
    return this.prisma.generateImage.update({
      where: { id },
      data: updateGenerateImageDto,
    });
  }

  remove(id: number) {
    return this.prisma.generateImage.delete({ where: { id } });
  }

  async includegenNumber(id: number) {
    const newuser = await this.prisma.user.findUnique({ where: { id } });
    const oldNumber = newuser.genNumber;
    newuser.genNumber = oldNumber + 1;
    return await this.prisma.user.update({
      where: { id },
      data: newuser,
    });
  }

  async download(downloadDto: DownloadDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: downloadDto.userId },
    });
    return await DownloadImage(downloadDto.fileurl, downloadDto.filename);
  }
}

// export class generate {
//   async generate(props: PropsGenerateImage) {
//     const { baseUrl, roomstyle, prompt } = props;

//     const bodyInfo = JSON.stringify({
//       key: process.env.STABLE_DEFISSION_API_KEY,
//       prompt: prompt + ',' + roomstyle,
//       negative_prompt:
//         '((out of frame)), ((extra fingers)),((no peaple)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime',
//       init_image: baseUrl,
//       width: '512',
//       height: '512',
//       samples: '1',
//       num_inference_steps: '30',
//       guidance_scale: 7.5,
//       safety_checker: 'yes',
//       strength: 0.7,
//       seed: null,
//       webhook: null,
//       track_id: null,
//     });
//   }
// }
