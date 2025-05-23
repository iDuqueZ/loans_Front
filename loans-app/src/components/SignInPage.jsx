import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

function SignInPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Bienvenido a Pagame Ve
            </h1>
            
            <SignedOut>
              <SignInButton
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg
                         hover:bg-indigo-600 transition-colors duration-200
                         font-medium text-sm focus:outline-none focus:ring-2
                         focus:ring-indigo-500 focus:ring-offset-2"
              />
            </SignedOut>
            
            <SignedIn>
              <div className="mt-4">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonBox: "mx-auto",
                      userButtonAvatarBox: "h-12 w-12"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      );
}

export default SignInPage;
