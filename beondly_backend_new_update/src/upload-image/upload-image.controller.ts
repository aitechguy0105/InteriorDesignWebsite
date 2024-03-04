import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  // StreamableFile,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

import { UploadImageService } from './upload-image.service';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path/posix';
import {
  createNoneMask,
  jpg2png_converter,
  mask_converter,
  readbuffer,
} from 'src/util/convert/jpg2png';
import {
  s3Service,
  s3Service_converted,
  s3Service_mask,
  s3Service_mask_converted,
  s3Service_nonemask_converted,
  s3Service_avatar
} from 'src/util/s3/s3';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';
import { UploadImageEntity } from './entities/upload-image.entity';
import { UploadNoneMaskDto } from './dto/upload-none-mask.dto';
import { UploadMaskEntity } from './entities/upload-mask.entity';
@Controller('upload-image')
@ApiTags('upload-image')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService, private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUploadImageDto: CreateUploadImageDto) {
  //   console.log(createUploadImageDto.file);
  //   return this.uploadImageService.create(createUploadImageDto);
  // }

  @Post('image')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UploadImageEntity })
  @UseInterceptors(
    FileInterceptor('myFile', {
      storage: diskStorage({
        destination: './upload/image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() myFile: Express.Multer.File) {
    let res: any;
    let createUploadImageDto: CreateUploadImageDto;

    const info = myFile.originalname.split('-');
    const authorId: number = Number(info[0]);
    const width: number = Number(info[1]);
    const height: number = Number(info[2]);

    // if (myFile.size < 380000) {
    //   res = await s3Service(myFile);
    //   console.log('goto s3', myFile);
    //   createUploadImageDto = {
    //     name: res.Key,
    //     url: res.Location,
    //     authorId: authorId,
    //   };

    //   const data = await this.uploadImageService.create(createUploadImageDto);

    //   return {
    //     id: data.id,
    //     name: data.name,
    //     url: data.url,
    //     authorId: data.authorId,
    //     createdAt: data.createdAt,
    //   };
    // } else if (myFile.size > 380000) {
    console.log('width-->', width, 'height-->', height);
    const path: string = await jpg2png_converter(myFile, width, height);
    const buffer: any = await readbuffer(path);
    console.log('-------------------------------------->>>>>>>', path);
    res = await s3Service_converted(path, myFile);
    if (res)
      createUploadImageDto = {
        name: res.Key,
        url: res.Location,
        authorId: authorId,
      };
    const data = await this.uploadImageService.create(createUploadImageDto);

    return {
      id: data.id,
      name: data.name,
      url: data.url,
      authorId: data.authorId,
      createdAt: data.createdAt,
    };
    // }
  }

  @Post('avatar')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  @UseInterceptors(
    FileInterceptor('avatarFile', {
      storage: diskStorage({
        destination: './upload/profile/avatar',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadAvatarFile(@UploadedFile() avatarFile: Express.Multer.File) {
    let res: any;
    const authorId = Number(avatarFile.originalname);
    res = await s3Service_avatar(
      `./upload/profile/avatar/${avatarFile.filename}`,
      avatarFile,
    );

    return new UserEntity(
      await this.usersService.updateAvatar(authorId, { avatar: res.Location }),
    );
  }

  @Post('mask')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UploadMaskEntity })
  @UseInterceptors(
    FileInterceptor('maskFile', {
      storage: diskStorage({
        destination: './upload/mask',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMaskFile(@UploadedFile() maskFile: Express.Multer.File) {
    let res: any;
    const authorId = Number(maskFile.originalname);
    const path: string = await mask_converter(maskFile);
    const buffer: any = await readbuffer(path);
    res = await s3Service_mask_converted(path, maskFile);
    return {
      name: maskFile.filename,
      url: res.Location,
    };
  }

  @Post('none-mask')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UploadMaskEntity })
  async uploadNoneMaskFile(@Body() uploadNoneMaskDto: UploadNoneMaskDto) {
    let res: any;
    const info: any = await createNoneMask(
      uploadNoneMaskDto.width,
      uploadNoneMaskDto.height,
    );
    const buffer: any = await readbuffer(info.path);
    res = await s3Service_nonemask_converted(info.path, info.fileName);
    return {
      name: info.fileName,
      url: res.Location,
    };
  }

  @Get()
  findAll() {
    return this.uploadImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadImageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUploadImageDto: UpdateUploadImageDto,
  ) {
    return this.uploadImageService.update(+id, updateUploadImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadImageService.remove(+id);
  }
}

export const editFileName = (req, myFile, callback) => {
  const name = myFile.originalname.split('.')[0];
  const fileExtName = extname(myFile.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  console.log('randomName', randomName);
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, myFile, callback) => {
  if (!myFile.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
