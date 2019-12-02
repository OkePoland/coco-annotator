import React from 'react';
import { View, useCurrentRoute, NotFoundBoundary } from 'react-navi';
import { compose, mount, route, withView, redirect, map } from 'navi';

import Layout from './Layout';
import Auth from '../Auth/Auth';
import Datasets from '../Datasets/Datasets';
import {
    withAuthentication,
    withAdminContentProtection,
    Context,
} from '../Auth/authenticatedRoute';
import ErrorBoundary from './ErrorBoundary';

const AppView = () => {
    const route = useCurrentRoute();

    if (route.data.hideLayout) {
        return (
            <NotFoundBoundary render={() => <ErrorBoundary />}>
                <View />
            </NotFoundBoundary>
        );
    } else {
        return (
            <Layout>
                <NotFoundBoundary render={() => <ErrorBoundary />}>
                    <View />
                </NotFoundBoundary>
            </Layout>
        );
    }
};

export default compose(
    withView(<AppView />),
    mount({
        '/': withAuthentication(
            route({
                view: <Datasets />,
            }),
        ),
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
        '/auth': map((_, context: Context) =>
            context.currentUser
                ? redirect('/')
                : route({ view: <Auth />, data: { hideLayout: true } }),
        ),
        '*': route((_, context: Context) => {
            return {
                data: {
                    hideLayout: context.currentUser ? false : true,
                },
            };
        }),
    }),
);
