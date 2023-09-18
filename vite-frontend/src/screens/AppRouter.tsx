
import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import Layout from "../components/Layout";
import DashboardScreen from "./Dashboard/DashboardScreen";
import ErrorScreen from "./ErrorScreen";
import PrinterScreen from "./Printer/PrinterScreen";
import LabelHistoryScreen from "./Settings/Label/LabelHistoryScreen";
import SettingsScreen from "./Settings/SettingsScreen";
import SteriCreateScreen from "./Settings/Steri/SteriCreateScreen";
import SteriEditScreen from "./Settings/Steri/SteriEditScreen";
import SteriListScreen from "./Settings/Steri/SteriListScreen";
import UserCreateScreen from "./Settings/User/UserCreateScreen";
import UserEditScreen from "./Settings/User/UserEditScreen";
import UserListScreen from "./Settings/User/UserListScreen";
import UserGuard from "./Settings/UserGuard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorScreen />,
        children: [{
            path: '',
            element: <DashboardScreen />
        }, {
            path: 'printlabels',
            element: <PrinterScreen />
        }, {
            path: 'settings',
            element: <UserGuard />,
            children: [{
                path: '',
                element: <SettingsScreen />
            }, {
                path: 'labels',
                element: <LabelHistoryScreen />
            }, {
                path: 'steri',
                element: <SteriListScreen />
            }, {
                path: 'steri/create',
                element: <SteriCreateScreen />
            }, {
                path: 'steri/:steri_id/edit',
                element: <SteriEditScreen />
            }, {
                path: 'users',
                element: <UserListScreen />
            }, {
                path: 'users/create',
                element: <UserCreateScreen />
            }, {
                path: 'users/:user_id/edit',
                element: <UserEditScreen />
            }]
        }]
    },
]);


function AppRouter() {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter
