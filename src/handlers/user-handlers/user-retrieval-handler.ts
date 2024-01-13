import 'source-map-support/register';
import { respondError, respondSuccess } from '../../utils/response-generator';
import { UserService } from '../../services/user-service';
import { entity } from '../../models/entities';


// UserRetrievalByTokenHandler
export const handler = async (event, _context) => {
    try {
        const userService = new UserService();
        const user: entity.User = await userService.getUserByToken(event.headers.Authorization);

        return respondSuccess(user)
    } catch (err) {
        return respondError(err)
    }
}
