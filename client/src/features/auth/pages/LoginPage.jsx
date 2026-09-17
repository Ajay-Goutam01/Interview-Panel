import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand Section */}
        <section className="relative hidden overflow-hidden bg-purple-600 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm">
                  AI
                </div>

                <span className="text-lg font-semibold text-white">
                  Interview Platform
                </span>
              </div>

              <div className="max-w-xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-purple-100">
                  AI-powered preparation
                </p>

                <h2 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                  Prepare smarter.
                  <br />
                  Interview better.
                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-purple-100">
                  Practice realistic interviews, improve your answers, and
                  understand where you can perform better.
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="max-w-md">
              <div className="mb-5 flex gap-2">
                <span className="h-1.5 flex-1 rounded-full bg-white" />
                <span className="h-1.5 flex-1 rounded-full bg-white/40" />
                <span className="h-1.5 flex-1 rounded-full bg-white/40" />
                <span className="h-1.5 flex-1 rounded-full bg-white/40" />
              </div>

              <p className="text-sm font-semibold text-white">Keep improving</p>

              <p className="mt-1 text-sm text-purple-100">
                Your next interview starts here.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white">
                AI
              </div>

              <span className="font-semibold">Interview Platform</span>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
