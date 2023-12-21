import AuthButton from '../components/AuthButton'
import {cookies} from 'next/headers'
import Logo from "@/components/Logo";

export default async function Index() {
    const cookieStore = cookies()

    return (
        <div className="flex-1 w-full flex flex-col items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full flex justify-between items-center p-3 text-sm">
                    <Logo/>
                    <AuthButton/>
                </div>
            </nav>

            <div className="flex-1 flex flex-col opacity-0 px-3">
                <main className="flex-1 flex flex-col gap-6">

                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <p>
                    Powered by{' '}
                    <a
                        href="https://sumitagrawal.dev/"
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                    >
                        Sumit Agrawal
                    </a>
                </p>
            </footer>
        </div>
    )
}
