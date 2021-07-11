// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  param,

  put,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import {UploadFilesKeys} from '../keys/upload-file-keys';
import {Doctor, Nurse, Patient} from '../models';
import {DoctorRepository, NurseRepository, PatientRepository} from '../repositories';

export class FileUploadController {
  constructor(
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
    @repository(NurseRepository)
    public nurseRepository: NurseRepository,
    @repository(PatientRepository)
    public patientRepository: PatientRepository,
  ) { }


  /**
  *
  * @param response
  * @param request
  */
  @put('/image/{type}/{id}', {
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
  async imageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('type') type: string,
    @param.path.string('id') id: string,
    @requestBody.file() request: Request,
  ): Promise<object> {


    // valida si es un tipo permitido de los que estan definidos y maneja el error en caso que no.
    if (!UploadFilesKeys.IMAGE_TYPES_ACCEPTED.includes(type)) throw new HttpErrors[400]('El tipo al que intenta acceder no está permitido.');

    // crea el path
    const pathFile = path.join(__dirname, `${UploadFilesKeys.IMAGE_PATH}/${type}`);

    // devuelve el repositorio con el que trabajaremos.
    const repositoy = this.getRepository(type);

    let fileName: string = '';

    // valida si existe la entidad antes de guardar la imagen
    let entity = await repositoy.findById(id);
    if (!entity) throw new HttpErrors[400]('Error el id ingresado no es válido.');

    // procesando la imagen
    let res = await this.StoreFileToPath(pathFile, UploadFilesKeys.FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      fileName = response.req?.file.filename || '';
      if (!fileName || fileName.length <= 0) throw new HttpErrors[501]('Error al guardar la imagen.');

      // agregando imagen en la entidad
      entity = await this.EntityImageUpdate(entity, fileName, pathFile);
      await repositoy.updateById(id, entity);

    }

    return {fileName};

  }

  /**
   * Método EntityImageUpdate.
   * @param  { Doctor | Nurse | Patient} entity entidad a la que se le va a agregar la imagen.
   * @param  {string} fileName nombre de la imagen.
   * @param  {string} pathFile dirección donde se encuentra guardada la imagen en el servidor.
   * @return { Doctor | Nurse | Patient } retorna entidad con la imagen asignada.
   */

  async EntityImageUpdate(
    entity: Doctor | Nurse | Patient,
    fileName: string,
    pathFile: string) {

    // crea una ruta con el valor de la imgen que tiene la entidad actual.
    const pathOld = `${pathFile}/${entity.img}`;

    // verifica si existe una imagen ya vinculada para eliminarla.
    if (fs.existsSync(pathOld)) {
      fs.unlinkSync(pathOld);
    }

    entity.img = fileName;

    return entity;
  }


  /**
   * Método getRepository.
   * @param  {string} type tipo de entidad a la que se le agregara la imagen.
   * @return  {DoctorRepository | NurseRepository | PatientRepository | err} retorna el repositorio con el que trabajaremos segun el tipo.
   */
  getRepository(type: string): DoctorRepository | NurseRepository | PatientRepository {

    switch (type) {
      case 'doctor':
        return this.doctorRepository;

      case 'nurse':
        return this.nurseRepository;

      case 'patient':
        return this.patientRepository;

      default:
        throw new HttpErrors[400]('No es un Doctor, Enfermera o Paciente.');
    }

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
          return callback(new HttpErrors[400]('El formato de la imagen no es sopurtado.'));
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
