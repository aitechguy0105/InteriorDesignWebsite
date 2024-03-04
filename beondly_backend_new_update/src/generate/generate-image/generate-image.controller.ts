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
import {

  s3Service_converted,

} from 'src/util/s3/s3';
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
import axios from 'axios';
import * as FormData from 'form-data'
const path = require('path')
import { AxiosRequestConfig } from 'axios';
var fs = require('fs')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    let generatedLinks
    if (generateRestyleDto.originType == 'sketch2img') {

      var options_list = []
      var effect_prompts = [" futuristic 2090 interior design,",
      "bright sun light ,",
      "bright yellow sun color image,",
      "shining light,",
      "contrast color,",
       "bright atmosphere,",
       "soft natural volumetric cinematic perfect light,"]
      function generateRandomNumbers(count) {
        const randomNumbers = [];
        for (let i = 0; i < count; i++) {
          let bLoop = true;
          while (bLoop) {
            let tmp = Math.floor(Math.random() * effect_prompts.length)
            if (randomNumbers.indexOf(tmp) == -1) {
              bLoop = false;
              randomNumbers.push(tmp);
            }
            
          }
          
        }
        return randomNumbers;
      }
      const num_desired_image = 3;
      const selected = generateRandomNumbers(num_desired_image)
      console.log('-------selected', selected)
      var request = require('request');
      
      for (let i = 0; i < num_desired_image; ++i) {
        var options = {
          'method': 'POST',
          // 'url': 'https://modelslab.com/api/v5/controlnet',
          'url':'https://stablediffusionapi.com/api/v5/controlnet',
          'headers': {
            'Content-Type': 'application/json'
          },
          timeout: 500000,
          body: JSON.stringify(
      
            {
              "key": process.env.STABLE_DEFISSION_API_KEY,
              "prompt":  generateRestyleDto.prompt + ' ,make the realistic wonderful interior image from this sketch,' + 'bright sunlight, natural light, interior design, photorealistic image, realistic textures, \
                  ultra high resolution, 4K image,' + effect_prompts[selected[i]] ,
              "model_id": "interiordesignsuperm",
              "controlnet_model": "scribble",
              "controlnet_type": "scribble",
              "negative_prompt": "sketch, text",
              "scheduler": "UniPCMultistepScheduler",
              "safety_checker": "no",
              "auto_hint": "yes",
              "guess_mode": "no",
              "strength": 1,
              "width": "1024",
              "height": "1024",
              "guidance_scale": 7.5,
              "controlnet_conditioning_scale": 1,
              "seed": null,
              "multi_lingual": "no",
              "use_karras_sigmas": "yes",
              "algorithm_type": "no",
              "safety_checker_type": "sensitive_content_text",
              "instant_response": "no",
              "tomesd": "yes",
              "init_image": generateRestyleDto.baseUrl,
              "mask_image": null,
              "control_image": null,
              "vae": null,
              "num_inference_steps":"31",
              "full_url": "no",
              "upscale": 2,
              "samples": 1,
              "embeddings": null,
              "ip_adapter_id": null,
              "ip_adapter_scale": 0.6,
              "ip_adapter_image": null,
              "lora": "more_details",
              "lora_strength": 0.45,
              "temp": "no",
              "base64": "no",
              "clip_skip": 1
               }
            )
        };
        options_list.push(options)
      }
     

    var rp = require('request-promise');


    async function sendRequest(options){
      try{  // TRY STARTS HERE
        console.log('---------options: ', options)
        console.log('-----send request start')
        const response = await rp(options)
        const parsedResponse = JSON.parse(response)
        console.log('parsedResponse:' , parsedResponse)
        if(parsedResponse.status == "success"){

          return {link: parsedResponse.output[0], eta: 0};
        } else if (parsedResponse.status == "processing"){


          

          return {link: parsedResponse.future_links[0], eta: parsedResponse.eta};   
        }
          // TRY ENDS HERE
      } catch (error){ // catch STARTS HERE
        console.error( " error is :" +error);
        return null
      }// catch ENDS HERE

    }
  

    async function processRequests() {
      const generatedLinks = []
      for (let i = 0; i < options_list.length; ++i) {
        try{
          const generatedLink = await sendRequest(options_list[i]);
          console.log('-----generatedLink', i, generatedLink)
          generatedLinks.push(generatedLink);
        } catch (error) {
          console.error('Error processing request:', error);
        }
          
      }
      // const maxEta = Math.max(...generatedLinks.map(link => link.eta));
      // console.log('Maximum ETA:', maxEta);
      const sumEta = generatedLinks.reduce((acc, link) => acc + link.eta, 0)
      console.log('Sum ETA:', sumEta);
      console.log('----------before sleep', Date.now())
      await sleep(sumEta * 1000)
      console.log('----------after sleep',Date.now())
      return generatedLinks.map(link => link.link)
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //       resolve(generatedLinks.map(link => link.link));
      //   }, sumEta); // Convert maxEta to milliseconds
      // });
    }
  
    generatedLinks = await processRequests();


    console.log('----------generatedLinks', generatedLinks)



    } else {
      const bodyInfo = JSON.stringify({
        key: process.env.STABLE_DEFISSION_API_KEY,
        prompt:
          generateRestyleDto.prompt +
          ' ((High definition)), ((High resolution))',
        negative_prompt:
          '((out of frame)), ((extra fingers)),((peaple)),((person)), (((woman))), (((man))), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), ((anime)), (((broken fan))), (((broken lamp))), ((ideal floor slab)), (((Curtains in the wrong place)))',
        init_image: generateRestyleDto.baseUrl,
        width: '1024',
        height: '1024',
        samples: '3',
        num_inference_steps: '31',
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

      generatedLinks = await lastValueFrom(
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

     
    }
    if (!generatedLinks[0]) {
      console.log("-----------return state false")
      return { state: false };
    }


    const upscaledImageLinksS3 = await this.download_upscale_upload(generatedLinks)
    console.log('----------upscaledImageLinksS3', upscaledImageLinksS3)

    const genInfo = await this.generateImageService.create({
      baseUrl: generateRestyleDto.baseUrl,
      prompt: generateRestyleDto.prompt,
      url: upscaledImageLinksS3,
      name: uuid(),
      userId: Number(generateRestyleDto.userId),
      method: 'restyle',
    });
    console.log('-------------genInfo', genInfo)
    return {
      genInfo,
      state: true,
    };
  }
async download_upscale_upload(imageUrls) {
// download from modelslab, upscale using clipdrop, upload it to s3 bucket
  let result = []
  try{
    for (let i  = 0; i < imageUrls.length; ++i) {

      let imageUrl = imageUrls[i]
      // check if the modelslab's image is prepared
      let bLoop = true
      while (bLoop) {
        console.log('--------before sleep', Date.now())
        await sleep(5000);
        console.log('--------after sleep', Date.now())
        fetch(imageUrl).then(res =>
          {
              if (res.status == 200) {
                bLoop =false
              }
          }
        );
      }
      console.log('------------imageUrl', imageUrl)
      var formData = new FormData();
      let res: any;
      console.log('-------send download request')
      const download_response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer' // Ensure response is treated as binary data
      })
             // console.log(response.data);

      // configure for clipdrop api
      const fileName = path.basename(imageUrl);

      formData.append('image_file', download_response.data, fileName);
      const sizeOf = require('image-size');
      const dimensions = sizeOf(download_response.data)
      console.log('-------------dimensions', dimensions)

      const targetHeight = dimensions.height * 2;
      const targetWidth = dimensions.width * 2;
      formData.append('target_width', targetWidth);
      formData.append('target_height', targetHeight);


      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://clipdrop-api.co/image-upscaling/v1/upscale',
        headers: {
          'x-api-key': 'b1115d9068cf995de297fb062bf24e8e7604b131dbb195bbd193079441dcc6c6726219523935ae4ee7b9e3287d390bd0',
          ...formData.getHeaders()
        },
        data: formData,
        responseType: 'arraybuffer'
      };
        //@ts-ignore
      const clipdrop_response = await axios(config)
      const fileNameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'));
      const uploadedFilePath = `./upload/upscaled/${fileName}`;
        
     
      await fs.writeFile(uploadedFilePath, clipdrop_response.data, 'binary', (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      console.log('Image saved successfully!');
  
      // upload to s3 bucket
      const myFile = {filename: fileNameWithoutExtension};
      res = await s3Service_converted(uploadedFilePath, myFile);
      console.log('------------s3 image location', res.Location)
      result.push(res.Location)
    }
 

  }
  catch (err) {
    console.log(err)
  }

  return result

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
    let bodyInfo ;
    if (generateStagingDto.originType == "sketch2img") {
      console.log('------------sketch2image staging')
      
      bodyInfo =  JSON.stringify(
        // {
        //   "key": process.env.STABLE_DEFISSION_API_KEY,
        //   "prompt": "((scandinavian)) style (((kitchen))), , , , ,make the realistic wonderful interior image from this sketch,bright sunlight, natural light, interior design, photorealistic image, realistic textures, ultra high resolution, 4K image,bright sun light ,",
        //   "model_id": "interiordesignsuperm",
        //   "controlnet_model": "scribble",
        //   "controlnet_type": "scribble",
        //   "negative_prompt": "sketch, text",
        //   "scheduler": "UniPCMultistepScheduler",
        //   "safety_checker": "no",
        //   "auto_hint": "yes",
        //   "guess_mode": "no",
        //   "strength": 1,
        //   "width": "1024",
        //   "height": "1024",
        //   "guidance_scale": 7.5,
        //   "controlnet_conditioning_scale": 1,
        //   "seed": null,
        //   "multi_lingual": "no",
        //   "use_karras_sigmas": "yes",
        //   "algorithm_type": "no",
        //   "safety_checker_type": "sensitive_content_text",
        //   "instant_response": "no",
        //   "tomesd": "yes",
        //   "init_image": generateStagingDto.baseUrl,
        //   "mask_image": null,
        //   "control_image": null,
        //   "vae": null,
        //   "num_inference_steps":"31",
        //   "full_url": "no",
        //   "upscale": 2,
        //   "samples": 1,
        //   "embeddings": null,
        //   "ip_adapter_id": null,
        //   "ip_adapter_scale": 0.6,
        //   "ip_adapter_image": null,
        //   "lora": "more_details",
        //   "lora_strength": 0.45,
        //   "temp": "no",
        //   "base64": "no",
        //   "clip_skip": 1
        //    }
      {
        "key":  process.env.STABLE_DEFISSION_API_KEY,
          "controlnet_type": "scribble",
          "controlnet_model": "scribble",
          "model_id": "interiordesignsuperm",
          "init_image": generateStagingDto.baseUrl,
          "mask_image": generateStagingDto.maskUrl,
          "control_image": null,
          "auto_hint":"yes",
          // "width": generateStagingDto.width.toString(),
          // "height": generateStagingDto.height.toString(),
          "width": '1024',
          "height": '1024',
          "prompt": generateStagingDto.prompt + ' ,interior design, photorealistic image, realistic textures, \
           ultra high resolution, 4K image,' ,
          "negative_prompt": "sketch",
          "guess_mode": null,
          "use_karras_sigmas": "yes",
          "algorithm_type": null,
          "safety_checker_type": null,
          "tomesd": "yes",
          "vae": null,
          "embeddings": null,
          "lora_strength": null,
          "upscale": "yes",
          "instant_response": null,
          "strength": 1,
          "guidance_scale": 7.5,
          "samples": "1",
          "safety_checker": null,
          "num_inference_steps": "30",
          "controlnet_conditioning_scale": 0.4,
          "track_id": null,
          "scheduler": "UniPCMultistepScheduler",
          "base64": null,
          "clip_skip": "1",
          "temp": null,
          "seed": null,
          "webhook": null
      }
      )
    }

      
      
    else {
      console.log('------------normal staging')
       bodyInfo = JSON.stringify({
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
        width: '1024',
        height: '1024',
        samples: '3',
        safety_checker: null,
        steps: 21,
        seed: 0,
        strength: null,
        webhook: null,
        track_id: null,
        scheduler: 'UniPCMultistepScheduler',
      });
    }
  

    // console.log('------------------bodyInfo------------------', bodyInfo);
    console.log('Staging-----------', bodyInfo);
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let url = ''
    if (generateStagingDto.originType == "sketch2img") {
     url = 'https://stablediffusionapi.com/api/v5/controlnet';
    } else {
      url = 'https://stablediffusionapi.com/api/v3/inpaint';
    }
    
    const generatedData = await lastValueFrom(
      this.httpService.post(url, bodyInfo, options).pipe(
        map((response) => {
          console.log('response', response.data);
          if (response.data.status == "processing") {
            return response.data.future_links
          }
          return response.data.output;
        }),
      ),
    );

    console.log('-----generatedData', generatedData);

    if (!generatedData[0]) {
      console.log('return state false')
      return { state: false };
    }
    const upscaledImageLinksS3 = await this.download_upscale_upload(generatedData)
    console.log('----------upscaledImageLinksS3', upscaledImageLinksS3)

    const genInfo = await this.generateImageService.create({
      baseUrl: generateStagingDto.baseUrl,
      prompt: generateStagingDto.prompt,
      url: upscaledImageLinksS3,
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
