import React from 'react';
import { View } from 'react-navi';
import { compose, mount, route, withView, redirect } from 'navi';

import Layout from './Layout';
import Auth from '../Auth/Auth';
import Datasets from '../Datasets/Datasets';

const routesWithHeader = compose(
    withView(() => (
        <Layout>
            <View />
        </Layout>
    )),
    mount({
        '/': redirect('/datasets'),

        '/datasets': route({
            view: <Datasets />,
        }),
        '/categories': route({
            view: <div>Categories</div>,
        }),
        '/about': route({
            view: <div />,
        }),
        '/undo': route({
            view: <div />,
        }),
        '/tasks': route({
            view: <div />,
        }),
        '/annotate/:id': route({
            view: <div />,
        }),
        '/dataset/:id': route({
            view: <div />,
        }),
        '/user': route({
            view: <div />,
        }),
        '/admin': route({
            view: <div />,
        }),
    }),
);
export default mount({
    '/auth': route({
        view: <Auth />,
    }),
    '*': routesWithHeader,
});
