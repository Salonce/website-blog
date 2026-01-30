import { Routes } from '@angular/router';
import { MainLayout } from '../shared/ui/layouts/main-layout/main-layout';
import { HomePage } from '../features/article/pages/home-page/home-page';
import { AccountDetailsPage } from '../features/account/pages/account-details-page/account-details-page';
import { AccountEditPage } from '../features/account/pages/account-edit-page/account-edit-page';
import { DashboardLayout } from '../shared/ui/layouts/dashboard-layout/dashboard-layout';
import { ArticleNewPage } from '../features/article/pages/article-new-page/article-new-page';
import { ArticlePage } from '../features/article/pages/article-page/article-page';
import { DashboardOverview } from '../features/statistics/pages/dashboard-overview/dashboard-overview';
import { ArticleEditPage } from '../features/article/pages/article-edit-page/article-edit-page';
import { ArticleAdminListPage } from '../features/article/pages/article-admin-list-page/article-admin-list-page';
import { CoursesManagementPage } from '../features/course/feature-course-management/courses-management-page/courses-management-page';
import { CourseLayout } from '../features/course/feature-course-learn/course-layout/course-layout';
import { CourseLessonsManagementPage } from '../features/course/feature-course-management/course-lessons-management-page/course-lessons-management-page';

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
        path: 'courses/:courseSlug', 
        component: CourseLayout
    },
    {
        path: 'dashboard', 
        component: DashboardLayout,
        children: [
            { path: '', component: DashboardOverview },
            { path: 'overview', component: DashboardOverview },
            { path: 'create-article', component: ArticleNewPage },
            { path: 'article-management', component: ArticleAdminListPage },
            { path: 'articles/:id/edit', component: ArticleEditPage },
            { path: 'courses-management', component: CoursesManagementPage },
            { path: 'courses/:id/lessons', component: CourseLessonsManagementPage } 
        ]
    }
];
