// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
  get,

  HttpErrors, oas,
  param,
  Response,
  RestBindings
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {UploadFilesKeys} from '../keys/upload-file-keys';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class FileDownloadController {

  constructor() { }

  /**
  *
  * @param type
  * @param fileName
  * @param response
  */
  @get('/files/{type}/{fileName}')
  @oas.response.file()
  async downloadFileName(
    @param.path.string('type') type: string,
    @param.path.string('fileName') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {

    // valida si es un tipo permitido de los que estan definidos y maneja el error en caso que no.
    if (!UploadFilesKeys.IMAGE_TYPES_ACCEPTED.includes(type)) throw new HttpErrors[400]('El tipo al que intenta acceder no está permitido.');

    // crear la ruta segun el tipo
    const folder = path.join(__dirname, `${UploadFilesKeys.IMAGE_PATH}/${type}`);

    let file = path.resolve(folder, fileName);

    // valida que exista la imagen y si no regresa un avatar por defecto
    if (fs.existsSync(file)) {
      response.download(file, fileName);
      return response;
    } else {
      file = path.join(__dirname, `${UploadFilesKeys.IMAGE_PATH}/avatar.svg`);
      response.download(file, 'avatar.svg');
      return response;
    }


  }

}
