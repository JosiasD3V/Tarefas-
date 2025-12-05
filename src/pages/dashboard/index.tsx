import { GetServerSideProps } from "next"
import { ChangeEvent, FormEvent, useState, useEffect} from "react"
import styles from "./styles.module.css"
import Head from "next/head"
import { getSession } from "next-auth/react"
import { Textarea } from "../../components/textarea"
import { FaShare } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { db } from "../../services/firebaseConnection"
import {addDoc, collection, query,orderBy, where,onSnapshot,doc,deleteDoc} from "firebase/firestore"
import Link from "next/link"

interface HomeProps{
    user:{
        email:string
    }
}

interface TaskProps{
    id:string,
    created: Date,
    public:boolean,
    tarefa:string,
    user: string
}

export default function Dashboard({user}:HomeProps){
    const [input,setInput] = useState("");
    const [publicTask, setPublicTask] = useState(false)
    const [tasks,setTasks] = useState<TaskProps[]>([])

    useEffect(()=>{
        async function loadTarefas(){
            const tarefasRef = collection(db, "tarefas") 
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            );
            onSnapshot(q,(snapshot)=>{
                let lista = [] as TaskProps[]

                snapshot.forEach((doc)=>{
                    lista.push({
                        id:doc.id,
                        tarefa: doc.data().tarefas,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })

                })
                setTasks(lista)
            })
        }
        loadTarefas();

    },[user?.email])



    function handleChangePublic(event:ChangeEvent<HTMLInputElement>){
        setPublicTask(event.target.checked)
    }

    async function hendleRegisterTask(event:FormEvent){
        event.preventDefault();
        if(input === "") return;
        
        try{
            await addDoc(collection(db, "tarefas"),{
                tarefas:input,
                created: new Date(),
                user: user?.email,
                public:publicTask
            }
        );
        setInput("");
        setPublicTask(false)



        }catch(err){
            console.log(err)
        }
    }

    async function handShare(id:string){
    await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
    }
    async function hendleDeleteTask(id:string){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)


    }



    return(
        <div className={styles.container}>
            <Head>
                <title>meu painel de tarefas</title>
                
            </Head>
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual é a sua tarefa?</h1>

                        <form onSubmit={hendleRegisterTask}>
                            <Textarea
                            placeholder="Digite qual a sua tarefa..."
                            value={input}
                            onChange={(event:ChangeEvent<HTMLTextAreaElement>)=>{
                                setInput(event.target.value)
                            }}
                            />
                            <div className={styles.checkBoxArea}>
                                <input 
                                type="checkbox"
                                className={styles.checkbox}
                                checked={publicTask}
                                onChange={handleChangePublic}
                                
                                />
                                <label >deixar tarefa pública?</label>
                            </div>
                            <button type="submit" className={styles.button}>
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>
                    
                    {tasks.map((item)=>(
                        <article className={styles.task}>
                        {item.public && (
                            <div key={item.id} className={styles.tagContainer}>
                            <label className={styles.tag}>PUBLICO</label>
                            <button className={styles.shareButton} onClick={()=>{
                                handShare(item.id)
                            }}><FaShare 
                            size={22}
                            color="#3183ff"
                            />
                            </button>
                        </div>
                        )}

                        <div className={styles.taskContent}>
                            {item.public ?(
                                <Link href={`/task/${item.id}`}>
                                <p>{item.tarefa}</p>
                                </Link>
                            ):(
                                <p>{item.tarefa}</p>
                            )}
                            <button className={styles.trashButton} onClick={()=> hendleDeleteTask(item.id)}>
                                <FaRegTrashCan 
                                size={24}
                                color="#ea3140"
                                />
                            </button>
                        </div>

                    </article>
                    ))}
                    

                </section>





            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req})=>{
    const session = await getSession({req})
    if(!session?.user){
        return{
            redirect:{
                destination:'/',
                permanent:false,
            }
        }
    }

    return{
        props:{
            user:{
                email:session?.user?.email,
            }
        },
    }

}