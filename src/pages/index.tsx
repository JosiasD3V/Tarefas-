import {GetStaticProps} from "next"
import Head from "next/head";
import styles from "../../styles/home.module.css";
import Image from "next/image";
import heroImg from "../../public/assets/worldon.gif"
import { db } from "../services/firebaseConnection";
import {collection , getDocs} from "firebase/firestore"


interface HomeProps{
  posts: number,
  comments: number
}


export default function Home({posts, comments}:HomeProps) {
  return (
    <div className={styles.container}>
      <Head> <title>organize suas tarefas de uma forma fácil</title></Head>
    <main className={styles.main}>
      <div className={styles.logoContent}>
        <Image className={styles.hero} 
        alt="Logo"
        src={heroImg}
        priority/>
      </div>
      <h1 className={styles.title} >Sistema feito para você organizar <br />
       seus estudos e  tarefas</h1>
      <div className={styles.infoContent}>
      <section>
        <span className={styles.box}>+{posts} Posts</span>
      </section>
      <section>
        <span className={styles.box}>+{comments} Comentários</span>
      </section>

      </div>

    </main>

    </div>
  );
}

export const getStaticProps: GetStaticProps = async ()=>{

  const commentRef = collection(db, "comments");
  const postRef = collection(db , "tarefas")

  const commentsSnapshot = await getDocs(commentRef);
  const postSnaphot = await getDocs (postRef);

  return{
    props:{
      posts: postSnaphot.size || 0 ,
      comments: commentsSnapshot.size || 0,
    },
    revalidate: 60 , //60 segundos para atualizar
  }
}
