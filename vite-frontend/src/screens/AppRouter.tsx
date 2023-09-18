
import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import Layout from "../components/Layout";
import DashboardScreen from "./Dashboard/DashboardScreen";
import ErrorScreen from "./ErrorScreen";
import PrinterScreen from "./Printer/PrinterScreen";

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
        }]
    },
]);


function AppRouter() {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter
