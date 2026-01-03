import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { HomePage } from './features/article-browse/pages/home-page/home-page';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { AccountDetailsPage } from './features/settings/account-details-page/account-details-page';
import { AccountEditPage } from './features/settings/pages/account-edit-page/account-edit-page';
import { DashboardLayout } from './shared/layouts/dashboard-layout/dashboard-layout';
import { ArticleNewPage } from './features/article-admin/pages/article-new-page/article-new-page';
import { ArticlePage } from './features/article-browse/pages/article-page/article-page';
import { DashboardOverview } from './features/dashboard-overview/dashboard-overview';
import { ArticleEditPage } from './features/article-admin/pages/article-edit-page/article-edit-page';
import { ArticleAdminListPage } from './features/article-admin/pages/article-admin-list-page/article-admin-list-page';

export const routes: Routes = [
    {
        path: '', 
        component: MainLayout,
        children: [
            { path: '', component: HomePage },
            { path: 'home', component: HomePage },
            { path: 'settings', component: AccountDetailsPage },
            { path: 'account-edit', component: AccountEditPage }
        ]
    },
        {
        path: '', 
        component: AuthLayout,
        children: [
            { path: 'auth', component: AccountDetailsPage }
        ]
    },
        {
        path: '', 
        component: DashboardLayout,
        children: [
            { path: 'dashboard', component: DashboardOverview },
            { path: 'dashboard/overview', component: DashboardOverview },
            { path: 'dashboard/create-article', component: ArticleNewPage },
            { path: 'dashboard/article-management', component: ArticleAdminListPage },
            { path: 'dashboard/articles/:id/edit', component: ArticleEditPage },
        ]
    },
    {
        path: '', 
        component: MainLayout,
        children: [
        { path: 'articles/:slug', component: ArticlePage }
        ]
    }
];
