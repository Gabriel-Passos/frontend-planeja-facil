import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PublicRoute } from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppRoutes } from "../constants/app-routes";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TrashPage } from "../pages/TrashPage";
import { YearsPage } from "../pages/MyPlanning/YearsPage";
import { MonthsPage } from "../pages/MyPlanning/MonthsPage";
import { PlanningPage } from "../pages/MyPlanning/PlanningPage";
import { ProfilePage } from "../pages/ProfilePage";

export function CustomRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
          <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
          <Route
            path={AppRoutes.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          {/* <Route path={AppRoutes.RESET_PASSWORD} element={<ResetPasswordPage />} /> */}
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={AppRoutes.DASHBOARD} element={<DashboardPage />} />
          <Route path={AppRoutes.TRASH} element={<TrashPage />} />
          <Route path={AppRoutes.MY_PLANNING} element={<YearsPage />} />
          <Route path={AppRoutes.MY_PLANNING_MONTHS} element={<MonthsPage />} />
          <Route
            path={AppRoutes.MY_PLANNING_MONTHS_PLANNING}
            element={<PlanningPage />}
          />
          <Route path={AppRoutes.PROFILE} element={<ProfilePage />} />
          {/* <Route path={AppRoutes.CONFIRM_ACCOUNT} element={<ConfirmAccountPage />} /> */}
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
