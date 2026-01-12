import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Toaster } from "react-hot-toast"
import LandingPage from "./Pages/LandingPage/LandingPage"
import SignUp from "./Pages/Auth/SignUp"
import Login from "./Pages/Auth/Login"

import JobSeekerDashboard from "./Pages/JobSeeker/JobSeekerDashboard"
import JobDetails from "./Pages/JobSeeker/JobDetails"
import SavedJobs from "./Pages/JobSeeker/SavedJobs"
import UserProfile from "./Pages/JobSeeker/UserProfile"
import AppliedJobs from "./Pages/JobSeeker/AppliedJobs"

import EmployerDashboard from "./Pages/Employer/EmployerDashboard"
import JobPostingForm from "./Pages/Employer/JobPostingForm"
import ManageJobs from "./Pages/Employer/ManageJobs"
import ApplicationViewer from "./Pages/Employer/ApplicationViewer"
import EmployerProfilePage from "./Pages/Employer/EmployerProfilePage"
import ProtectedRoute from "./routes/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

const App = () => {
  console.log("App rendered");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*Public Routes*/}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/find-jobs" element={<JobSeekerDashboard />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/profile" element={<UserProfile />} />

          {/*Protected Routes*/}
          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants" element={<ApplicationViewer />} />
            <Route path="/company-profile" element={<EmployerProfilePage />} />
          </Route>


          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </AuthProvider>
  )
}


export default App