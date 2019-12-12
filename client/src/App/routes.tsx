import React from 'react';
import { View, useCurrentRoute, NotFoundBoundary } from 'react-navi';
import { compose, mount, route, withView, redirect, map } from 'navi';

import Layout from './Layout';
import Auth from '../Auth/Auth';
import DatasetsList from '../Dataset/List/List';
import DatasetDetails from '../Dataset/Details/Details';

import {
    withAuthentication,
    withAdminContentProtection,
    Context,
} from '../Auth/authenticatedRoute';
import ErrorBoundary from './ErrorBoundary';
import AdminPanel from '../AdminPanel/AdminPanel';
import UserSettings from '../UserSettings/UserSettings';

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
                view: <DatasetsList />,
            }),
        ),
        '/datasets': withAuthentication(
            route({
                view: <DatasetsList />,
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
            route(async req => {
                return {
                    view: <DatasetDetails id={parseInt(req.params.id)} />,
                };
            }),
        ),
        '/user': withAuthentication(
            route({
                view: <UserSettings />,
            }),
        ),
        '/admin': withAdminContentProtection(
            route({
                view: <AdminPanel />,
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
