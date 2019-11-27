import React from 'react';
import { View } from 'react-navi';
import { compose, mount, route, withView, redirect, NaviRequest } from 'navi';

import Layout from './Layout';
import Auth from '../Auth/Auth';
import Datasets from '../Datasets/Datasets';
import {
    withAuthentication,
    Context,
    withAdminContentProtection,
} from '../Auth/authenticatedRoute';

const routesWithHeader = compose(
    withView((request: NaviRequest<Context>, context: Context) => (
        <Layout
            currentUser={context.currentUser}
            onLogoutCb={() => context.authService.logout()}
        >
            <View />
        </Layout>
    )),
    mount({
        '/': redirect('/datasets'),

        '/datasets': withAuthentication(
            route({
                view: <Datasets />,
            }),
        ),
        '/categories': withAuthentication(
            route({
                view: <div>Categories</div>,
            }),
        ),
        '/about': withAuthentication(
            route({
                view: <div />,
            }),
        ),
        '/undo': withAuthentication(
            route({
                view: <div />,
            }),
        ),
        '/tasks': withAuthentication(
            route({
                view: <div />,
            }),
        ),
        '/annotate/:id': withAuthentication(
            route({
                view: <div />,
            }),
        ),
        '/dataset/:id': withAuthentication(
            route({
                view: <div />,
            }),
        ),
        '/user': withAuthentication(
            route({
                view: <div />,
            }),
        ),
        '/admin': withAdminContentProtection(
            route({
                view: <div />,
            }),
        ),
    }),
);
export default mount({
    '/auth': route({
        getView: (req: NaviRequest<Context>, context: Context) => {
            return <Auth authService={context.authService} />;
        },
    }),
    '*': routesWithHeader,
});
