
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
import SteriItemCreateScreen from "./Settings/SteriItem/SteriItemCreateScreen";
import SteriItemEditScreen from "./Settings/SteriItem/SteriItemEditScreen";
import SteriItemListScreen from "./Settings/SteriItem/SteriItemListScreen";
import UserCreateScreen from "./Settings/User/UserCreateScreen";
import UserEditScreen from "./Settings/User/UserEditScreen";
import UserListScreen from "./Settings/User/UserListScreen";
import UserGuard from "./Settings/UserGuard";
import SteriCycleEditScreen from "./SteriCycle/SteriCycleEditScreen";
import SteriCycleListScreen from "./SteriCycle/SteriCycleListScreen";
import SteriCycleScreen from "./SteriCycle/SteriCycleScreen";
import SteriCycleStartScreen from "./SteriCycle/SteriCycleStartScreen";
import ToolsScreen from "./Tools/ToolsScreen";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorScreen />,
        children: [{
            path: '',
            element: <DashboardScreen />
        }, {
            path: 'cycles',
            element: <SteriCycleListScreen />
        }, {
            path: 'cycles/create',
            element: <SteriCycleStartScreen />
        }, {
            path: 'cycles/:cycle_id',
            element: <SteriCycleScreen />
        }, {
            path: 'cycles/:cycle_id/edit',
            element: <SteriCycleEditScreen />
        }, {
            path: 'printlabels',
            element: <PrinterScreen />
        }, {
            path: 'tools',
            element: <ToolsScreen />
        },{
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
            }, {
                path: 'steri-items',
                element: <SteriItemListScreen />
            }, {
                path: 'steri-items/create',
                element: <SteriItemCreateScreen />
            }, {
                path: 'steri-items/:steri_item_id/edit',
                element: <SteriItemEditScreen />
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
