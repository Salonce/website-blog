import { Routes } from '@angular/router';
import { MainLayout } from '../shared/layouts/main-layout/main-layout';
import { HomePage } from '../features/article/pages/home-page/home-page';
import { AuthLayout } from '../shared/layouts/auth-layout/auth-layout';
import { AccountDetailsPage } from '../features/account/pages/account-details-page/account-details-page';
import { AccountEditPage } from '../features/account/pages/account-edit-page/account-edit-page';
import { DashboardLayout } from '../shared/layouts/dashboard-layout/dashboard-layout';
import { ArticleNewPage } from '../features/article/pages/article-new-page/article-new-page';
import { ArticlePage } from '../features/article/pages/article-page/article-page';
import { DashboardOverview } from '../features/statistics/pages/dashboard-overview/dashboard-overview';
import { ArticleEditPage } from '../features/article/pages/article-edit-page/article-edit-page';
import { ArticleAdminListPage } from '../features/article/pages/article-admin-list-page/article-admin-list-page';
import { AdminCourse } from '../features/course/pages/admin-course/admin-course';
import { CourseLessons } from '../features/course/pages/course-lessons/course-lessons';

export const routes: Routes = [
    {
        path: '', 
        component: MainLayout,
        children: [
            { path: '', component: HomePage },
            { path: 'home', component: HomePage },
            { path: 'settings', component: AccountDetailsPage },
            { path: 'account-edit', component: AccountEditPage },
            { path: 'articles/:slug', component: ArticlePage }
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
            { path: 'dashboard/courses-management', component: AdminCourse },
            { path: 'dashboard/courses/:id/lessons', component: CourseLessons } 
        ]
    }
];
