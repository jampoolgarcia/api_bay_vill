
import {AuthenticationStrategy} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';


export class AdminTokenStrategy implements AuthenticationStrategy {

  name: string = 'AdminTokenStrategy';
  authService: AuthService;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {
    this.authService = new AuthService(userRepository);
  }


  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = await this.authService.extractCredentials(request);
    const userProfile = await this.authService.VerifyAdminToken(token);
    return userProfile;
  }


}
