import { map, Matcher, redirect } from 'navi';

import { AuthService } from './authService';
import { UserInfo } from '../common/types';

export interface Context {
    currentUser: UserInfo;
    authService: AuthService;
}

export function withAuthentication(matcher: Matcher<{}, Context>) {
    return map((_, context: Context) =>
        context.currentUser ? matcher : redirect('/auth'),
    );
}
