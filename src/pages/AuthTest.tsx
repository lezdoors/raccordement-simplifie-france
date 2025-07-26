import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AuthTest = () => {
  const { user, adminUser, loading, error } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Authentication Test Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Loading State */}
            <div>
              <h3 className="font-semibold mb-2">Loading State:</h3>
              <p className={`px-3 py-1 rounded text-sm ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {loading ? '⏳ Loading...' : '✅ Loaded'}
              </p>
            </div>

            {/* User State */}
            <div>
              <h3 className="font-semibold mb-2">User Authentication:</h3>
              {user ? (
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-green-800">✅ User Authenticated</p>
                  <p className="text-sm text-green-600">Email: {user.email}</p>
                  <p className="text-sm text-green-600">ID: {user.id}</p>
                </div>
              ) : (
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-red-800">❌ Not Authenticated</p>
                </div>
              )}
            </div>

            {/* Admin User State */}
            <div>
              <h3 className="font-semibold mb-2">Admin Authorization:</h3>
              {adminUser ? (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-blue-800">✅ Admin Authorized</p>
                  <p className="text-sm text-blue-600">Role: {adminUser.role}</p>
                  <p className="text-sm text-blue-600">Can see all leads: {adminUser.can_see_all_leads ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-blue-600">Can manage users: {adminUser.can_manage_users ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-blue-600">Can see payments: {adminUser.can_see_payments ? 'Yes' : 'No'}</p>
                </div>
              ) : (
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-red-800">❌ Not Authorized</p>
                  {error && <p className="text-sm text-red-600">Error: {error}</p>}
                </div>
              )}
            </div>

            {/* Test Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold">Test Actions:</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/login')} variant="outline">
                  Go to Login
                </Button>
                <Button onClick={() => navigate('/admin')} variant="outline">
                  Go to Admin
                </Button>
                <Button onClick={() => navigate('/')} variant="outline">
                  Go to Home
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Refresh Page
                </Button>
              </div>
            </div>

            {/* Connection Test */}
            <div>
              <h3 className="font-semibold mb-2">System Status:</h3>
              <div className="text-sm text-gray-600">
                <p>Current Route: {window.location.pathname}</p>
                <p>User Agent: {navigator.userAgent.slice(0, 50)}...</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;