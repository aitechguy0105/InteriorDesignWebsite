const Jimp = require('jimp');
import { v4 as uuid } from 'uuid';

export const jpg2png_converter = async (
  file: any,
  width: number,
  height: number,
): Promise<string> => {
  return Jimp.read(`${file.destination}/${file.filename}`)
    .then(async (image) => {
      const path = `./upload/converted/image/${file.filename}.png`; // with no extension
      // const w = image.bitmap.width; //  width of the image
      // const h = image.bitmap.height;
      // if (w < h) await image.resize(Jimp.AUTO, 1000);
      // else if (w > h) await image.resize(1000, Jimp.AUTO);
      // else if (w == h) await image.resize(1000, Jimp.AUTO);
      if (width > 768) {
        const h = (768 / width) * height;
        width = 768;
        height = h;
      }
      await image.resize(width, height);
      await image.write(path);

      // console.log('image_______________', w, '------', h);
      console.log(path);
      return path;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const mask_converter = async (file: any): Promise<string> => {
  return Jimp.read(`${file.destination}/${file.filename}`)
    .then(async (image) => {
      const path = `./upload/converted/mask/${file.filename}.png`;
      let w = image.bitmap.width;
      let h = image.bitmap.height;
      if (w > 768) {
        const th = (768 / w) * h;
        h = th;
        w = 768;
      }
      const blackBoard = await Jimp.read('./src/board/black_board.png');
      await blackBoard.resize(w, h);
      await blackBoard.composite(image, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 1,
      });
      await blackBoard.write(path);

      return path;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createNoneMask = async (
  width: number,
  height: number,
): Promise<string> => {
  return Jimp.read('./src/board/black_board.png')
    .then(async (blackBoard) => {
      const fileName = uuid();
      const path = `./upload/converted/mask/${fileName}.png`;
      let w = width;
      let h = height;
      if (width > 768) {
        const th = (768 / width) * height;
        h = th;
        w = 768;
      }
      console.log('w---------------------', w, 'h-------------------------', h);
      const wm = (w * 7) / 10;
      const hm = (h * 7) / 10;
      await blackBoard.resize(w, h);
      const whiteBoard = await Jimp.read('./src/board/white_board.png');
      await whiteBoard.resize(wm, hm);
      await blackBoard.composite(whiteBoard, (w - wm) / 2, h - hm, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 1,
      });
      await blackBoard.write(path);

      return { path, fileName };
    })
    .catch((err) => {
      console.log(err);
    });
};

export const readbuffer = async (path: string): Promise<any> => {
  return Jimp.read(path)
    .then(async (image) => {
      console.log('readbuffer', image.bitmap.data);

      return image.bitmap.data;
    })
    .catch((err) => {
      console.log('read buffer', err);
    });
};
