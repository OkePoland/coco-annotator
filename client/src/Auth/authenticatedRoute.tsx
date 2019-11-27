import { map, Matcher, redirect, NaviRequest } from 'navi';

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

export function withAdminContentProtection(matcher: Matcher<{}, Context>) {
    return map((request: NaviRequest<Context>, context: Context) =>
        context.currentUser && context.currentUser.is_admin
            ? withAuthentication(matcher)
            : redirect('/'),
    );
}
