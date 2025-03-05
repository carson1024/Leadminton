import ClubPage from "@/pages/ClubPage";
import DashboardPage from "@/pages/DashboardPage";
import FacilitiesPage from "@/pages/FacilitiesPage";
import HomePage from "@/pages/HomePage";
import InterclubPage from "@/pages/InterclubPage";
import QuickMatchPage from "@/pages/QuickMatchPage";
import TournamentsPage from "@/pages/TournamentsPage";

const routes = [
    {
        key: "home",
        layout: "",
        path: "",
        component: <HomePage />
    },
    {
        key: "dashboard",
        layout: "",
        path: "dashboard",
        component: <DashboardPage />
    },
    {
        key: "club",
        layout: "",
        path: "club",
        component: <ClubPage />
    },
    {
        key: "tournaments",
        layout: "",
        path: "tournaments",
        component: <TournamentsPage />
    },
    {
        key: "quick-match",
        layout: "",
        path: "quick-match",
        component: <QuickMatchPage />
    },
    {
        key: "interclub",
        layout: "",
        path: "interclub",
        component: <InterclubPage />
    },
    {
        key: "facilities",
        layout: "",
        path: "facilities",
        component: <FacilitiesPage />
    },
];

export default routes;