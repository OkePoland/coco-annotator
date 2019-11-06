import Api from '../../common/api';
import { getUserInfo } from '../../Auth/auth.api';

export const prepareApp = async () => {
    await Api.init();
    await getUserInfo();
};
