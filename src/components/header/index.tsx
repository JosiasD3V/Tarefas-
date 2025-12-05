import { useSession, signIn,signOut } from "next-auth/react"
import Link from "next/link"
import styles from "./styles.module.css"
export function Header(){

    const {data:session, status} = useSession()

    return(
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href="/">
                    <h1 className={styles.logo}>FocusDesk <span>+</span></h1>
                    </Link>
                    <Link href="/dashboard">
                    <h1 className={styles.link}>Meu Painel</h1>
                    </Link>
                </nav>
                
                {status === "loading"?(
                    <></>
                ):session?(
                    <button className={styles.loginButton} onClick={()=>signOut()}>
                        Olá {session?.user?.name}
                    </button>
                ): (
                    <button className={styles.loginButton} onClick={()=>signIn("google")}>Acessar</button>
                )}


            </section>
        </header>
    )
}