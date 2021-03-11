import {repository} from '@loopback/repository';
import {ConfigTestLabRepository} from '../repositories';


export class ConfigTestLabService {

  constructor(
    @repository(ConfigTestLabRepository)
    public configTestLabRepository: ConfigTestLabRepository
  ) {

  }

  async getPrice() {
    let config = await this.configTestLabRepository.findOne();

    let date = new Date();
    let day = date.getDay();


    if (config) {
      if (config.days.indexOf(day) != -1) {

        let hors = date.getHours();
        let min = date.getMinutes();
        let startTime = config.startTime.split(":");
        let endTime = config.endTime.split(":");

        if (parseInt(startTime[0]) < hors && parseInt(endTime[0]) > hors) {
          return "price";
        } else if (parseInt(startTime[0]) == hors && min >= parseInt(startTime[1])) {
          return "price";
        } else if (parseInt(endTime[0]) == hors && min <= parseInt(endTime[1])) {
          return "price";
        } else {
          return "specialPrice";
        }
      } else {
        return "specialPrice";
      }
    } else {
      return "";
    }

  }

}



