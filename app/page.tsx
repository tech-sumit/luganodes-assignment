import AuthButton from '@/components/AuthButton';
import Logo from "@/components/Logo";
import Image from 'next/image'
import AssignmentImage from './img_assignment.png'
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {redirect} from 'next/navigation'

export default async function Index() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {data: {user}} = await supabase.auth.getUser()

    if (user) {
        return redirect('/dashboard')
    } else {
        return (
            <div className="flex-1 w-full flex flex-col items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full flex justify-between items-center p-3 text-sm">
                        <Logo/>
                        <AuthButton/>
                    </div>
                </nav>

                <div className="w-full flex-1 flex flex-col px-3">
                    <main className="flex-1 flex flex-col gap-6 w-full">
                        <div
                            className="w-full h-100 flex justify-center">
                            <Image
                                className="flex justify-center border-b border-b-foreground/10"
                                src={AssignmentImage}
                                width={500}
                                height={500}
                                alt="Assignment image"
                            />
                        </div>
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
}
