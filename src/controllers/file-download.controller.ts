// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
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
import {Doctor, Nurse, Patient} from '../models';
import {DoctorRepository, NurseRepository, PatientRepository} from '../repositories';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class FileDownloadController {
  constructor(
    @repository(DoctorRepository)
    private doctorRepository: DoctorRepository,
    @repository(NurseRepository)
    private nurseRepository: NurseRepository,
    @repository(PatientRepository)
    private patientRepository: PatientRepository,
  ) { }


  /**
  *
  * @param type
  * @param id
  */
  @get('/files/{type}', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles(
    @param.path.number('type') type: number,) {
    const folderPath = this.GetFolderPathByType(type);
    const files = await readdir(folderPath);
    return files;
  }



  /**
 *
 * @param type
 * @param recordId
 * @param response
 */
  // @get('/files/{type}/{recordId}')
  // @oas.response.file()
  // async downloadFile(
  //   @param.path.number('type') type: number,
  //   @param.path.string('recordId') recordId: string,
  //   @inject(RestBindings.Http.RESPONSE) response: Response,
  // ) {
  //   const folder = this.GetFolderPathByType(type);
  //   const fileName = await this.GetFilenameById(type, recordId);
  //   const file = this.ValidateFileName(folder, fileName);
  //   //console.log("folder: " + folder)
  //   //console.log("fname: " + fileName)
  //   response.download(file, fileName);
  //   return response;
  // }

  /**
*
* @param type
* @param name
* @param response
*/
  @get('/files/{type}/{name}')
  @oas.response.file()
  async downloadFileName(
    @param.path.number('type') type: number,
    @param.path.string('name') name: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.GetFolderPathByType(type);
    const file = this.ValidateFileName(folder, name);
    //console.log("folder: " + folder)
    //console.log("fname: " + fileName)
    response.download(file, name);
    return response;
  }



  /**
  * Get the folder when files are uploaded by type
  * @param type
  */
  private GetFolderPathByType(type: number) {
    let filePath = '';
    switch (type) {
      // student
      case 1:
        filePath = path.join(__dirname, UploadFilesKeys.DOCTOR_IMAGE_PATH);
        break;
      // course
      case 2:
        filePath = path.join(__dirname, UploadFilesKeys.NURSE_IMAGE_PATH);
        break;
      // advertising
      case 3:
        filePath = path.join(__dirname, UploadFilesKeys.PATIENT_IMAGE_PATH);
        break;
    }
    return filePath;
  }

  /**
  *
  * @param type
  */
  private async GetFilenameById(type: number, recordId: string) {
    let fileName = '';
    switch (type) {
      // doctor
      case 1:
        const doctor: Doctor = await this.doctorRepository.findById(recordId);
        fileName = doctor.img ?? '';
        break;
      // nurse
      case 2:
        const nurse: Nurse = await this.nurseRepository.findById(recordId);
        fileName = nurse.img ?? '';
        break;
      // patient
      case 3:
        const patient: Patient = await this.patientRepository.findById(recordId);
        fileName = patient.img ?? '';
        break;
    }
    return fileName;
  }


  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private ValidateFileName(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`Invalid file name: ${fileName}`);
  }

}
