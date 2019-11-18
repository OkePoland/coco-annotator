import { map, Matcher, redirect } from 'navi';

import { AuthService } from './authService';
import { IUser } from './auth.api';

export interface Context {
    currentUser: IUser;
    authService: AuthService;
}

export function withAuthentication(matcher: Matcher<{}, Context>) {
    return map((_, context: Context) =>
        context.currentUser ? matcher : redirect('/auth'),
    );
}
