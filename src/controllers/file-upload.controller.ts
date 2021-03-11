// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/core';
import {
  HttpErrors,




  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {UploadFilesKeys} from '../keys/upload-file-keys';

export class FileUploadController {
  constructor() { }


  /**
 *
 * @param response
 * @param request
 */
  @post('/doctorImage', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Doctor Image',
      },
    },
  })
  async doctorImageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const doctorImagePath = path.join(__dirname, UploadFilesKeys.DOCTOR_IMAGE_PATH);
    let res = await this.StoreFileToPath(doctorImagePath, UploadFilesKeys.DOCTOR_PROFILE_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }


  /**
 *
 * @param response
 * @param request
 */
  @post('/nurseImage', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Nurse Image',
      },
    },
  })
  async nurseImageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const nurseImagePath = path.join(__dirname, UploadFilesKeys.NURSE_IMAGE_PATH);
    let res = await this.StoreFileToPath(nurseImagePath, UploadFilesKeys.NURSE_PROFILE_PHOTO_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }



  /**
 *
 * @param response
 * @param request
 */
  @post('/patientImage', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Patient Image',
      },
    },
  })
  async patientImageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const patientImagePath = path.join(__dirname, UploadFilesKeys.PATIENT_IMAGE_PATH);
    let res = await this.StoreFileToPath(patientImagePath, UploadFilesKeys.PATIENT_PROFILE_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }


  /**
    * Return a config for multer storage
    * @param path
    */
  private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path)
      },
      filename: function (req, file, cb) {
        filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }

  /**
  * store the file in a specific path
  * @param storePath
  * @param request
  * @param response
  */
  private StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('This format file is not supported.'));
        },
        limits: {
          fileSize: UploadFilesKeys.MAX_FILE_SIZE
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }


}
