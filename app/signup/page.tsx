import { Button } from "@/components/ui/button";
import { Logo } from '@/components/logo';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-8">
              <Logo className="h-10 w-auto text-primary text-2xl" />
        </div>
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Writa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
          Unlock all features by logging in
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <div>
              <Button variant="outline" className="w-full bg-muted">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_103_2)"><path d="M47.532 24.5522C47.532 22.9214 47.393 21.3619 47.129 19.8391H24.288V28.5135H37.432C36.853 31.4595 35.253 33.9562 32.99 35.4362V41.3341H40.758C45.122 37.2124 47.532 31.3962 47.532 24.5522Z" fill="#4285F4"></path><path d="M24.288 48.0002C30.723 48.0002 36.143 45.8896 40.758 42.3343L32.99 36.4364C30.793 37.9164 27.811 38.7603 24.288 38.7603C17.853 38.7603 12.285 34.3318 10.368 28.704H2.438V34.7649C6.84 42.7118 14.887 48.0002 24.288 48.0002Z" fill="#34A853"></path><path d="M10.368 28.704C9.85205 27.1435 9.56205 25.4855 9.56205 23.7962C9.56205 22.1069 9.85205 20.4489 10.368 18.8884V12.8275H2.438C0.877049 15.8031 0 19.6735 0 23.7962C0 27.9189 0.877049 31.7893 2.438 34.7649L10.368 28.704Z" fill="#FBBC05"></path><path d="M24.288 8.83203C27.986 8.83203 31.11 10.0694 33.542 12.3614L40.931 4.97205C36.143 0.850346 30.723 0 24.288 0C14.887 0 6.84 5.28842 2.438 13.2353L10.368 19.2962C12.285 13.6682 17.853 8.83203 24.288 8.83203Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_103_2"><rect width="48" height="48" fill="white"></rect></clipPath></defs></svg>
                Continue with Google
              </Button>
            </div>
            <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                      or
                      </span>
                  </div>
              </div>
            <div>
              <Button variant="outline" className="w-full bg-muted  text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" height="48" viewBox="0 -960 960 960" width="48" fill="var(--foreground)"><path d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm680-525L496-473q-4 2-7.5 3.5T480-468q-5 0-8.5-1.5T464-473L140-685v465h680v-465ZM480-522l336-218H145l335 218ZM140-685v7V-717.32v.73V-740v23-.91V-678v-7 465-465Z"/></svg>
                Continue with Email
              </Button>
            </div>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:underline">
                Log In
              </a>
            </p>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>
            By logging in, you agree to our
              <a href="#" className="underline hover:text-blue-600">
                Terms of Service
              </a>{' '}<span className="text-gray-500">and</span>{' '}<a href="#" className="underline hover:text-blue-600">
                Privacy Policy
              </a>
              <br />
              copyright © 2025, Powered by Writa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}