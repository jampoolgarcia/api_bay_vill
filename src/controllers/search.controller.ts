// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {Doctor, Nurse} from '../models';
import {DoctorRepository, NurseRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class SearchController {
  constructor(
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
    @repository(NurseRepository)
    public nurseRepository: NurseRepository,
  ) { }


  /**
 * Endpoint para realizar búsquedas por entidad y termino.
 * @param  {authenticate}, Recibe los esquemas del tipo de seguridad que permiten el acceso al endpoint.
 * @param  {string} search, Es el termino por que cual se realiza la búsqueda.
 * @return  {array} Retorna una promesa con la lista de la entidad que coincidieron
 *  con el termino search o un arreglo vacío




  si la entidad no existe.
 */
  @authenticate("UserTokenStrategy", "AdminTokenStrategy")
  @get('/search/{entity}/{search}', {
    responses: {
      '200': {
        description: 'array of user model instance',
        content: {
          'application/json': {
            schema: {
              type: 'array'
            },
          },
        },
      },
    },
  })

  // Método que ejecuta el endPoint y su lógica..
  async findBySearch(
    @param.path.string('entity') entity: string,
    @param.path.string('search') search: string
  ): Promise<Doctor[] | Nurse[]> {


    // Recibe como parámetro la entidad y ejecuta el método correspondiente o un arreglo vacío si no existe.
    switch (entity) {
      case 'doctors':
        return await this.getSearchDoctors(search);
      case 'nurses':
        return await this.getSearchNurses(search);
      default:
        return [];
    }

  }



  /**

   * Obtiene los doctores mediante un filtro especifico.

   * @param  {string} search, Es el termino por que cual se realiza la búsqueda.

   * @return  {array} Retorna una lista con los doctores que coincidieron con el termino search.

   */
  async getSearchDoctors(search: string) {

    return this.doctorRepository.find({
      where: {
        or: [
          {name: {regexp: `/.*${search}.*/i`}},
          {sex: {regexp: `/.*${search}.*/i`}},
          {ci: {regexp: `/.*${search}.*/i`}}
        ]
      },
      include: ['specialty']
    });

  }


  /**

 * Obtiene los Enfermer@s mediante un filtro especifico.

 * @param  {string} search, Es el termino por que cual se realiza la búsqueda.

 * @return  {array} Retorna una lista con l@s Enfermer@s que coincidieron con el termino search.

 */
  getSearchNurses(search: string) {
    return this.nurseRepository.find({
      where: {
        or: [
          {name: {regexp: `/.*${search}.*/i`}},
          {sex: {regexp: `/.*${search}.*/i`}},
          {ci: {regexp: `/.*${search}.*/i`}}
        ]
      }
    });
  }
}
