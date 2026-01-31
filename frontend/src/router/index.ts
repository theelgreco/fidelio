import { usePreviousRoute } from "@/composables/previous-route";
import { useUserStore } from "@/stores/user-store";
import { MONTH_NAMES, type MonthName } from "@api-contract";
import { capitalize } from "lodash";
import { CalendarIcon, CurrencyIcon, LayoutDashboardIcon } from "lucide-vue-next";
import { createRouter, createWebHistory, type RouterOptions } from "vue-router";
import type { ExtendedRouteRecord } from "./types";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            meta: { title: "Login", requiresAuth: false, showNav: false },
            component: () => import("@/features/login/login-view.vue"),
        },
        {
            path: "/",
            name: "home",
            redirect: () => {
                return "/dashboard";
            },
        },
        {
            path: "/dashboard",
            name: "dashboard",
            meta: { title: "Dashboard", requiresAuth: true, showNav: true, navOptions: { icon: LayoutDashboardIcon, label: "Dashboard" } },
            component: () => import("@/features/dashboard/dashboard-view.vue"),
        },
        {
            path: "/calendar",
            name: "calendar",
            meta: { title: "Calendar", navOptions: { icon: CalendarIcon, label: "Calendar" } },
            redirect: () => {
                return `/calendar/${new Date().getFullYear().toString()}`;
            },
            children: [
                {
                    path: ":year",
                    name: "year",
                    meta: { title: "Home", requiresAuth: true, hasYear: true, showNav: true },
                    component: () => import("@/features/calendar/calendar-year-view.vue"),
                },
                {
                    path: ":year/:month",
                    name: "month",
                    meta: { title: "Month", requiresAuth: true, hasYear: true, hasMonth: true, showNav: true },
                    component: () => import("@/features/calendar/calendar-month-view.vue"),
                },
            ],
        },
        {
            path: "/transactions",
            name: "transactions",
            meta: { title: "Transactions", requiresAuth: true, showNav: true, navOptions: { icon: CurrencyIcon, label: "Transactions" } },
            component: () => import("@/features/transactions/transaction-list-view.vue"),
        },
        {
            path: "/transactions/create",
            name: "createTransaction",
            meta: { title: "Create a transaction", requiresAuth: true, showNav: false, slide: true, slideFrom: "right" },
            component: () => import("@/features/transactions/transaction-create-view.vue"),
        },
        {
            path: "/transactions/:transaction/edit",
            name: "editTransaction",
            meta: { title: "Edit a transaction", requiresAuth: true, showNav: false, slide: true, slideFrom: "right" },
            component: () => import("@/features/transactions/transaction-edit-view.vue"),
        },
    ],
} as RouterOptions & { routes: ExtendedRouteRecord[] });

const previousRoute = usePreviousRoute();

router.beforeEach(async (to, from, next) => {
    if (from.path !== "/") {
        previousRoute.value = from;
    }

    if (to.meta.hasYear) {
        const year = Array.isArray(to.params.year) ? parseInt(to.params.year[0]) : parseInt(to.params.year);

        if (isNaN(year) || year < 1900 || year > 3024) {
            return next({ name: to.name, params: { ...to.params, year: new Date().getFullYear().toString() } });
        }
    }

    if (to.meta.hasMonth) {
        const month = (Array.isArray(to.params.month) ? to.params.month[0] : to.params.month) as MonthName;
        const isValidMonthName = MONTH_NAMES.includes(capitalize(month));
        const routerMonth = isValidMonthName ? month : MONTH_NAMES[new Date().getMonth()];
        const routerMonthLower = routerMonth.toLowerCase();

        if (month !== routerMonthLower) {
            return next({ name: to.name, params: { ...to.params, month: routerMonthLower } });
        }
    }

    if (to.meta.requiresAuth) {
        const { validateJWT } = useUserStore();
        try {
            await validateJWT();
            return next();
        } catch (err: any) {
            return next("/login");
        }
    }

    return next();
});

export default router;
