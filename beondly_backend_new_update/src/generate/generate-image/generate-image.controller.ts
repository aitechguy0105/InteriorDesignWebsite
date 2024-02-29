import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  StreamableFile,
} from '@nestjs/common';
import { GenerateImageService } from './generate-image.service';
import { GenerateRestyleDto } from './dto/generate-restyle.dto';
import { GenerateByPromptDto } from './dto/generate-byPrompt.dto';
import { GenerateStagingDto } from './dto/generate-staging.dto';
import { UpdateGenerateImageDto } from './dto/update-generate-image.dto';
import { MyProjectDto } from './dto/my-project.dto';
import { DownloadDto } from './dto/download.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';
import { GenerateImageEntity } from './entities/generate-image.entity';
import { DownloadImageEntity } from './entities/download-image.entity';
import { HttpService } from '@nestjs/axios/dist';
import { map, lastValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { createReadStream } from 'fs';
import { join } from 'path';
import { PathInterface } from 'src/util/download/downloadImage';
import { s3Service_download } from 'src/util/s3/s3';

@Controller('generate-image')
@ApiTags('generate-image')
export class GenerateImageController {
  constructor(
    private readonly generateImageService: GenerateImageService,
    private readonly httpService: HttpService,
  ) {}

  @Post('restyle')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async createRestyle(@Body() generateRestyleDto: GenerateRestyleDto) {
    if (generateRestyleDto.originType == 'sketch2img') {
      const bodyInfo = JSON.stringify({
        key: process.env.STABLE_DEFISSION_API_KEY,
        controlnet_model: 'scribble',
        controlnet_type: 'scribble',
        model_id: 'interiordesignsuperm',
        auto_hint: 'yes',
        guess_mode: 'no',
        prompt:
        generateRestyleDto.prompt + 'modern interior design, photorealistic image, realistic textures, real,  natural color, stylish design, ultra high resolution, 4K image',
        negative_prompt: 'sketch',
        init_image: generateRestyleDto.baseUrl,
        mask_image: null,
        width: '512',
        height: '512',
        samples: '3',
        scheduler: 'UniPCMultistepScheduler',
        num_inference_steps: '60',
        safety_checker: 'no',
        enhance_prompt: 'yes',
        guidance_scale: 7.5,
        strength: 0.85,
        lora_model: 'more_details',
        tomesd: 'yes',
        use_karras_sigmas: 'yes',
        vae: null,
        lora_strength: null,
        embeddings_model: null,
        seed: 123423,
        webhook: null,
        track_id: null,
      });
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const url = 'https://stablediffusionapi.com/api/v5/controlnet';
      // const url = 'https://modelslab.com/api/v5/controlnet';
      
      const generatedData = await lastValueFrom(
        this.httpService.post(url, bodyInfo, options).pipe(
          map((response) => {
            // console.log('response.data', response.data);
            console.log(
              'response.data.future_links',
              response.data.future_links && response.data.future_links,
            );
            console.log('response.data.output', response.data);
            if(response.data.status == "success"){
              return response.data.output;
            } else if (response.data.status == "processing"){
                return response.data.future_links;            
            }
          }),
        ),
      );

      console.log("data", generatedData);
      if (!generatedData[0]) {
        return { state: false };
      }

      const genInfo = await this.generateImageService.create({
        baseUrl: generateRestyleDto.baseUrl,
        prompt: generateRestyleDto.prompt,
        url: generatedData,
        name: uuid(),
        userId: Number(generateRestyleDto.userId),
        method: 'restyle',
      });
      return {
        genInfo,
        state: true,
      };
    } else {
      const bodyInfo = JSON.stringify({
        key: process.env.STABLE_DEFISSION_API_KEY,
        prompt:
          generateRestyleDto.prompt +
          ' ((High definition)), ((High resolution))',
        negative_prompt:
          '((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place)))',
        init_image: generateRestyleDto.baseUrl,
        width: '512',
        height: '512',
        samples: '3',
        num_inference_steps: '30',
        enhance_prompt: 'no',
        safety_checker: 'yes',
        guidance_scale: 7.7,
        strength: 0.7,
        seed: null,
        webhook: null,
        track_id: null,
        scheduler: 'DDPMScheduler',
      });

      // animefull2   hasdx    pastel-2
      // const bodyInfo = JSON.stringify({
      //   key: process.env.STABLE_DEFISSION_API_KEY,
      //   model_id: 'dvarch',
      //   prompt: generateRestyleDto.prompt,
      //   negative_prompt:
      //     '((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place)))',
      //   init_image: generateRestyleDto.baseUrl,
      //   width: '512',
      //   height: '512',
      //   samples: '3',
      //   num_inference_steps: '30',
      //   safety_checker: 'yes',
      //   enhance_prompt: 'no',
      //   guidance_scale: 7.5,
      //   strength: 0.7,
      //   scheduler: 'UniPCMultistepScheduler',
      //   seed: null,
      //   lora_model: null,
      //   tomesd: 'yes',
      //   use_karras_sigmas: 'yes',
      //   vae: null,
      //   lora_strength: null,
      //   embeddings_model: null,
      //   webhook: null,
      //   track_id: null,
      // });
      // const bodyInfo = JSON.stringify({
      //   key: process.env.STABLE_DEFISSION_API_KEY,
      //   init_image: generateRestyleDto.baseUrl,
      //   prompt: generateRestyleDto.prompt,
      //   steps: 50,
      //   guidance_scale: 7.7,
      //   scheduler: 'DDPMScheduler',
      //   samples: '3',
      // });

      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const url = 'https://stablediffusionapi.com/api/v3/img2img';
      // const url = 'https://stablediffusionapi.com/api/v5/interior';

      // const url = 'https://stablediffusionapi.com/api/v4/dreambooth/img2img';

      const generatedData = await lastValueFrom(
        this.httpService.post(url, bodyInfo, options).pipe(
          map((response) => {
            // console.log('response.data', response.data);
            console.log(
              'response.data.future_links',
              response.data.future_links && response.data.future_links,
            );
            console.log('response.data.output', response.data);
            return response.data.output;
          }),
        ),
      );

      if (!generatedData[0]) {
        return { state: false };
      }

      const genInfo = await this.generateImageService.create({
        baseUrl: generateRestyleDto.baseUrl,
        prompt: generateRestyleDto.prompt,
        url: generatedData,
        name: uuid(),
        userId: Number(generateRestyleDto.userId),
        method: 'restyle',
      });

      return {
        genInfo,
        state: true,
      };
    }
  }

  @Post('byPrompt')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async createByPrompt(@Body() generateByPromptDto: GenerateByPromptDto) {
    const bodyInfo = JSON.stringify({
      key: process.env.STABLE_DEFISSION_API_KEY,
      // eslint-disable-next-line prettier/prettier
      prompt: generateByPromptDto.prompt + '((High definition)), ((High resolution))',
      negative_prompt:
        '((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place)))',
      width: '1024',
      height: '1024',
      samples: '4',
      num_inference_steps: '30',
      enhance_prompt: 'no',
      safety_checker: 'yes',
      guidance_scale: 7.7,
      strength: 0.7,
      seed: null,
      webhook: null,
      track_id: null,
      scheduler: 'DDPMScheduler',
    });
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log('-----------------', bodyInfo);
    const url = 'https://stablediffusionapi.com/api/v3/text2img';

    const generatedData = await lastValueFrom(
      this.httpService.post(url, bodyInfo, options).pipe(
        map((response) => {
          // console.log('response.data', response.data);
          console.log(
            'response.data.future_links',
            response.data.future_links && response.data.future_links,
          );
          console.log('response.data.output', response.data);
          return response.data.output;
        }),
      ),
    );

    if (!generatedData[0]) {
      return { state: false };
    }

    const genInfo = await this.generateImageService.create({
      baseUrl: '',
      prompt: generateByPromptDto.prompt,
      url: generatedData,
      name: uuid(),
      userId: Number(generateByPromptDto.userId),
      method: 'restyle',
    });

    return {
      genInfo,
      state: true,
    };
  }

  @Post('none-mask-staging')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async createNoneMaskStaging(@Body() generateStagingDto: GenerateStagingDto) {
    const bodyInfo = JSON.stringify({
      key: process.env.STABLE_DEFISSION_API_KEY,
      prompt:
        generateStagingDto.prompt + ' ((High definition)), ((High resolution))',
      controlnet_model: 'inpaint',
      controlnet_type: 'inpaint',
      negative_prompt:
        '((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place))), (child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (((person))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy',
      // model_id: 'midjourney-v4-painta',
      multi_lingual: null,
      guidance: 7.5,
      init_image: generateStagingDto.baseUrl,
      mask_image: generateStagingDto.maskUrl,
      width: generateStagingDto.width.toString(),
      height: generateStagingDto.height.toString(),
      samples: '3',
      safety_checker: null,
      steps: 20,
      seed: 0,
      strength: null,
      webhook: null,
      track_id: null,
      scheduler: 'UniPCMultistepScheduler',
    });

    // console.log('------------------bodyInfo------------------', bodyInfo);

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'https://stablediffusionapi.com/api/v3/inpaint';

    const generatedData = await lastValueFrom(
      this.httpService.post(url, bodyInfo, options).pipe(
        map((response) => {
          console.log('response', response.data);
          return response.data.output;
        }),
      ),
    );

    console.log('-----generatedData', generatedData);

    if (!generatedData[0]) {
      return { state: false };
    }

    const genInfo = await this.generateImageService.create({
      baseUrl: generateStagingDto.baseUrl,
      prompt: generateStagingDto.prompt,
      url: generatedData,
      name: uuid(),
      userId: Number(generateStagingDto.userId),
      method: 'restyle',
    });

    return {
      genInfo,
      state: true,
    };
  }

  @Post('mask-restyle')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async createMaskRestyle(@Body() generateStagingDto: GenerateStagingDto) {
    const bodyInfo = JSON.stringify({
      key: process.env.STABLE_DEFISSION_API_KEY,
      prompt:
        generateStagingDto.prompt + ' ((High definition)), ((High resolution))',
      controlnet_model: 'inpaint',
      controlnet_type: 'inpaint',
      negative_prompt:
        '((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place))), (child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (((person))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy',
      // model_id: 'midjourney-v4-painta',
      multi_lingual: null,
      guidance: 7.5,
      init_image: generateStagingDto.baseUrl,
      mask_image: generateStagingDto.maskUrl,
      width: generateStagingDto.width.toString(),
      height: generateStagingDto.height.toString(),
      samples: '3',
      safety_checker: null,
      steps: 20,
      seed: 0,
      strength: null,
      webhook: null,
      track_id: null,
      scheduler: 'UniPCMultistepScheduler',
    });

    // console.log('------------------bodyInfo------------------', bodyInfo);

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log('Mask_restyle-----------', bodyInfo);
    const url = 'https://stablediffusionapi.com/api/v3/inpaint';

    const generatedData = await lastValueFrom(
      this.httpService.post(url, bodyInfo, options).pipe(
        map((response) => {
          console.log('response', response.data);
          return response.data.output;
        }),
      ),
    );

    console.log('-----generatedData', generatedData);

    if (!generatedData[0]) {
      return { state: false };
    }

    const genInfo = await this.generateImageService.create({
      baseUrl: generateStagingDto.baseUrl,
      prompt: generateStagingDto.prompt,
      url: generatedData,
      name: uuid(),
      userId: Number(generateStagingDto.userId),
      method: 'restyle',
    });

    return {
      genInfo,
      state: true,
    };
  }

  @Post('staging')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async createStaging(@Body() generateStagingDto: GenerateStagingDto) {
    // const bodyInfo = JSON.stringify({
    //   key: process.env.STABLE_DEFISSION_API_KEY,
    //   // model_id: 'midjourney',
    //   prompt: generateStagingDto.prompt,
    //   negative_prompt:
    //     '(child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy',
    //   init_image: generateStagingDto.baseUrl,
    //   mask_image: generateStagingDto.maskUrl,
    //   width: '512',
    //   height: '512',
    //   samples: '1',
    //   num_inference_steps: '30',
    //   safety_checker: 'no',
    //   enhance_prompt: 'no',
    //   guidance_scale: 7.5,
    //   strength: 0.7,
    //   // scheduler: 'PNDMScheduler',
    //   // lora_model: null,
    //   // tomesd: 'yes',
    //   // use_karras_sigmas: 'yes',
    //   // vae: null,
    //   // lora_strength: null,
    //   // embeddings_model: null,
    //   seed: null,
    //   webhook: null,
    //   track_id: null,
    // });

    const bodyInfo = JSON.stringify({
      key: process.env.STABLE_DEFISSION_API_KEY,
      prompt:
        generateStagingDto.prompt + ' ((High definition)), ((High resolution)), photorealistic 3D, 4k, ',
      // controlnet_model: 'inpaint',
      // controlnet_type: 'inpaint',
      negative_prompt:
        'sketch, ((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place))), (child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (((person))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy',
      // model_id: 'midjourney-v4-painta',
      multi_lingual: null,
      guidance: 7.5,
      init_image: generateStagingDto.baseUrl,
      mask_image: generateStagingDto.maskUrl,
      width: generateStagingDto.width.toString(),
      height: generateStagingDto.height.toString(),
      samples: '3',
      safety_checker: null,
      steps: 20,
      seed: 0,
      strength: null,
      webhook: null,
      track_id: null,
      scheduler: 'UniPCMultistepScheduler',
    });

    // console.log('------------------bodyInfo------------------', bodyInfo);
    console.log('Staging-----------', bodyInfo);
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'https://stablediffusionapi.com/api/v3/inpaint';

    const generatedData = await lastValueFrom(
      this.httpService.post(url, bodyInfo, options).pipe(
        map((response) => {
          console.log('response', response.data);
          return response.data.output;
        }),
      ),
    );

    console.log('-----generatedData', generatedData);

    if (!generatedData[0]) {
      return { state: false };
    }

    const genInfo = await this.generateImageService.create({
      baseUrl: generateStagingDto.baseUrl,
      prompt: generateStagingDto.prompt,
      url: generatedData,
      name: uuid(),
      userId: Number(generateStagingDto.userId),
      method: 'staging',
    });

    return {
      genInfo,
      state: true,
    };
  }

  @Post('my-project')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async findMyProject(@Body() myProjectDto: MyProjectDto) {
    return await this.generateImageService.findMyProject(myProjectDto);
  }

  @Post('get-restyle')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async findRestyleProject(@Body() myProjectDto: MyProjectDto) {
    return await this.generateImageService.findRestyleProject(myProjectDto);
  }

  @Post('get-staging')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async findStagingProject(@Body() myProjectDto: MyProjectDto) {
    return await this.generateImageService.findStagingProject(myProjectDto);
  }

  @Post('my-project-all')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async findMyProjectAll(@Body() myProjectDto: MyProjectDto) {
    return await this.generateImageService.findMyProjectAll(myProjectDto);
  }

  @Post('get-restyle-all')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async findRestyleProjectAll(@Body() myProjectDto: MyProjectDto) {
    return await this.generateImageService.findRestyleProjectAll(myProjectDto);
  }

  @Post('get-staging-all')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  async findStagingProjectAll(@Body() myProjectDto: MyProjectDto) {
    return await this.generateImageService.findStagingProjectAll(myProjectDto);
  }

  @Post('download')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DownloadImageEntity })
  async download(@Body() downloadDto: DownloadDto) {
    console.log('downloadDto', downloadDto);
    const res: PathInterface = await this.generateImageService.download(
      downloadDto,
    );

    const uploadFile = await s3Service_download(res.path, uuid());
    console.log('download--------->', uploadFile);
    return { path: uploadFile.Location, name: uploadFile.Key };

    // const file = createReadStream(join(process.cwd(), res.path));
    // return new StreamableFile(file);
  }

  @Get()
  @ApiResponse({ type: GenerateImageEntity, isArray: true })
  findAll() {
    return this.generateImageService.findAll();
  }

  @Get(':userId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GenerateImageEntity })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.generateImageService.findOne(userId);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateImageEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenerateImageDto: UpdateGenerateImageDto,
  ) {
    return this.generateImageService.update(+id, updateGenerateImageDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GenerateImageEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.generateImageService.remove(id);
  }
}
