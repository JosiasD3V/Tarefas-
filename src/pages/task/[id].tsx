import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styles from "./styles.module.css"
import { GetServerSideProps } from "next";
import {db} from "../../services/firebaseConnection"
import {doc,collection,query,where, getDoc , addDoc, getDocs, deleteDoc} from "firebase/firestore"
import { Textarea} from "../../components/textarea"
import { FaTrash } from "react-icons/fa";

interface taskProps{
    item:{
        tarefa:string,
        created:string,
        public:boolean,
        user:string,
        taskId:string
    };
    allComments:CommentsProps[]
}

interface CommentsProps{
    id:string,
    comment:string,
    taskId:string,
    user:string,
    name:string
}






//https://discommodious-alvaro-nonintrovertedly.ngrok-free.dev

export default function Task({item , allComments}: taskProps){
    const {data:session} = useSession();
    const [input,setInput] = useState("");
    const [comments , setComments] = useState<CommentsProps[]>(allComments|| [])

    
    
    async function handleDeleteComment(id:string){
    try{
        const docRef = doc(db, "comments",id)
        await deleteDoc(docRef)
        
        const deleteComment = comments.filter((comment) => comment.id !== id)

        setComments(deleteComment)

    }catch(err){
        console.log(err)
    }
    }
    async function handleComment(event:FormEvent) {
        event.preventDefault();
        if(input === "") return;

        if(!session?.user?.email || !session?.user?.name) return ; 


        try {
            const docRef = await addDoc(collection(db,"comments"), {
                comments: input,
                created: new Date(),
                user:session?.user.email,
                name:session?.user?.name,
                taskId: item?.taskId
            });

            const data = {
                id:docRef.id,
                comment:input,
                user:session?.user?.email,
                name:session?.user?.name,
                taskId: item?.taskId
            }

            setComments((oldItens)=> [...oldItens , data])

            setInput("");
        }catch(err){
            console.log(err)
        }
    }




    return(
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>
            <main className={styles.main}>
                <h1>Tarefa</h1>

                <article className={styles.task}>
                    <p>
                        {item.tarefa}
                    </p>
                </article>

            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar Comentário</h2>

                <form onSubmit={handleComment}>
                    <Textarea 
                    value={input}
                    onChange={(event:ChangeEvent<HTMLTextAreaElement>)=> setInput(event.target.value)}
                    placeholder="Digite seu comentário..."
                    />
                    <button 
                    className={styles.button}
                    disabled={!session?.user}>
                        Enviar Comentário
                        </button>
                </form>
            </section>

            <section className={styles.commentsContainer}>

                <h2>Todos os Comentários</h2>
                {comments.length ===0 &&(
                    <span>Nenhum comentário encontrado...</span>
                )}

                {comments.map((item)=>(
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentLabel}>{item.name}</label>
                            {item.user === session?.user?.email && (
                                <button className={styles.buttonTrash} onClick={()=> handleDeleteComment(item.id)}>
                                 <FaTrash size={18} color="#ea3140"/>
                                </button>
                            )}
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
            </section>

        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async ({params})=>{
    const id = params?.id as string 
    
    const docRef = doc(db, "tarefas", id)

    const q = query(collection(db, "comments"), where("taskId", "==", id))

    const snapshotComments = await getDocs(q) 
    let allComments:CommentsProps[] = [];

    snapshotComments.forEach((doc)=>{
        allComments.push({
            id:doc.id,
            comment:doc.data().comments,
            taskId:doc.data().taskId,
            user:doc.data().user,
            name:doc.data().name
        })
    })
    console.log(allComments)





    const snapShot = await getDoc(docRef)

    if(snapShot.data() === undefined ){
        return{
            redirect:{
                destination: "/",
                permanent:false
            }
        }
    }

    if(!snapShot.data()?.public){
        return{
            redirect:{
                destination: "/",
                permanent:false
            }
        }
    }

    const miliseconds = snapShot.data()?.created?.seconds * 1000;
    const task = {
        tarefa:snapShot.data()?.tarefas,
        public:snapShot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user:snapShot.data()?.user,
        taskId:id
    }


    return{
        props:{
            item:task,
            allComments:allComments,
        }
    }
}