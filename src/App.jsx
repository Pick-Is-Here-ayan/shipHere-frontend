import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Orders/Orders";
import Signup from "./pages/Signup/Signup";
import { useEffect } from "react";
import Login from "./pages/Login/Login";
import NDR from "./pages/NDR/NDR";
import CodRemmitance from "./pages/Finance/codRemmitance/CodRemmitance";
import SingleOrder from "./pages/Orders/CreateOrder/SingleOrder";
import ActiveWarehouses from "./pages/Warehouses/ActiveWarehouses";
import AddnewWarehouse from "./pages/Warehouses/AddnewWarehouse";
import RateCard from "./pages/RateCard/RateCard";
import PinCodeServicecability from "./pages/PincodeSeviceability/PinCodeServiceability";
import Finance from "./pages/Finance/Finance";
import Wallet from "./pages/Finance/wallet/Wallet";
import WeightDispensory from "./pages/Finance/weightDispencry/WeightDispensory";
import LostDamage from "./pages/Finance/lostDamage/LostDamage";
import Invoices from "./pages/Finance/invoice/Invoices";
import BulkOrderUpload from "./pages/Orders/BulkOrder/BulkOrder";
import Profile from "./pages/Profile/Profile";
import KYC from "./pages/KYC/KYC";
import AdminWallet from "./pages/Finance/wallet/AdminWallet";
import UpdatesingleOrder from "./pages/Orders/UpdateSingleOrder/UpdateSingleOrder";
import Pricing from "./pages/Finance/pricing/Pricing";
import RateCalculator from "./pages/RateCalculator/RateCalculator";
import NotFound from "./pages/NotFound/NotFound";
import ChannelIntergration from "./pages/channelIntegration/ChannelIntergration";
import Label from "./pages/Label/Label";
import LabelGenerator from "./pages/Orders/LabelGenerator/LabelGenerator";
import UpdateLebel from "./pages/Label/UpdateLebel";
import InvoiceGenerator from "./pages/Orders/InvoiceGenerator/InvoiceGenerator";
import Shopify from "./pages/channelIntegration/shopify/Shopify";
import { useAuthContext } from "./context/AuthContext";
import Reports from "./pages/Reports/Reports";
import MasterMIS_Report from "./pages/Reports/MasterMIS_Report";
import Support from "./pages/Support/Support";
import Ticket from "./pages/Support/Ticket";
import AdminMIS_Report from "./pages/Reports/AdminMIS_Report";
import ResetPassword from "./pages/Login/ResetPassword";
// import Tracking from "./pages/Orders/Tracking/Tracking";
import Tracking from "./components/Tracking/Tracking";
import Seller from "./pages/Seller/Seller";
import VerifyKyc from "./pages/Seller/VerifyKyc/VerifyKyc";
import WooCommerce from "./pages/channelIntegration/woocommerce/WooCommerce";
import WalletHistory from "./pages/Finance/wallet/WalletHistory";
import Settings from "./pages/Settings/Settings";
import Login1 from "./pages/Login/Login1";
import Signup1 from "./pages/Signup/Signup1";
import UpdateWarehouse from "./pages/Warehouses/updateWarehouse/UpdateWarehouse";
import ViewShopify from "./pages/channelIntegration/shopify/ViewShopify";
import ViewWoo from "./pages/channelIntegration/woocommerce/ViewWoo";
import Employee from "./pages/Employee/Employee";
import CreateEmployee from "./pages/Employee/CreateEmployee/CreateEmployee";
import UpdateEmployee from "./pages/Employee/UpdateEmployee/UpdateEmployee";
import EmployeeDash from "./pages/EmployeeDashboard/EmployeeDash";
import ProductWeight from "./pages/channelIntegration/productWeight/ProductWeight";
import Notification from "./pages/Notifications/Notification";
import CustomizeTrack from "./pages/Settings/CustomiseTrack/CustomizeTrack";
import Cancellation from "./pages/Login/cancellationRefund/Cancellation";
import ShippingPolicy from "./pages/Login/cancellationRefund/ShippingPolicy";
import TermCondition from "./pages/Login/cancellationRefund/TermCondition";
import PrivacyPolicy from "./pages/Login/cancellationRefund/PrivacyPolicy";
import AboutSection from "./pages/Login/cancellationRefund/AboutSection";
import ExtradeliveredOrder from "./pages/Orders/ExtradeliveredOrder";
import Blogs from "./pages/blogs/Blogs";
import Token from "./pages/Token";
const App = () => {
  const { authUser } = useAuthContext();
  const ProtectedRoute = ({ children }) => {
    if (!authUser) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };
  // to desable inspect
  // useEffect(() => {
  //   const desabl = (e) => {
  //     e.preventDefault();
  //   }
  //   document.addEventListener('contextmenu', desabl);
  //   return () => {
  //     document.removeEventListener('contextmenu', desabl);
  //     }
  // },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="kyc"
            element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/delivered"
            element={
              <ProtectedRoute>
                <ExtradeliveredOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee/addEmployee"
            element={
              <ProtectedRoute>
                <CreateEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee/:id"
            element={
              <ProtectedRoute>
                <UpdateEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller"
            element={
              <ProtectedRoute>
                <Seller />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller/getkyc/:id"
            element={
              <ProtectedRoute>
                <VerifyKyc />
              </ProtectedRoute>
            }
          />
          <Route
            path="label"
            element={
              <ProtectedRoute>
                <Label />
              </ProtectedRoute>
            }
          />
          <Route
            path="updatelabel"
            element={
              <ProtectedRoute>
                <UpdateLebel />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/singleorder"
            element={
              <ProtectedRoute>
                <SingleOrder />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:tabs/updateorder/:id/:orderId"
            element={
              <ProtectedRoute>
                <UpdatesingleOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="shipping/getlabel/:id"
            element={
              <ProtectedRoute>
                <LabelGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="shipping/getInvoice/:id"
            element={
              <ProtectedRoute>
                <InvoiceGenerator />
              </ProtectedRoute>
            }
          />

          <Route
            path="orders/bulkorder"
            element={
              <ProtectedRoute>
                <BulkOrderUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="ndr"
            element={
              <ProtectedRoute>
                {" "}
                <NDR />
              </ProtectedRoute>
            }
          />
          <Route
            path="finance"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          >
            <Route
              path="codremmitance"
              element={
                <ProtectedRoute>
                  <CodRemmitance />
                </ProtectedRoute>
              }
            />
            <Route
              path="wallet"
              element={
                authUser?.role === "admin" ? <AdminWallet /> : <Wallet />
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <WalletHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <WalletHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="pricing"
              element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              }
            />
            <Route
              path="lost_damage"
              element={
                <ProtectedRoute>
                  <LostDamage />
                </ProtectedRoute>
              }
            />
            <Route
              path="weight_discrepancies"
              element={
                <ProtectedRoute>
                  <WeightDispensory />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoices"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          >
            <Route
              path="misreport"
              element={
                authUser?.role === "admin" ? (
                  <AdminMIS_Report />
                ) : (
                  <MasterMIS_Report />
                )
              }
            />
            {/* <Route path="misreport" element={<ProtectedRoute><AdminMIS_Report /></ProtectedRoute>} /> */}
          </Route>
          <Route
            path="set_product_weight"
            element={
              <ProtectedRoute>
                <ProductWeight />
              </ProtectedRoute>
            }
          />
          <Route
            path="warehouse"
            element={
              <ProtectedRoute>
                <ActiveWarehouses />
              </ProtectedRoute>
            }
          />
          <Route
            path="warehouse/addwarehouse"
            element={
              <ProtectedRoute>
                <AddnewWarehouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="warehouse/:id"
            element={
              <ProtectedRoute>
                <UpdateWarehouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="ratecard"
            element={
              <ProtectedRoute>
                <RateCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="customize-track-order"
            element={
              <ProtectedRoute>
                <CustomizeTrack />
              </ProtectedRoute>
            }
          />
          <Route
            path="ratecalculator"
            element={
              <ProtectedRoute>
                <RateCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="ticket"
            element={
              <ProtectedRoute>
                <Ticket />
              </ProtectedRoute>
            }
          />
          <Route
            path="pincodeservice"
            element={
              <ProtectedRoute>
                <PinCodeServicecability />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="channelintegration"
            element={
              <ProtectedRoute>
                <ChannelIntergration />
              </ProtectedRoute>
            }
          />
          <Route
            path="channelintegration/Shopify"
            element={
              <ProtectedRoute>
                <Shopify />
              </ProtectedRoute>
            }
          />
          <Route
            path="channelintegration/yourChannel/shopify"
            element={
              <ProtectedRoute>
                <ViewShopify />
              </ProtectedRoute>
            }
          />
          <Route
            path="channelintegration/WooCommerce"
            element={
              <ProtectedRoute>
                <WooCommerce />
              </ProtectedRoute>
            }
          />
          <Route
            path="channelintegration/yourChannel/wooCommerce"
            element={
              <ProtectedRoute>
                <ViewWoo />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="signup" element={<Signup1 />} />
        <Route path="token" element={<Token />} />
        <Route path="employeedashboard" element={<EmployeeDash />} />
        <Route path="login" element={<Login1 />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="cancellation-refund-policy" element={<Cancellation />} />
        <Route path="shipping-policy" element={<ShippingPolicy />} />
        <Route path="term-policy" element={<TermCondition />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="about-policy" element={<AboutSection />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="tracking/:selectedOption/:shippingPartner/:awb"
          element={<Tracking />}
        />
      </Routes>
    </BrowserRouter>
  );
};
// test
export default App;
