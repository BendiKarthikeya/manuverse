@@ .. @@
 import AuthPage from './components/Auth/AuthPage';
 import DocumentUploadPage from './components/Upload/DocumentUploadPage';
 import HeroSection from './components/LandingPage/HeroSection';
+import AIAgentPage from './components/AIAgent/AIAgentPage';
 
 
 
@@ .. @@
     case 'ai-agent':
-      // Placeholder for AI Agent (you can add this later)
       return user ? (
-        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
-          <div className="text-center">
-            <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Agent Coming Soon!</h1>
-            <p className="text-gray-600 mb-6">This feature is under development.</p>
-            <button
-              onClick={() => handlePageChange('landing')}
-              className="bg-manu-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
-            >
-              Back to Home
-            </button>
-          </div>
-        </div>
+        <AIAgentPage
+          user={user}
+          onPageChange={handlePageChange}
+          onLogout={handleLogout}
+        />
       ) : (
         <AuthPage onUserAuth={handleUserAuth} onPageChange={handlePageChange} />
       );